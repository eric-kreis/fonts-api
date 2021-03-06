import axios from 'axios';
import fs from 'fs';
import { StatusCodes } from 'http-status-codes';
import { IApiFonts, IFontFamily } from '../interfaces/font';
import kebabCaseSerializer from '../serializers/kebab-case.serializer';
import HttpError from '../utils/http-error';

const { API_KEY } = process.env;

class FontService {
  private baseURL: string;

  constructor() {
    const API_URL = 'https://www.googleapis.com/webfonts/v1/webfonts?key=';
    this.baseURL = `${API_URL}${API_KEY}`;
  }

  private getFamilyDir(family: string) {
    const familyName = kebabCaseSerializer(family);
    const familyDir = `${process.cwd()}/fonts/${familyName}`;
    return familyDir;
  }

  familyExists(family: string) {
    const familyDir = this.getFamilyDir(family);
    if (fs.existsSync(familyDir)) {
      return true;
    }
    return false;
  }

  async findByFamily(family: string) {
    const { data } = await axios.get<IApiFonts>(this.baseURL);
    const fonts = data.items;
    const fontFamily = fonts.find((font) => (
      kebabCaseSerializer(font.family).includes(kebabCaseSerializer(family))
    ));
    if (!fontFamily) throw new HttpError(`Family ${family} not found`, StatusCodes.NOT_FOUND);
    return fontFamily;
  }

  async writeByFamily(fontFamily: IFontFamily) {
    const familyDir = this.getFamilyDir(fontFamily.family);
    if (this.familyExists(fontFamily.family)) {
      throw new HttpError(
        `Family "${fontFamily.family}" already downloaded`,
        StatusCodes.CONFLICT,
      );
    }
    fs.mkdirSync(familyDir, { recursive: true });
    const subFonts = await Promise.all(
      Object.entries(fontFamily.files).map(async ([subFont, fileURL]) => {
        const subfontResponse = await axios.get(fileURL, { responseType: 'arraybuffer' });
        return [subFont, subfontResponse.data];
      }),
    );
    subFonts.forEach(([subFont, fileContent]) => {
      const fileName = `${kebabCaseSerializer(subFont)}.ttf`;
      fs.writeFileSync(`${familyDir}/${fileName}`, fileContent);
    });
    return { [fontFamily.family]: fontFamily.variants };
  }
}

export default FontService;

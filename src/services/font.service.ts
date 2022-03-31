import axios from 'axios';
import fs from 'fs';
import { StatusCodes } from 'http-status-codes';
import { IApiFonts, IFontFamily } from '../interfaces/font';
import HttpError from '../utils/http-error';

class FontService {
  private baseURL: string;

  constructor() {
    const { API_KEY } = process.env;
    const API_URL = 'https://www.googleapis.com/webfonts/v1/webfonts?key=';
    this.baseURL = `${API_URL}${API_KEY}`;
  }

  async findByFamily(family: string) {
    const { data } = await axios.get<IApiFonts>(this.baseURL);
    const fonts = data.items;
    const fontFamily = fonts.find((font) => (
      font.family.toLowerCase().includes(family.toLowerCase())
    ));
    if (!fontFamily) throw new HttpError(`family ${family} not found`, StatusCodes.NOT_FOUND);
    return fontFamily;
  }

  async writeByFamily(fontFamily: IFontFamily) {
    const familyDir = `${process.cwd()}/fonts/${fontFamily.family.toLowerCase()}`;
    if (fs.existsSync(familyDir)) {
      throw new HttpError(`family ${fontFamily.family} already exists`, StatusCodes.CONFLICT);
    }
    const subFonts = Object.entries(fontFamily.files);
    fs.mkdirSync(familyDir, { recursive: true });
    subFonts.forEach(async ([subFont, fileURL]) => {
      const subfontResponse = await axios.get(fileURL, { responseType: 'arraybuffer' });
      fs.writeFileSync(`${familyDir}/${subFont}.ttf`, subfontResponse.data);
    });
  }
}

export default FontService;

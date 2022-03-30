import axios from 'axios';
import dotenv from 'dotenv';
import { IApiFonts } from '../interfaces/font';
dotenv.config();

const { API_KEY } = process.env;
const API_URL =  'https://www.googleapis.com/webfonts/v1/webfonts?key=';

class FontService {
  private apiUrl: string;

  constructor() {
    this.apiUrl = `${API_URL}${API_KEY}`;
  }

  async getAllFonts(family: string) {
    const { data } = await axios.get<IApiFonts>(this.apiUrl)
    const fonts = data.items;
    const fontFamily = fonts.find((font) => font.family.toLowerCase() === family.toLowerCase());
    if (!fontFamily) throw { status: 404, message: 'fonte não encontrada' };
    Promise.all(Object.values(fontFamily.files).map(async (file) => axios.get(file)))
    return fontFamily
  }
}

export default FontService;

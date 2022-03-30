import { NextFunction, Request, Response } from 'express';
import FontService from '../services/font.service';

class FontController {
  constructor(private service: FontService) {}

  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { family } = req.params;
      await this.service.getAllFonts(family);
    } catch (e) {
      console.log(e)
      next(e)
    }
  }
}

export default FontController;

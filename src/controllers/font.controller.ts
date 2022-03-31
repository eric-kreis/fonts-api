import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import FontService from '../services/font.service';
import HttpError from '../utils/http-error';

class FontController {
  constructor(private readonly service: FontService) {
    this.findAll = this.findAll.bind(this);
  }

  async findAll(req: Request, res: Response) {
    const { family } = req.query;
    if (!family) throw new HttpError('missing family', StatusCodes.NOT_FOUND);
    const fontFamily = await this.service.findByFamily(family as string);
    await this.service.writeByFamily(fontFamily);
    res.status(StatusCodes.NO_CONTENT).end();
  }
}

export default FontController;

import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import FontService from '../services/font.service';
import Controller from '../utils/controller.decorator';
import { Get } from '../utils/handlers.decorator';
import HttpError from '../utils/http-error';

@Controller('/fonts')
class FontController {
  constructor(private readonly service: FontService) {}

  @Get()
  async downloadFamily(req: Request, res: Response) {
    const { family } = req.query;
    if (!family) throw new HttpError('Missing family name', StatusCodes.NOT_FOUND);
    const fontFamily = await this.service.findByFamily(family as string);
    const familyInfo = await this.service.writeByFamily(fontFamily);
    res.status(StatusCodes.CREATED).json(familyInfo);
  }
}

export default FontController;

import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import FontService from '../../services/font.service';
import Controller from '../../utils/controller.decorator';
import { Get } from '../../utils/handlers.decorator';
import HttpError from '../../utils/http-error';

@Controller('/fonts')
class FontController {
  constructor(public readonly service: FontService) {}

  @Get()
  async downloadFamily(req: Request, res: Response) {
    const { family } = req.query;
    if (!family) throw new HttpError('Missing family name', StatusCodes.NOT_FOUND);
    const fontFamily = await this.service.findByFamily(family as string);
    const familyInfo = await this.service.writeByFamily(fontFamily);
    res.status(StatusCodes.CREATED).json(familyInfo);
  }

  @Get('/verify')
  async verifyFamily(req: Request, res: Response) {
    const { family } = req.query;
    if (!family) throw new HttpError('Missing family name', StatusCodes.NOT_FOUND);
    const exists = this.service.familyExists(family as string);
    if (!exists) throw new HttpError('Family not downloaded', StatusCodes.NOT_FOUND);
    res.status(StatusCodes.NO_CONTENT).end();
  }
}

export default FontController;

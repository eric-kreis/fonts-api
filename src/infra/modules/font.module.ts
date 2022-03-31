import FontService from '../../services/font.service';
import Module from '../../utils/module.decorator';
import FontController from '../controllers/font.controller';

@Module({
  controllers: [FontController],
  providers: [FontService],
})
export class FontModule {}

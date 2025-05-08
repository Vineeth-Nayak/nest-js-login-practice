import { ConfigModule } from '@nestjs/config';
import configuration from './configuration';
import { validationSchema } from './schema';

export const AppConfigModule = ConfigModule.forRoot({
  isGlobal: true,
  load: [configuration],
  validationSchema,
});

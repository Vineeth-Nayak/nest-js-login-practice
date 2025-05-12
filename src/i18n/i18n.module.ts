import { Module } from '@nestjs/common';
import { AcceptLanguageResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import * as path from 'path';

@Module({
  imports: [
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.resolve(process.cwd(), 'src', 'i18n'),
        // path: path.join(__dirname, '../i18n/'),
        watch: true,
      },
      resolvers: [
        { use: AcceptLanguageResolver, options: ['accept-language'] },
        QueryResolver,
      ],
    }),
  ],
})
export class AppI18nModule {}

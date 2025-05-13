import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { validate, ValidationError } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { I18nService, I18nContext } from 'nestjs-i18n';

@Injectable()
export class I18nValidationPipe implements PipeTransform {
  constructor(private readonly i18n: I18nService) {}

  async transform(value: any, metadata: ArgumentMetadata) {
    if (!metadata.metatype || !this.toValidate(metadata.metatype)) {
      return value;
    }

    const object = plainToInstance(metadata.metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      const error = await this.getFirstError(errors[0]);
      throw new BadRequestException(error);
    }

    return value;
  }

  private async getFirstError(error: ValidationError): Promise<string> {
    if (error.constraints) {
      const firstConstraintKey = Object.keys(error.constraints)[0];
      const firstConstraint = error.constraints[firstConstraintKey];
      const context = (error.contexts || {})[firstConstraintKey];

      const lang = I18nContext.current()?.lang;

      let translatedField = context?.field || '';
      if (translatedField) {
        const translated = await this.i18n.translate(
          `fields.${translatedField.toLowerCase()}`,
          {
            lang,
            defaultValue: translatedField,
          },
        );

        if (
          translated &&
          translated !== `fields.${translatedField.toLowerCase()}`
        ) {
          translatedField = translated;
        }
      }

      let translatedMessage = await this.i18n.translate(
        `validation.${firstConstraint}`,
        {
          lang,
          defaultValue: firstConstraint,
        },
      );

      translatedMessage = translatedMessage.replace(
        '{{field}}',
        translatedField,
      );

      return translatedMessage;
    }

    if (error.children && error.children.length > 0) {
      return this.getFirstError(error.children[0]);
    }

    const lang = I18nContext.current()?.lang;

    return await this.i18n.translate('validation.validation_error', {
      lang,
      defaultValue: 'Validation error',
    });
  }

  private toValidate(meta: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(meta);
  }
}

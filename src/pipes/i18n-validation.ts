import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { validate, ValidationError } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { I18nService } from 'nestjs-i18n';

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

      // Get the context if it exists
      const context = (error.contexts || {})[firstConstraintKey];

      // Translate the validation message
      let translated = await this.i18n.translate(
        `validation.${firstConstraint}`,
      );

      // Translate the field if context.field exists
      let translatedField = '';
      if (context && context.field) {
        translatedField = await this.i18n.translate(
          `fields.${context.field.toLowerCase()}`,
        );

        if (
          translatedField.length > 0 &&
          !translatedField.startsWith('validation.fields')
        ) {
          translated = translated.replace(`{{field}}`, translatedField);
        }
      }

      if (translated.startsWith('validation.')) {
        translated = translated.replace(`validation.`, '');
      }

      return translated;
    }

    if (error.children && error.children.length > 0) {
      return this.getFirstError(error.children[0]);
    }

    return await this.i18n.translate('validation.validation_error');
  }

  private toValidate(meta: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(meta);
  }
}

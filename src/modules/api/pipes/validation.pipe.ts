import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

const marshalValidationErrors = (errors: any[]) => {
  return errors.map((prop: { property: string | number; constraints: any; }) => {
    const newErrorObject = {};
    newErrorObject[prop.property] = prop.constraints;
    return newErrorObject;
  });
};

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToClass(metatype, value);
    // Pass `skipMissingProperties` as part of the custom validation
    const errors = await validate(object);
    if (errors.length > 0) {
      throw new BadRequestException(marshalValidationErrors(errors));
    }
    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
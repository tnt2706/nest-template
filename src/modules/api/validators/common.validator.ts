import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import isUUID = require('is-uuid');
import { getConnection, getManager } from 'typeorm';

export function IsGteThan(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function(object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'isGteThan',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          return (
            typeof value === 'number' &&
            typeof relatedValue === 'number' &&
            value >= relatedValue
          );
        },
      },
    });
  };
}

export function MatchPassword(validationOptions?: ValidationOptions) {
  return function(object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'matchPassword',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: string) {
          return (
            typeof value === 'string' &&
            new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})').test(
              value,
            )
          );
        },
      },
    });
  };
}

export function IsArrayUUID(validationOptions?: ValidationOptions) {
  return function(object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'isArrayUUID',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(values: any) {
          let isValid = false;
          const result = [];
          if (Array.isArray(values)) {
            for (const value of values) {
              if (isUUID.v4(value)) {
                result.push(value);
              }
            }
            if (result.length === values.length) {
              isValid = true;
            }
          }
          return isValid;
        },
      },
    });
  };
}

export function IsUnique(params: {}, validationOptions?: ValidationOptions) {
  return function(object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'IsUnique',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [params],
      validator: {
        async validate(columnNameValue: any, args: ValidationArguments) {
          const params = args.constraints[0];
          const user = await getManager()
            .query(
              `SELECT * FROM ${params.table} WHERE ${params.column} = '${columnNameValue}'`
            );
          if (user[0])
            return false;
          return true;
        }
      },
    });
  };
}

export function IsUniqueId(params: {}, validationOptions?: ValidationOptions) {
  return function(object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'isUniqueId',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [params],
      validator: {
        async validate(columnNameValue: any, args: ValidationArguments) {
          const params = args.constraints[0];
          let isValid = false;
          if (isUUID.v4(columnNameValue)) {
            const query = `SELECT count(id) FROM ${params.table} WHERE id = $1`;
            const result = await getConnection().query(query, [
              columnNameValue,
            ]);
            if (Number(result[0].count) === 0) {
              isValid = true;
            }
          }
          return isValid;
        },
      },
    });
  };
}
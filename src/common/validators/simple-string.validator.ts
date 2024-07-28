/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function IsSimpleString(validationOptions?: ValidationOptions) {
  return function (object: NonNullable<unknown>, propertyName: string) {
    registerDecorator({
      name: 'isSimpleString',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return (
            typeof value === 'string' &&
            !!/^[a-zA-Z0-9 !@€£$#%^&*()_\-+={}\[\];:'"\\|~`<>,.?\/]*$/.exec(
              value,
            )
          );
        },
        defaultMessage(args: ValidationArguments) {
          return '$property contains invalid characters';
        },
      },
    });
  };
}

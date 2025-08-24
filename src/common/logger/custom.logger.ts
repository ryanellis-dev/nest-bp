import { ConsoleLogger, LogLevel } from '@nestjs/common';

export class CustomLogger extends ConsoleLogger {
  // /**
  //  * Write a 'log' level log, if the configured level allows for it.
  //  * Prints to `stdout` with newline.
  //  */
  // log(message: any, context?: string): void;
  // log(message: any, ...optionalParams: [...any, string?]): void {
  //   const params = [...optionalParams];
  //   let context: string | undefined;

  //   // If the last param is a string, treat it as context
  //   if (params.length && typeof params[params.length - 1] === 'string') {
  //     context = params.pop();
  //   }

  //   // Combine all remaining params into a single object
  //   const logObject: Record<string, any> = { message };
  //   if (params.length > 0) {
  //     logObject.params = params.length === 1 ? params[0] : params;
  //   }

  //   super.log(logObject, context);
  // }

  // /**
  //  * Write an 'error' level log, if the configured level allows for it.
  //  * Prints to `stderr` with newline.
  //  */
  // error(message: any, stackOrContext?: string): void;
  // error(message: any, stack?: string, context?: string): void;
  // error(message: any, ...optionalParams: [...any, string?, string?]): void {
  //   const params = [...optionalParams];
  //   let stack: string | undefined;
  //   let context: string | undefined;

  //   // If the last param is a string, treat it as context
  //   if (params.length && typeof params[params.length - 1] === 'string') {
  //     context = params.pop();
  //   }

  //   // If the last param is a string, treat it as stack
  //   if (params.length && typeof params[params.length - 1] === 'string') {
  //     stack = params.pop();
  //   }

  //   // Combine all remaining params into a single object
  //   const logObject: Record<string, any> = { message };
  //   if (stack) {
  //     logObject.stack = stack;
  //   }
  //   if (params.length > 0) {
  //     logObject.params = params.length === 1 ? params[0] : params;
  //   }

  //   super.error(logObject, context);
  // }

  // /**
  //  * Write a 'warn' level log, if the configured level allows for it.
  //  * Prints to `stdout` with newline.
  //  */
  // warn(message: any, context?: string): void;
  // warn(message: any, ...optionalParams: [...any, string?]): void {
  //   const params = [...optionalParams];
  //   let context: string | undefined;

  //   // If the last param is a string, treat it as context
  //   if (params.length && typeof params[params.length - 1] === 'string') {
  //     context = params.pop();
  //   }

  //   // Combine all remaining params into a single object
  //   const logObject: Record<string, any> = { message };
  //   if (params.length > 0) {
  //     logObject.params = params.length === 1 ? params[0] : params;
  //   }

  //   super.warn(logObject, context);
  // }

  // /**
  //  * Write a 'debug' level log, if the configured level allows for it.
  //  * Prints to `stdout` with newline.
  //  */
  // debug(message: any, context?: string): void;
  // debug(message: any, ...optionalParams: [...any, string?]): void {
  //   const params = [...optionalParams];
  //   let context: string | undefined;

  //   // If the last param is a string, treat it as context
  //   if (params.length && typeof params[params.length - 1] === 'string') {
  //     context = params.pop();
  //   }

  //   // Combine all remaining params into a single object
  //   const logObject: Record<string, any> = { message };
  //   if (params.length > 0) {
  //     logObject.params = params.length === 1 ? params[0] : params;
  //   }

  //   super.debug(logObject, context);
  // }

  // /**
  //  * Write a 'verbose' level log, if the configured level allows for it.
  //  * Prints to `stdout` with newline.
  //  */
  // verbose(message: any, context?: string): void;
  // verbose(message: any, ...optionalParams: [...any, string?]): void {
  //   const params = [...optionalParams];
  //   let context: string | undefined;

  //   // If the last param is a string, treat it as context
  //   if (params.length && typeof params[params.length - 1] === 'string') {
  //     context = params.pop();
  //   }

  //   // Combine all remaining params into a single object
  //   const logObject: Record<string, any> = { message };
  //   if (params.length > 0) {
  //     logObject.params = params.length === 1 ? params[0] : params;
  //   }

  //   super.verbose(logObject, context);
  // }

  // /**
  //  * Write a 'fatal' level log, if the configured level allows for it.
  //  * Prints to `stdout` with newline.
  //  */
  // fatal(message: any, context?: string): void;
  // fatal(message: any, ...optionalParams: [...any, string?]): void {
  //   const params = [...optionalParams];
  //   let context: string | undefined;

  //   // If the last param is a string, treat it as context
  //   if (params.length && typeof params[params.length - 1] === 'string') {
  //     context = params.pop();
  //   }

  //   // Combine all remaining params into a single object
  //   const logObject: Record<string, any> = { message };
  //   if (params.length > 0) {
  //     logObject.params = params.length === 1 ? params[0] : params;
  //   }

  //   super.fatal(logObject, context);
  // }

  protected printMessages(
    messages: unknown[],
    context?: string,
    logLevel?: LogLevel,
    writeStreamType?: 'stdout' | 'stderr',
    errorStack?: unknown,
  ): void {
    this.printAsJson(messages, {
      context: context || '',
      logLevel: logLevel || 'log',
      writeStreamType: writeStreamType,
      errorStack: errorStack,
    });
  }
}

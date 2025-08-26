import { ConsoleLogger, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { promises as fsPromises } from 'fs';

@Injectable()
export class MyLoggerService extends ConsoleLogger {
  private logDir: string;

  constructor(context?: string) {
    super(context);
    // Set the log directory path correctly
    this.logDir = path.join(process.cwd(), 'logs');
  }

  async logToFile(entry: string, level: string = 'INFO') {
    const formattedEntry = `${Intl.DateTimeFormat('en-US', {
      dateStyle: 'short',
      timeStyle: 'medium',
      timeZone: 'Asia/Kolkata',
    }).format(new Date())}\t[${level}]\t${entry}\n`;

    try {
      // Ensure log directory exists
      if (!fs.existsSync(this.logDir)) {
        await fsPromises.mkdir(this.logDir, { recursive: true });
      }

      // Append to log file
      await fsPromises.appendFile(
        path.join(this.logDir, 'myLogFile.log'),
        formattedEntry,
      );
    } catch (e) {
      // Use super.error to ensure the error is logged properly
      super.error(
        `Failed to write to log file: ${e.message}`,
        e.stack,
        'MyLoggerService',
      );
    }
  }

  log(message: any, context?: string) {
    const entry = `${context}\t${message}`;
    this.logToFile(entry, 'INFO');
    super.log(message, context);
  }

  error(message: any, stackOrContext?: string) {
    const entry = `${stackOrContext}\t${message}`;
    this.logToFile(entry, 'ERROR');
    super.error(message, stackOrContext);
  }

  warn(message: any, context?: string) {
    const entry = `${context}\t${message}`;
    this.logToFile(entry, 'WARN');
    super.warn(message, context);
  }

  debug(message: any, context?: string) {
    const entry = `${context}\t${message}`;
    this.logToFile(entry, 'DEBUG');
    super.debug(message, context);
  }

  verbose(message: any, context?: string) {
    const entry = `${context}\t${message}`;
    this.logToFile(entry, 'VERBOSE');
    super.verbose(message, context);
  }
}

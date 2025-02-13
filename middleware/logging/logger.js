const { createLogger, transports, format } = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const fs = require('fs');
const path = require('path');

const logDirectory = path.resolve('logs');

// Create log directory if it does not exist
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

const logger = createLogger({
  level: 'debug', // This will allow 'debug' and all higher priority logs (debug, info, warn, error)
  transports: [
    new transports.Console({
      level: 'debug', // Console will show 'debug' and above
      format: format.combine(
        format.errors({ stack: true }),
        format.colorize(),
        format.simple()
      )
    }),
    new DailyRotateFile({
      level: 'debug', // File will show 'debug' and above
      filename: `${logDirectory}/%DATE%.log`,
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      format: format.combine(
        format.errors({ stack: true }),
        format.timestamp(),
        format.json()
      )
    })
  ],
  exceptionHandlers: [
    new DailyRotateFile({
      filename: `${logDirectory}/exceptions-%DATE%.log`,
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      format: format.combine(
        format.errors({ stack: true }),
        format.timestamp(),
        format.json()
      )
    })
  ],
  exitOnError: false 
});


module.exports = logger;

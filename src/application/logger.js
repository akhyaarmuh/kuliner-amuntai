import winston from 'winston';
import 'winston-daily-rotate-file';
import { nodeEnv } from '../secret.js';

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [new winston.transports.Console({})],
});

if (nodeEnv === 'production') {
  logger.format = winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  );
  logger.defaultMeta = { service: 'user-service' };
  logger.add(
    new winston.transports.DailyRotateFile({
      level: 'info',
      filename: 'application-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
    })
  );
}

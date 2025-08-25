import fs from 'fs';
import path from 'path';

const logFile = path.join(process.cwd(), 'audit.log');

export function logSecurityEvent(eventType, details) {
  const entry = {
    timestamp: new Date().toISOString(),
    eventType,
    details
  };
  fs.appendFileSync(logFile, JSON.stringify(entry) + '\n');
}

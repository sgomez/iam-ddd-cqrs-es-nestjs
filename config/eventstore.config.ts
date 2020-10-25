import { registerAs } from '@nestjs/config';

export const eventstoreConfig = registerAs('eventstore', () => ({
  url: process.env.EVENTSTORE_URL || 'mongodb://localhost/eventstore',
}));

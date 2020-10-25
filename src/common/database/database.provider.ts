import { ConfigService } from '@nestjs/config';
import { Connection, createConnection } from 'mongoose';

import { DATABASE_CONNECTION } from '.';

export const DatabaseProvider = [
  {
    provide: DATABASE_CONNECTION,
    useFactory: async (config: ConfigService): Promise<Connection> =>
      await createConnection(config.get<string>('database.url'), {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
    inject: [ConfigService],
  }
];

import { ConfigService } from '@nestjs/config';
import { connect, Mongoose } from 'mongoose';

export const DatabaseProvider = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: async (config: ConfigService): Promise<Mongoose> =>
      connect(config.get<string>('database.url'), {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
    inject: [ConfigService],
  },
];

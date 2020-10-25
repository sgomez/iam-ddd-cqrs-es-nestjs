import { INestApplication } from '@nestjs/common';
import { ReconstructViewDb } from 'event-sourcing-nestjs';

import { Script } from './script';

Script.run(async (app: INestApplication) => {
  await ReconstructViewDb.run(app);
});

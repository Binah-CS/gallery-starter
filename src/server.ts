import { createApp } from './app.ts';
import { openDb } from './data/db.ts';

const port = Number(process.env.PORT ?? 3000);
createApp({ db: openDb() }).listen(port, () => {
  console.log(`Gallery API on http://localhost:${port}`);
});

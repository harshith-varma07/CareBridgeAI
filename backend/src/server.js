import { app } from './app.js';
import { connectDb } from './config/db.js';

const port = Number(process.env.PORT || 5000);

connectDb()
  .then(() => {
    app.listen(port, () => {
      // eslint-disable-next-line no-console
      console.log(`Backend running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error('Failed to connect DB', error);
    process.exit(1);
  });

import express from 'express';
import massive from 'massive';
// import path from 'path';

import Secret from './dbpiper-secret';

const connectionString = process.env.DATABASE_URL
                          || `postgres://${Secret.username}:${Secret.password}@localhost:5432/dvdrental`;
const app = express();
// const router = express.Router();
(async () => {
  const db = await massive(connectionString);

  const colors = await db.select_colors();
  console.log(colors);
})();
app.get('/', (req, res) => {
  res.send('hello world');
});

// const server = app.listen(8081, () => {
//   const host = server.address().address;
//   const { port } = server.address().port;

//   console.log('example app listening at http://%s:%s', host, port);
// });

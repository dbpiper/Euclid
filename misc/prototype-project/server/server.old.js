import express from 'express';
import pg from 'pg';
import Massive from 'massive';
// import path from 'path';

import Secret from './dbpiper-secret';

const connectionString = process.env.DATABASE_URL
                          || `postgres://${Secret.username}:${Secret.password}@localhost:5432/dvdrental`;
const app = express();
// const router = express.Router();

const client = new pg.Client(connectionString);

(async () => {
  await client.connect();
  const result = await client.query(
    `
      INSERT INTO t1 (bcolor, fcolor)
      VALUES ('red', 'red),
             ('red', 'red'),
             ('red', NULL),
             (')
    `,
  );
  console.log(result);
  // await client.query(
  //   `
  //     CREATE TABLE items(
  //       id SERIAL PRIMARY KEY, text VARCHAR(40) not null, complete BOOLEAN
  //     )
  //   `,
  // );
  await client.end();
})();

app.get('/', (req, res) => {
  res.send('hello world');
});

// const server = app.listen(8081, () => {
//   const host = server.address().address;
//   const { port } = server.address().port;

//   console.log('example app listening at http://%s:%s', host, port);
// });

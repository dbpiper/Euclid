import express from 'express';
import pg from 'pg';
import Secret from './dbpiper-secret';

const connectionString = process.env.DATABASE_URL
                          || `postgres://${Secret.username}:${Secret.password}@localhost:5432/david-db`;
const app = express();

const client = new pg.Client(connectionString);

(async () => {
  await client.connect();
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

const server = app.listen(8081, () => {
  const host = server.address().address;
  const { port } = server.address().port;

  console.log('example app listening at http://%s:%s', host, port);
});

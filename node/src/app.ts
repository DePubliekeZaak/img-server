import express from 'express';
const app = express();
app.use(express.json());
const port = 3009;

import { DbController} from './db.controller';
import { DataController } from './data.controller';
const db = new DbController();
const data = new DataController();

// create new db .. with web_a non role .. and populate with latest backup 
app.post('/create', async (req, res) => {
  res.send(await db.create(req.body.db));
});

app.post('/drop', async (req, res) => {
  res.send(await db.drop(req.body.db));
});

// update db from latest backup
app.post('/update', async (req, res) => {
  res.send(await db.update(req.body.db));
});

// select inactive db and update db from latest backup
app.post('/prepare', async (req, res) => {
   res.send(await db.prepare(req.body.db));
});

app.post('/config', async (req, res) => {
  res.send(await db.config());
});

// import data ...... ????????
app.post('/import', async (req, res) => {
  res.send(await db.import());
});

// set new staging db 
app.post('/stage', async (req, res) => {
  res.send(await db.stage());
});

app.post('/backup', async (req, res) => {
  res.send(await db.backup(req.body.db,req.body.name));
});

// set new live db 
app.post('/db', async (req, res) => {
  res.send(await db.setDb(req.body.name,req.body.db));
});


app.post('/data_entry', async (req, res) => {

  if (req.body.topic == 'all') {
    res.send(await data.all(req.body.week, req.body.db));
  } else {
    res.send(await data.entry(req.body.week, req.body.topic, req.body.db));
  }
});


app.post('/api_view', async (req, res) => {
  res.send(await db.addViewToApi(req.body.name, req.body.db));
});


app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});



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
  res.send(await db.create(req.body.db,"img-backup-latest"));
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
   res.send(await db.create(req.body.db, req.body.source));
});

// import data ...... ????????
app.post('/import', async (req, res) => {
  res.send(await db.import());
});

// set new staging db 
app.post('/stage', async (req, res) => {
  res.send(await db.upgrade(req.body.db, "staging"));
});

// set new dev db 
app.post('/dev', async (req, res) => {
  res.send(await db.upgrade(req.body.db, "dev"));
});

app.post('/backup', async (req, res) => {
  res.send(await db.backup(req.body.db,req.body.name));
});

// set new live db 
app.post('/publish', async (req, res) => {
  res.send(await db.upgrade("staging", "public"));
});


app.post('/data_entry', async (req, res) => {

  if (req.body.topic == 'all') {
    res.send(await data.all(req.body.week, req.body.db));
  } else if (req.body.topic == 'gemeenten' || req.body.topic == 'zaaktypes') {
    res.send(await data.entry2(req.body.week, req.body.topic, req.body.db));
  } else {
    res.send(await data.entry(req.body.week, req.body.topic, req.body.db));
  }
});

app.post('/data_validate', async (req, res) => {
  res.send(await data.validate(req.body.week, req.body.topic));
});

app.post('/api_view', async (req, res) => {
  res.send(await db.addViewToApi(req.body.name, req.body.db));
});

app.post('/import_history', async (req, res) => {
  const db = "img_2434";
  const key = "VES_toegekend_2a+b_(in miljoen)";
  res.send(await data.importHistory(db, key));
});


app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
const port = 3009;
const db_controller_1 = require("./db.controller");
const data_controller_1 = require("./data.controller");
const db = new db_controller_1.DbController();
const data = new data_controller_1.DataController();
// create new db .. with web_a non role .. and populate with latest backup 
app.post('/create', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send(yield db.create(req.body.db, "img-backup-latest"));
}));
app.post('/drop', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send(yield db.drop(req.body.db));
}));
// update db from latest backup
app.post('/update', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send(yield db.update(req.body.db));
}));
// select inactive db and update db from latest backup
app.post('/prepare', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send(yield db.create(req.body.db, req.body.source));
}));
// import data ...... ????????
app.post('/import', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send(yield db.import());
}));
// set new staging db 
app.post('/stage', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send(yield db.upgrade(req.body.db, "staging"));
}));
// set new dev db 
app.post('/dev', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send(yield db.upgrade(req.body.db, "dev"));
}));
app.post('/backup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send(yield db.backup(req.body.db, req.body.name));
}));
// set new live db 
app.post('/publish', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send(yield db.upgrade("staging", "public"));
}));
app.post('/data_entry', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.body.topic == 'all') {
        res.send(yield data.all(req.body.week, req.body.db));
    }
    else {
        res.send(yield data.entry(req.body.week, req.body.topic, req.body.db));
    }
}));
app.post('/api_view', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send(yield db.addViewToApi(req.body.name, req.body.db));
}));
app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
});
//# sourceMappingURL=app.js.map
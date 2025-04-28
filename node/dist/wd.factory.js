"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseWd = void 0;
const node_xlsx_1 = __importDefault(require("node-xlsx"));
const date_factory_1 = require("./date.factory");
const rowByDesc = (rows, namespace, desc) => {
    return rows.find(r => r[0] != undefined && r[1] != undefined && r[0].trim() == namespace && r[1].trim() == desc);
};
const removePercentage = (s) => {
    s = (parseFloat(s) * 100).toString();
    return Math.round(parseFloat(s) * 10) / 10;
};
const parseWd = (data, date, week) => {
    data = node_xlsx_1.default.parse(data);
    let object = {
        datum: (0, date_factory_1.formatDate)(date),
        gemeente: 'all'
    };
    const rows = data[0].data;
    const column = rows[0].indexOf("Week " + (week).toString());
    object["aanvragen"] = parseInt(rowByDesc(rows, 'wd', 'Totaal ingediende aanvragen')[column]);
    object["aanvragers"] = parseInt(rowByDesc(rows, 'wd', 'Unieke aanvragers')[column]);
    object["afgehandeld"] = parseInt(rowByDesc(rows, 'wd', 'Totaal beschikkingen')[column]);
    object["adressen"] = parseInt(rowByDesc(rows, 'wd', 'Unieke adressen')[column]);
    object["totaal_verleend"] = parseInt(rowByDesc(rows, 'wd', 'Besloten bedrag')[column]);
    object["afgewezen"] = parseInt(rowByDesc(rows, 'wd', 'Afgewezen beschikkingen')[column]);
    object["bezwaren_afgehandeld"] = parseInt(rowByDesc(rows, 'wd', 'Afgehandelde bezwaren')[column]);
    object["bezwaren_openstaand"] = parseInt(rowByDesc(rows, 'wd', 'Niet-afgehandelde bezwaren (totaal)')[column]);
    object["bezwaren_in_afwachting"] = parseInt(rowByDesc(rows, 'wd', 'Niet-afgehandelde bezwaren (in afwachting bezwaarschrift)')[column]);
    object["bezwaren_ingediend"] = parseInt(rowByDesc(rows, 'wd', 'Ingediende bezwaren')[column]);
    console.log(object);
    return object;
};
exports.parseWd = parseWd;
//# sourceMappingURL=wd.factory.js.map
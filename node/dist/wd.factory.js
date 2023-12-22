"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseWd = void 0;
const node_xlsx_1 = __importDefault(require("node-xlsx"));
const date_factory_1 = require("./date.factory");
const rowByDesc = (rows, desc) => {
    return rows.filter(r => r[1] == desc);
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
    console.log(week);
    // const latestRow = 5;
    const rows = data[0].data;
    const column = rows[0].indexOf("Week " + (week).toString());
    console.log(column);
    object["aanvragen"] = parseInt(rowByDesc(rows, 'Totaal ingediende aanvragen')[1][column]);
    object["aanvragers"] = parseInt(rowByDesc(rows, 'Unieke aanvragers')[0][column]);
    object["afgehandeld"] = parseInt(rowByDesc(rows, 'Totaal beschikkingen')[0][column]);
    object["adressen"] = parseInt(rowByDesc(rows, 'Unieke adressen')[1][column]);
    object["totaal_verleend"] = parseInt(rowByDesc(rows, 'Uitgekeerd bedrag')[0][column]);
    object["toegekend"] = 0;
    object["afgewezen"] = parseInt(rowByDesc(rows, 'Afgewezen beschikkingen')[0][column]);
    object["bezwaren_afgehandeld"] = parseInt(rowByDesc(rows, 'Afgehandelde bezwaren')[0][column]);
    object["bezwaren_openstaand"] = parseInt(rowByDesc(rows, 'Niet-afgehandelde bezwaren (totaal)')[0][column]);
    object["bezwaarpercentage"] = removePercentage(rowByDesc(rows, 'Ingediende bezwaren')[1][column]);
    object["bezwaren_in_afwachting"] = parseInt(rowByDesc(rows, 'Niet-afgehandelde bezwaren (in afwachting bezwaarschrift)')[0][column]);
    object["bezwaren_ingediend"] = parseInt(rowByDesc(rows, 'Ingediende bezwaren')[0][column]);
    console.log(object);
    return object;
};
exports.parseWd = parseWd;
//# sourceMappingURL=wd.factory.js.map
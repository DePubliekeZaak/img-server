"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseIms = void 0;
const node_xlsx_1 = __importDefault(require("node-xlsx"));
const date_factory_1 = require("./date.factory");
const rowByDesc = (rows, desc) => {
    const row = rows.find(r => r[1] == desc);
    if (row === undefined) {
        console.log("error at " + desc);
    }
    return row;
};
const removePercentage = (s) => {
    s = (parseFloat(s) * 100).toString();
    return Math.round(parseFloat(s) * 10) / 10;
};
const parseIms = (data, date, week) => {
    data = node_xlsx_1.default.parse(data);
    let object = {
        datum: (0, date_factory_1.formatDate)(date),
        gemeente: 'all'
    };
    const rows = data[0].data;
    const column = rows[0].indexOf("Week " + (week).toString());
    // console.log(rows);
    // console.log(column);
    object["pc4"] = "-";
    object["ingediend"] = parseInt(rowByDesc(rows, 'Totaal ingediende aanvragen')[column]);
    object["uniekeadressenims"] = parseInt(rowByDesc(rows, 'Unieke adressen')[column]);
    object["totaalbesloten"] = parseInt(rowByDesc(rows, 'Totaal besluiten')[column]);
    object["toegewezen"] = parseInt(rowByDesc(rows, 'Totaal toegewezen besluiten')[column]);
    object["afgewezen"] = parseInt(rowByDesc(rows, 'Totaal afgewezen besluiten')[column]);
    object["totaalverleend"] = parseInt(rowByDesc(rows, 'Uitgekeerde bedrag')[column]);
    object["bezwaren_ingediend"] = parseInt(rowByDesc(rows, 'Totaal ingediende bezwaren')[column]);
    object["bezwaren_openstaand"] = parseInt(rowByDesc(rows, 'Totaal openstaande bezwaren')[column]);
    object["bezwaarpercentage"] = removePercentage(rowByDesc(rows, 'Totaal bezwaarpercentage')[column]);
    object["bezwaren_beschikt"] = parseInt(rowByDesc(rows, 'Totaal beschikte bezwaren')[column]);
    object["bezwaren_ingetrokken"] = parseInt(rowByDesc(rows, 'Totaal ingetrokken bezwaren')[column]);
    console.log(object);
    return object;
};
exports.parseIms = parseIms;
//# sourceMappingURL=ims.factory.js.map
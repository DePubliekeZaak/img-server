"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseHistory = void 0;
const node_xlsx_1 = __importDefault(require("node-xlsx"));
const date_factory_1 = require("./date.factory");
const rowByDesc = (rows, namespace, desc) => {
    return rows.find(r => r[0] != undefined && r[1] != undefined && r[0].trim() == namespace && r[1].trim() == desc);
};
const removePercentage = (s) => {
    s = (parseFloat(s) * 100).toString();
    return Math.round(parseFloat(s) * 10) / 10;
};
// const formatDate = (date: Date): string =>  {
//     // const date = new Date(_date)
//     const year = date.getFullYear();
//     const month = (date.getMonth() + 1).toString().padStart(2, '0');
//     const day = date.getDate().toString().padStart(2, '0');
//     return `${year}-${month}-${day}`;
// }
const parseHistory = (data, key) => {
    data = node_xlsx_1.default.parse(data);
    let years = data[0].data.filter((row) => row[0] == 'Jaar')[0].slice(1);
    let weeks = data[0].data.filter((row) => row[0] == 'Rapportage_over_week')[0].slice(1);
    let numbers = data[0].data.filter((row) => row[0] == key)[0];
    let os = [];
    let prevValue = 0;
    weeks.forEach((w, i) => {
        let date = (0, date_factory_1.nextMondayFromWeek)(w, years[i]);
        if (new Date(date) > new Date("2018-01-01")) {
            os.push({
                date: (0, date_factory_1.formatDate)(date),
                value: numbers[i] || prevValue
            });
            if (numbers[i] != undefined) {
                prevValue = numbers[i];
            }
        }
    });
    return os;
};
exports.parseHistory = parseHistory;
//# sourceMappingURL=history.factory.js.map
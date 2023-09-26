"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.csvToArray = exports.arrayToCsv = void 0;
const arrayToCsv = (json) => {
    const fields = Object.keys(json[0]);
    const replacer = (key, value) => { return value === null ? '' : value; };
    let csv = json.map((row) => {
        return fields.map((fieldName) => {
            return JSON.stringify(row[fieldName], replacer);
        }).join(',');
    });
    csv.unshift(fields.join(',')); // add header column
    csv = csv.join('\r\n');
    return csv;
};
exports.arrayToCsv = arrayToCsv;
const csvToArray = (str, delimiter = ";") => {
    const headers = str.slice(0, str.indexOf("\n")).split(delimiter);
    const rows = str.slice(str.indexOf("\n") + 1).split("\n");
    const arr = rows.map(function (row) {
        const values = row.split(delimiter);
        const el = headers.reduce(function (object, header, index) {
            object[header] = values[index];
            return object;
        }, {});
        return el;
    });
    return arr;
};
exports.csvToArray = csvToArray;
//# sourceMappingURL=csv.facory.js.map
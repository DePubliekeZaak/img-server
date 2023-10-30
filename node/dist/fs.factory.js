"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanFs = void 0;
const format_factory_1 = require("./format.factory");
const addZero = (n) => {
    return parseInt(n) < 10 ? '0' + n : n;
};
const cleanFs = (data) => {
    let output = [];
    for (let row of data) {
        if (row['Datum'] === undefined) {
            break;
        }
        else {
            const a = row['Datum'].split("-");
            row['Datum'] = a[2] + '-' + addZero(a[1]) + '-' + addZero(a[0]);
        }
        let r = {};
        for (let [key, value] of Object.entries(row)) {
            r[(0, format_factory_1.slugify)(key)] = value == '' ? null : value;
        }
        output.push(r);
    }
    return output;
};
exports.cleanFs = cleanFs;
//# sourceMappingURL=fs.factory.js.map
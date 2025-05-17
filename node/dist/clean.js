"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanZaaktypes = exports.cleanGemeenten = void 0;
const slugify_1 = __importDefault(require("slugify"));
function checkEurValue(value) {
    if (value === '' || value === null)
        return 0;
    const num = parseFloat(value);
    if (isNaN(num))
        return 0;
    // If number exceeds PostgreSQL's DECIMAL(15,2) limit, return 0
    return Math.abs(num) >= 1e13 ? 0 : num;
}
const cleanGemeenten = (data) => {
    let output = [];
    for (let row of data) {
        if (row.domein_code === '') {
            continue;
        }
        if (!row.jaar_week || row.jaar_week === '') {
            row.jaar_week = '2017_12';
            row.datum_maandag = '2017-03-20';
        }
        let r = {};
        for (const key of Object.keys(row)) {
            const value = row[key];
            if (['gemeente', "datum", "pc4", "jaar_week", "datum_maandag", "domein_code", "regeling_code", "zaaktype"].indexOf(key) > -1) {
                r[(0, slugify_1.default)(key)] = value === '' ? null : value;
            }
            else if (key.endsWith("_eur")) {
                r[(0, slugify_1.default)(key)] = checkEurValue(value) / 100;
            }
            else if (key.endsWith("_aantal") || key.endsWith("_cumul")) {
                r[(0, slugify_1.default)(key)] = value === '' || value === null ? 0 : parseInt(value);
            }
            else {
                r[(0, slugify_1.default)(key)] = value === '' ? null : String(value);
            }
        }
        output.push(r);
    }
    return output;
};
exports.cleanGemeenten = cleanGemeenten;
const cleanZaaktypes = (data) => {
    let output = [];
    for (let row of data) {
        if (row.domein_code === '') {
            continue;
        }
        if (!row.jaar_week || row.jaar_week === '') {
            row.jaar_week = '2017_12';
            row.datum_maandag = '2017-03-20';
        }
        let r = {};
        for (const key of Object.keys(row)) {
            const value = row[key];
            if (['gemeente', "datum", "pc4", "jaar_week", "datum_maandag", "domein_code", "regeling_code", "zaaktype"].indexOf(key) > -1) {
                r[(0, slugify_1.default)(key)] = value === '' ? null : value;
            }
            else if (key.endsWith("_eur")) {
                r[(0, slugify_1.default)(key)] = checkEurValue(value) / 100;
            }
            else if (key.endsWith("_aantal") || key.endsWith("_cumul")) {
                r[(0, slugify_1.default)(key)] = value === '' || value === null ? 0 : parseInt(value);
            }
            else {
                r[(0, slugify_1.default)(key)] = value === '' ? null : String(value);
            }
        }
        output.push(r);
    }
    return output;
};
exports.cleanZaaktypes = cleanZaaktypes;
//# sourceMappingURL=clean.js.map
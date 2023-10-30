"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanVes = void 0;
const format_factory_1 = require("./format.factory");
const cleanVes = (data, date) => {
    let output = [];
    for (let row of data) {
        console.log(row['datum']);
        if ([undefined, 'undefined', '', null].indexOf(row['datum']) > -1) {
            break;
        }
        let r = {};
        for (let [key, value] of Object.entries(row)) {
            r[(0, format_factory_1.slugify)(key)] = value == '' ? null : value;
        }
        output.push(r);
    }
    return output;
};
exports.cleanVes = cleanVes;
//# sourceMappingURL=ves.factory.js.map
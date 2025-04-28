"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseKto = void 0;
const node_xlsx_1 = __importDefault(require("node-xlsx"));
const date_factory_1 = require("./date.factory");
const parseKto = (data, date) => {
    data = node_xlsx_1.default.parse(data);
    let object = {
        datum: (0, date_factory_1.formatDate)(date),
        gemeente: 'all'
    };
    // let op .. er zit soms een extra kolom tussen, zoals E 
    data[0].data.forEach((row, index) => {
        switch (index) {
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
            case 8:
            case 9:
            case 10:
            case 11:
                object["fs_doorlopend_" + row[1]] = parseInt(row[2]);
                object["w_doorlopend_" + row[1]] = parseInt(row[6]);
                object["ves_doorlopend_" + row[1]] = parseInt(row[10]);
                object["ims_doorlopend_" + row[1]] = parseInt(row[14]);
                break;
            case 12:
                object["fs_doorlopend_gem"] = parseFloat(row[1]);
                object["fs_doorlopend_n"] = parseInt(row[2]);
                object["fs_uitvraag"] = 0;
                object["w_doorlopend_gem"] = parseFloat(row[5]);
                object["w_doorlopend_n"] = parseInt(row[6]);
                object["w_uitvraag"] = 0;
                object["ves_doorlopend_gem"] = parseFloat(row[9]);
                object["ves_doorlopend_n"] = parseInt(row[10]);
                object["ims_doorlopend_gem"] = parseFloat(row[13]);
                object["ims_doorlopend_n"] = parseInt(row[14]);
                break;
            case 16:
            case 17:
            case 18:
            case 19:
            case 20:
            case 21:
            case 22:
            case 23:
            case 24:
            case 25:
                object["fs_maand_" + row[1]] = parseInt(row[2]);
                object["w_maand_" + row[1]] = parseInt(row[6]);
                object["ves_maand_" + row[1]] = parseInt(row[10]);
                object["ims_maand_" + row[1]] = parseInt(row[14]);
                break;
            case 26:
                object["fs_maand_gem"] = parseFloat(row[1]);
                object["fs_maand_n"] = parseInt(row[2]);
                object["w_maand_gem"] = parseFloat(row[5]);
                object["w_maand_n"] = parseInt(row[6]);
                object["ves_maand_gem"] = parseFloat(row[9]);
                object["ves_maand_n"] = parseInt(row[10]);
                object["ims_maand_gem"] = parseFloat(row[13]);
                object["ims_maand_n"] = parseInt(row[14]);
                break;
            case 45:
            case 46:
            case 47:
            case 48:
            case 49:
            case 50:
            case 51:
            case 52:
            case 53:
            case 54:
                object["imkj_doorlopend_" + row[1]] = parseInt(row[6]);
                object["imkj_maand_" + row[1]] = parseInt(row[2]);
                break;
            case 55:
                object["imkj_maand_gem"] = parseFloat(row[1]) || 0;
                object["imkj_maand_n"] = parseInt(row[2]);
                object["imkj_doorlopend_gem"] = parseFloat(row[5]);
                object["imkj_doorlopend_n"] = parseInt(row[6]);
                break;
        }
    });
    console.log(object);
    return object;
};
exports.parseKto = parseKto;
//# sourceMappingURL=kto.factory.js.map
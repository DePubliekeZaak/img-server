"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseMmsHistory = void 0;
const date_factory_1 = require("./date.factory");
const parseMmsHistory = (data) => {
    let output = [];
    let options = ['ja_ja', 'ja_nee', 'nee_ja', 'nee_nee'];
    for (let row of data.slice(1)) {
        if (row['Afrondingsjaar'] == "")
            continue;
        const monday = (0, date_factory_1.getFirstMonday)(parseInt(row['Afrondingsmaand']), parseInt(row['Afrondingsjaar']));
        for (let option of options) {
            let o = {
                datum: (0, date_factory_1.formatDate)(monday),
                gemeente: 'all',
                _year: parseInt(row['Afrondingsjaar']),
                _month: parseInt(row['Afrondingsmaand']),
                _week: (0, date_factory_1.weekNumber)(monday) == null ? 0 : (0, date_factory_1.weekNumber)(monday),
                pgv: row['PGV'] != undefined ? parseInt(row['PGV'].split(".")[0]) : 0,
            };
            switch (option) {
                case 'ja_ja':
                    o.historie_tcmg_img = true;
                    o.historie_nam_cvw = true;
                    break;
                case 'ja_nee':
                    o.historie_tcmg_img = true;
                    o.historie_nam_cvw = false;
                    break;
                case 'nee_ja':
                    o.historie_tcmg_img = false;
                    o.historie_nam_cvw = true;
                    break;
                case 'nee_nee':
                    o.historie_tcmg_img = false;
                    o.historie_nam_cvw = false;
                    break;
            }
            o.afwijzingen = row[option + '_afwijzingen'] == '' ? 0 : parseInt(row[option + '_afwijzingen']);
            o.toekenningen = row[option + '_toekenningen'] == '' ? 0 : parseInt(row[option + '_toekenningen']);
            o.gemiddeld_verleend = row[option + '_gemiddeld_verleend'] == '' ? 0 : parseInt(row[option + '_gemiddeld_verleend']);
            output.push(o);
        }
    }
    return output;
};
exports.parseMmsHistory = parseMmsHistory;
//# sourceMappingURL=mms.factory.js.map
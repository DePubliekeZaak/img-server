"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.slugify = exports.stripCurrency = void 0;
const stripCurrency = (str) => {
    console.log(str);
    return (str != undefined) ? str.replace("€", "").replace(/,/g, "") : "0";
};
exports.stripCurrency = stripCurrency;
const slugify = (string) => {
    string = string.toLowerCase();
    string = string.replace(" ", "_");
    string = string.replace("-", "_");
    return string;
};
exports.slugify = slugify;
//# sourceMappingURL=format.factory.js.map
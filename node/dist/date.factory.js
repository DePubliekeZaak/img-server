"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.weekNumber = exports.formatDate = exports.nextMondayFromWeek = exports.mondayFromWeek = exports.getFirstMonday = void 0;
const getFirstMonday = (month, year) => {
    let d = new Date();
    d.setMonth(month);
    d.setFullYear(year);
    d.setDate(1);
    // Get the first Monday in the month
    while (d.getDay() !== 1) {
        d.setDate(d.getDate() + 1);
    }
    return new Date(d.getTime());
};
exports.getFirstMonday = getFirstMonday;
const mondayFromWeek = (week, year) => {
    var simple = new Date(year, 0, 1 + (week - 1) * 7);
    var dow = simple.getDay();
    var ISOweekStart = simple;
    if (dow <= 4)
        ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
    else
        ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
    return ISOweekStart;
};
exports.mondayFromWeek = mondayFromWeek;
const nextMondayFromWeek = (week, year) => {
    var simple = new Date(year, 0, 1 + (week) * 7);
    var dow = simple.getDay();
    var ISOweekStart = simple;
    if (dow <= 4)
        ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
    else
        ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
    return ISOweekStart;
};
exports.nextMondayFromWeek = nextMondayFromWeek;
const formatDate = (d) => {
    return d.getFullYear() + "-" + ('0' + (d.getMonth() + 1)).slice(-2) + "-" + ('0' + d.getDate()).slice(-2);
};
exports.formatDate = formatDate;
const weekNumber = (date) => {
    const startDate = new Date(date.getFullYear(), 1, 1);
    var days = Math.floor((date.getTime() - startDate.getTime()) /
        (24 * 60 * 60 * 1000));
    return Math.ceil(days / 7);
};
exports.weekNumber = weekNumber;
//# sourceMappingURL=date.factory.js.map
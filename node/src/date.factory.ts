export const getFirstMonday = (month: number, year: number) => {
    
    let d = new Date();
    d.setMonth(month);
    d.setFullYear(year);
    d.setDate(1);

    // Get the first Monday in the month
    while (d.getDay() !== 1) {
        d.setDate(d.getDate() + 1);
    }

    return new Date(d.getTime());
}

export const mondayFromWeek = (week,year) => {

    var simple = new Date(year, 0, 1 + (week - 1) * 7);
    var dow = simple.getDay();
    var ISOweekStart = simple;
    if (dow <= 4)
        ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
    else
        ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
    return ISOweekStart;

}

export const nextMondayFromWeek = (week,year) => {

    var simple = new Date(year, 0, 1 + (week) * 7);
    var dow = simple.getDay();
    var ISOweekStart = simple;
    if (dow <= 4)
        ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
    else
        ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
    return ISOweekStart;

}

export const formatDate = (d: Date) => {
    
    return d.getFullYear() + "-" + ('0' + (d.getMonth() + 1)).slice(-2) + "-" + ('0' + d.getDate()).slice(-2);
}

export const weekNumber = (date: Date) => {

    const startDate = new Date(date.getFullYear(), 1, 1);
    var days = Math.floor((date.getTime() - startDate.getTime()) /
        (24 * 60 * 60 * 1000));
         
    return Math.ceil(days / 7);
     
}

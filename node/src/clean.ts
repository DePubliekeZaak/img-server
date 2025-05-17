import slugify from "slugify";

function checkEurValue(value: any): number {
    if (value === '' || value === null) return 0;
    const num = parseFloat(value);
    if (isNaN(num)) return 0;
    // If number exceeds PostgreSQL's DECIMAL(15,2) limit, return 0
    return Math.abs(num) >= 1e13 ? 0 : num;
}

export const cleanGemeenten = (data: any) => {

    let output: any[] = [];

    for (let row of data) {

        if (row.domein_code === '') {
            continue;
        }

        if (!row.jaar_week || row.jaar_week === '') {
            row.jaar_week = '2017_12';
            row.datum_maandag = '2017-03-20';
        }

        let r: any = {};

        for (const key of Object.keys(row)) {
            const value = row[key];
            
            if (['gemeente',"datum","pc4","jaar_week", "datum_maandag", "domein_code", "regeling_code", "zaaktype"].indexOf(key) > -1)  {
                r[slugify(key)] = value === '' ? null : value;
            } else if (key.endsWith("_eur")) {
                r[slugify(key)] = checkEurValue(value) / 100;
            } else if (key.endsWith("_aantal") || key.endsWith("_cumul")) {
                r[slugify(key)] = value === '' || value === null ? 0 : parseInt(value);
            } else {
                r[slugify(key)] = value === '' ? null : String(value);
            }
        }
              
        output.push(r);
    }

    return output;
}

export const cleanZaaktypes = (data: any) => {

    let output: any[] = [];

    for (let row of data) {

        if (row.domein_code === '') {
            continue;
        }

        if (!row.jaar_week || row.jaar_week === '') {
            row.jaar_week = '2017_12';
            row.datum_maandag = '2017-03-20';
        }

        let r: any = {};

        for (const key of Object.keys(row)) {
            const value = row[key];
            
            if (['gemeente',"datum","pc4","jaar_week", "datum_maandag", "domein_code", "regeling_code", "zaaktype"].indexOf(key) > -1)  {
                r[slugify(key)] = value === '' ? null : value;
            } else if (key.endsWith("_eur")) {
                r[slugify(key)] = checkEurValue(value) / 100;
            } else if (key.endsWith("_aantal") || key.endsWith("_cumul")) {
                r[slugify(key)] = value === '' || value === null ? 0 : parseInt(value);
            } else {
                r[slugify(key)] = value === '' ? null : String(value);
            }
        }
              
        output.push(r);
        
    }

    return output;
}


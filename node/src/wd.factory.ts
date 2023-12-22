import xlsx from 'node-xlsx';
import { formatDate } from './date.factory';
import { stripCurrency } from './format.factory';

const rowByDesc = (rows: any[], desc: string) =>  {

    return rows.filter( r => r[1] == desc);
}

const removePercentage = (s: string) => {

    s = (parseFloat(s) * 100).toString();
    return Math.round(parseFloat(s) * 10) / 10;

}

export const parseWd = (data: any, date: Date, week: number) => {

    data = xlsx.parse(data);

    let object = {
        datum: formatDate(date),
        gemeente: 'all'
    };

    console.log(week);
    // const latestRow = 5;
    const rows = data[0].data;
    const column = rows[0].indexOf("Week " + (week).toString());

    console.log(column);

    object["aanvragen"] = parseInt(rowByDesc(rows,'Totaal ingediende aanvragen')[1][column]);
    object["aanvragers"] = parseInt(rowByDesc(rows,'Unieke aanvragers')[0][column]);
    object["afgehandeld"] = parseInt(rowByDesc(rows,'Totaal beschikkingen')[0][column]);
    object["adressen"] = parseInt(rowByDesc(rows,'Unieke adressen')[1][column]);
    object["totaal_verleend"] = parseInt(rowByDesc(rows,'Uitgekeerd bedrag')[0][column]);
    object["toegekend"] = 0;
    object["afgewezen"] = parseInt(rowByDesc(rows,'Afgewezen beschikkingen')[0][column]);

    object["bezwaren_afgehandeld"] = parseInt(rowByDesc(rows,'Afgehandelde bezwaren')[0][column]);
    object["bezwaren_openstaand"] = parseInt(rowByDesc(rows,'Niet-afgehandelde bezwaren (totaal)')[0][column]);
    object["bezwaarpercentage"] = removePercentage(rowByDesc(rows,'Ingediende bezwaren')[1][column]);
    object["bezwaren_in_afwachting"] = parseInt(rowByDesc(rows,'Niet-afgehandelde bezwaren (in afwachting bezwaarschrift)')[0][column]);
    object["bezwaren_ingediend"] = parseInt(rowByDesc(rows,'Ingediende bezwaren')[0][column]);

    console.log(object);

    return object;

}
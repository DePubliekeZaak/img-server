import xlsx from 'node-xlsx';
import { formatDate } from './date.factory';
import { stripCurrency } from './format.factory';

const rowByDesc = (rows: any[], namespace, desc: string) =>  {

    return rows.find( r => r[0] != undefined && r[1] != undefined && r[0].trim() == namespace && r[1].trim() == desc);
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

    const rows = data[0].data;
    const column = rows[0].indexOf("Week " + (week).toString());

    object["aanvragen"] = parseInt(rowByDesc(rows,'wd','Totaal ingediende aanvragen')[column]);
    object["aanvragers"] = parseInt(rowByDesc(rows,'wd','Unieke aanvragers')[column]);
    object["afgehandeld"] = parseInt(rowByDesc(rows,'wd','Totaal beschikkingen')[column]);
    object["adressen"] = parseInt(rowByDesc(rows,'wd','Unieke adressen')[column]);
    object["totaal_verleend"] = parseInt(rowByDesc(rows,'wd','Besloten bedrag')[column]);
    object["afgewezen"] = parseInt(rowByDesc(rows,'wd','Afgewezen beschikkingen')[column]);

    object["bezwaren_afgehandeld"] = parseInt(rowByDesc(rows,'wd','Afgehandelde bezwaren')[column]);
    object["bezwaren_openstaand"] = parseInt(rowByDesc(rows,'wd','Niet-afgehandelde bezwaren (totaal)')[column]);
    object["bezwaren_in_afwachting"] = parseInt(rowByDesc(rows,'wd','Niet-afgehandelde bezwaren (in afwachting bezwaarschrift)')[column]);
    object["bezwaren_ingediend"] = parseInt(rowByDesc(rows,'wd','Ingediende bezwaren')[column]);

    console.log(object);

    return object;

}
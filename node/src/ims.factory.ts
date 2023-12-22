import xlsx from 'node-xlsx';
import { formatDate } from './date.factory';
import { stripCurrency } from './format.factory';


const rowByDesc = (rows: any[], desc: string) =>  {

    const row = rows.find( r => r[1] == desc);

    if(row === undefined) {
        console.log("error at " + desc)
    }

    return row;
}

const removePercentage = (s: string) => {

    s = (parseFloat(s) * 100).toString();
    return Math.round(parseFloat(s) * 10) / 10;
}

export const parseIms = (data: any, date: Date, week: number) => {

    data = xlsx.parse(data);

    let object = {                

        datum: formatDate(date),
        gemeente: 'all'
    };

    const rows = data[0].data;
    const column = rows[0].indexOf("Week " + (week).toString())

    // console.log(rows);
    console.log(column);

    object["pc4"] = "-";
    object["ingediend"] = parseInt(rowByDesc(rows,'Totaal ingediende aanvragen')[column]);
    object["uniekeadressenims"] = parseInt(rowByDesc(rows,'Unieke adressen')[column]);
    object["totaalbesloten"] = parseInt(rowByDesc(rows,'Totaal besluiten')[column]);
    object["toegewezen"] = parseInt(rowByDesc(rows,'Totaal toegewezen besluiten')[column]);
    object["afgewezen"] = parseInt(rowByDesc(rows,'Totaal afgewezen besluiten')[column]);
    object["totaalverleend"] = parseInt(rowByDesc(rows,'Uitgekeerde bedrag')[column]);

    object["bezwaren_ingediend"] = parseInt(rowByDesc(rows,'Totaal ingediende bezwaren')[column]);
    object["bezwaren_openstaand"] = parseInt(rowByDesc(rows,'Totaal openstaande bezwaren')[column]);
    object["bezwaarpercentage"] = removePercentage(rowByDesc(rows,'Totaal bezwaarpercentage')[column]);
    object["bezwaren_beschikt"] = parseInt(rowByDesc(rows,'Totaal beschikte bezwaren')[column]);
    object["bezwaren_ingetrokken"] = parseInt(rowByDesc(rows,'Totaal ingetrokken bezwaren')[column]);

    console.log(object);

    return object;

}


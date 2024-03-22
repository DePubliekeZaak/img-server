import xlsx from 'node-xlsx';
import { formatDate } from './date.factory';
import { stripCurrency } from './format.factory';

const rowByDesc = (rows: any[], desc: string) =>  {

    return rows.filter( r => r[0] == desc);
}

const removePercentage = (s: string) => {

    s = (parseFloat(s) * 100).toString();
    return Math.round(parseFloat(s) * 10) / 10;
}

export const parseIms = (data: any, date: Date, week: number) => {

    data = xlsx.parse(data);

    console.log(date);

    let object = {                

        datum: formatDate(date),
        gemeente: 'all'
    };

    const rows = data[0].data;
    const column = rows[0].indexOf("Week " + (week).toString())

    console.log(column);

    object["pc4"] = "-";
    object["ingediend"] = parseInt(rowByDesc(rows,'Totaal ingediende aanvragen')[0][column]);
    object["uniekeadressenims"] = parseInt(rowByDesc(rows,'Unieke adressen')[0][column]);
    object["totaalbesloten"] = parseInt(rowByDesc(rows,'Totaal besluiten')[0][column]);
    object["toegewezen"] = parseInt(rowByDesc(rows,'Totaal toegewezen besluiten')[0][column]);
    object["afgewezen"] = parseInt(rowByDesc(rows,'Totaal afgewezen besluiten')[0][column]);
    object["totaalverleend"] = parseInt(rowByDesc(rows,'Besloten bedrag')[0][column]);

    object["bezwaren_ingediend"] = parseInt(rowByDesc(rows,'Totaal ingediende bezwaren')[0][column]);
    object["bezwaren_openstaand"] = parseInt(rowByDesc(rows,'Totaal openstaande bezwaren')[0][column]);
    object["bezwaarpercentage"] = removePercentage(rowByDesc(rows,'Totaal bezwaarpercentage')[0][column]);
    object["bezwaren_beschikt"] = parseInt(rowByDesc(rows,'Totaal beschikte bezwaren')[0][column]);
    object["bezwaren_ingetrokken"] = parseInt(rowByDesc(rows,'Totaal ingetrokken bezwaren')[0][column]);

    object["imkj_aanvragen"] = parseInt(rowByDesc(rows,'Aanvragen')[1][column]);
    object["imkj_voorraad"] = parseInt(rowByDesc(rows,'Voorraad')[0][column]);
    object["imkj_afgehandeld"] = parseInt(rowByDesc(rows,'Afgehandeld (incl. intrekkingen)')[0][column]);
    object["imkj_toegekend"] = parseInt(rowByDesc(rows,'Toegekend')[0][column]);
    object["imkj_afgewezen"] = parseInt(rowByDesc(rows,'Afgewezen')[0][column]);
    object["imkj_bedrag"] = parseInt(rowByDesc(rows,'Besloten bedrag')[1][column]);
    object["imkj_bezwaren_ingediend"] = parseInt(rowByDesc(rows,'Ingediende bezwaren')[0][column]);
    object["imkj_bezwaren_openstaand"] = parseInt(rowByDesc(rows,'Openstaande bezwaren')[0][column]);
    object["imkj_bezwaren_afgerond"] = parseInt(rowByDesc(rows,'Afgeronde bezwaren (incl. intrekkingen)')[0][column]);

    object["imsc_zaken"] = parseInt(rowByDesc(rows,'IMSC zaken')[1][column]);
    object["imsc_voorraad"] = parseInt(rowByDesc(rows,'Voorraad')[1][column]);
    object["imsc_afgehandeld"] = parseInt(rowByDesc(rows,'Afgehandeld (incl. intrekkingen)')[1][column]);
    object["imsc_verstuurd_besluit"] = parseInt(rowByDesc(rows,'Verstuurd besluit')[0][column]);
    object["imsc_geannuleerd"] = parseInt(rowByDesc(rows,'Geannuleerd')[0][column]);
    object["imsc_besloten_bedrag"] = parseInt(rowByDesc(rows,'Besloten bedrag')[2][column]);
    object["imsc_ingediende_bezwaren"] = parseInt(rowByDesc(rows,'Ingediende bezwaren')[1][column]);
    object["imsc_openstaande_bezwaren"] = parseInt(rowByDesc(rows,'Openstaande bezwaren')[2][column]);
    object["imsc_afgeronde_bezwaren"] = parseInt(rowByDesc(rows,'Afgeronde bezwaren (incl. intrekkingen)')[1][column]);

    console.log(object);

    return object;

}


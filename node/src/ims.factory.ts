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

export const parseIms = (data: any, date: Date, week: number) => {

    data = xlsx.parse(data);

    console.log(date);

    let object = {                

        datum: formatDate(date),
        gemeente: 'all'
    };

    const rows = data[0].data;
    const column = rows[0].indexOf("Week " + (week).toString())

    console.log(1)

    object["pc4"] = "-";
    object["ingediend"] = parseInt(rowByDesc(rows,'ims','Totaal ingediende aanvragen (incl. pilot)')[column]);
    object["totaalbesloten"] = parseInt(rowByDesc(rows,'ims','Totaal besluiten')[column]);
    object["toegewezen"] = parseInt(rowByDesc(rows,'ims','Totaal toegewezen besluiten')[column]);
    object["afgewezen"] = parseInt(rowByDesc(rows,'ims','Totaal afgewezen besluiten')[column]);
    object["totaalverleend"] = parseInt(rowByDesc(rows,'ims','Besloten bedrag primair')[column]);

    object["bezwaren_ingediend"] = parseInt(rowByDesc(rows,'ims','Totaal ingediende bezwaren')[column]);
    object["bezwaren_openstaand"] = parseInt(rowByDesc(rows,'ims','Totaal openstaande bezwaren')[column]);
    object["bezwaarpercentage"] = removePercentage(rowByDesc(rows,'ims','Totaal bezwaarpercentage')[column]);
    object["bezwaren_beschikt"] = parseInt(rowByDesc(rows,'ims','Totaal beschikte bezwaren')[column]);
    object["bezwaren_ingetrokken"] = parseInt(rowByDesc(rows,'ims','Totaal ingetrokken bezwaren')[column]);

    object["imkj_aanvragen"] = parseInt(rowByDesc(rows,'imkj','Aanvragen')[column]);
    object["imkj_voorraad"] = parseInt(rowByDesc(rows,'imkj','Voorraad')[column]);
    object["imkj_afgehandeld"] = parseInt(rowByDesc(rows,'imkj','Afgehandeld (incl. intrekkingen)')[column]);
    object["imkj_toegekend"] = parseInt(rowByDesc(rows,'imkj','Toegekend')[column]);
    object["imkj_afgewezen"] = parseInt(rowByDesc(rows,'imkj','Afgewezen')[column]);
    object["imkj_bedrag"] = parseInt(rowByDesc(rows,'imkj','Besloten bedrag')[column]);
    object["imkj_bezwaren_ingediend"] = parseInt(rowByDesc(rows,'imkj','Ingediende bezwaren')[column]);
    object["imkj_bezwaren_openstaand"] = parseInt(rowByDesc(rows,'imkj','Openstaande bezwaren')[column]);
    object["imkj_bezwaren_afgerond"] = parseInt(rowByDesc(rows,'imkj','Afgeronde bezwaren (incl. intrekkingen)')[column]);

    object["imsc_zaken"] = parseInt(rowByDesc(rows,'imsc','IMSC zaken')[column]);
    object["imsc_voorraad"] = parseInt(rowByDesc(rows,'imsc','Voorraad')[column]);
    object["imsc_afgehandeld"] = parseInt(rowByDesc(rows,'imsc','Afgehandeld (incl. intrekkingen)')[column]);
    object["imsc_verstuurd_besluit"] = parseInt(rowByDesc(rows,'imsc','Verstuurd besluit')[column]);
    object["imsc_geannuleerd"] = parseInt(rowByDesc(rows,'imsc','Geannuleerd')[column]);
    object["imsc_besloten_bedrag"] = parseInt(rowByDesc(rows,'imsc','Besloten bedrag')[column]);
    object["imsc_ingediende_bezwaren"] = parseInt(rowByDesc(rows,'imsc','Ingediende bezwaren')[column]);
    object["imsc_openstaande_bezwaren"] = parseInt(rowByDesc(rows,'imsc','Openstaande bezwaren')[column]);
    object["imsc_afgeronde_bezwaren"] = parseInt(rowByDesc(rows,'imsc','Afgeronde bezwaren (incl. intrekkingen)')[column]);

    object["imkc_zaken"] = parseInt(rowByDesc(rows,'imkc','IMSC zaken')[column]);
    object["imkc_voorraad"] = parseInt(rowByDesc(rows,'imkc','Voorraad')[column]);
    object["imkc_afgehandeld"] = parseInt(rowByDesc(rows,'imkc','Afgehandeld (incl. intrekkingen)')[column]);
    object["imkc_verstuurd_besluit"] = parseInt(rowByDesc(rows,'imkc','Verstuurd besluit')[column]);
    object["imkc_geannuleerd"] = parseInt(rowByDesc(rows,'imkc','Geannuleerd')[column]);
    object["imkc_besloten_bedrag"] = parseInt(rowByDesc(rows,'imkc','Besloten bedrag')[column]);
    object["imkc_ingediende_bezwaren"] = parseInt(rowByDesc(rows,'imkc','Ingediende bezwaren')[column]) | 0;
    object["imkc_openstaande_bezwaren"] = parseInt(rowByDesc(rows,'imkc','Openstaande bezwaren')[column]) | 0;
    object["imkc_afgeronde_bezwaren"] = parseInt(rowByDesc(rows,'imkc','Afgeronde bezwaren (incl. intrekkingen)')[column]) | 0;

    console.log(object);

    return object;

}


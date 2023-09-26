import xlsx from 'node-xlsx';
import { formatDate } from './date.factory';

export const parseKto = (data: any, date: Date) => {

    data = xlsx.parse(data);

    let object = {
        datum: formatDate(date),
        gemeente: 'all'
    };

    // let op .. er zit soms een extra kolom tussen, zoals E 

   data[0].data.forEach( (row: string[], index: number) => {

        switch (index) {

            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
            case 8:
            case 9:
            case 10:
            case 11:
            
                object["fs_doorlopend_" + row[1]] = parseInt(row[2]);
                object["w_doorlopend_" + row[1]] = parseInt(row[6]);
                object["ves_doorlopend_" + row[1]] = parseInt(row[10]);
                object["ims_doorlopend_" + row[1]] = parseInt(row[14]);

                break;

            case 12: 

                object["fs_doorlopend_gem"] = parseFloat(row[1]);
                object["fs_doorlopend_n"] = parseInt(row[2]);
                object["fs_uitvraag"] = 0;
                object["w_doorlopend_gem"] = parseFloat(row[5]);
                object["w_doorlopend_n"] = parseInt(row[6]);
                object["w_uitvraag"] = 0;
                object["ves_doorlopend_gem"] = parseFloat(row[9]);
                object["ves_doorlopend_n"] = parseInt(row[10]);
                object["ims_doorlopend_gem"] = parseFloat(row[13]);
                object["ims_doorlopend_n"] = parseInt(row[14]);

                break;

            case 16:
            case 17:
            case 18:
            case 19:
            case 20:
            case 21:
            case 22:
            case 23:
            case 24:
            case 25:
        
                object["fs_maand_" + row[1]] = parseInt(row[2]);
                object["w_maand_" + row[1]] = parseInt(row[6]);
                object["ves_maand_" + row[1]] = parseInt(row[10]);
                object["ims_maand_" + row[1]] = parseInt(row[14]);

                break;

            case 26:
                
                object["fs_maand_gem"] = parseFloat(row[1]);
                object["fs_maand_n"] = parseInt(row[2]);
                object["w_maand_gem"] = parseFloat(row[5]);
                object["w_maand_n"] = parseInt(row[6]);
                object["ves_maand_gem"] = parseFloat(row[9]);
                object["ves_maand_n"] = parseInt(row[10]);
                object["ims_maand_gem"] = parseFloat(row[13]);
                object["ims_maand_n"] = parseInt(row[14]);

                break;


        }

    });

    return object;
}
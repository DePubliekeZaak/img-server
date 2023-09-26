import { slugify } from "./format.factory";


const addZero = (n: string) => {
    
    return parseInt(n) < 10 ? '0' + n : n;
}

export const cleanFs = (data: any) => {

    let output: any[] = [];

    for (let row of data) {

        if (row['Datum'] === undefined) {
            break;
        } else {
            const a = row['Datum'].split("-");
            row['Datum'] = a[2] + '-' + addZero(a[1]) + '-' + addZero(a[0])
        }


        let r: any = {};

        for (let [key, value] of Object.entries(row)) {

                r[slugify(key)] = value == '' ? null : value;
        }
              
        output.push(r);
    }

    return output ;
}
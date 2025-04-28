import { slugify } from "./format.factory";

export const cleanVes= (data: any, date: Date) => {

    let output: any[] = [];

    for (let row of data) {

        // console.log(row['datum']);

        if([undefined,'undefined','',null].indexOf(row['datum']) >  -1) {
            break;
        } 

        let r: any = {};

        for (let [key, value] of Object.entries(row)) {

                r[slugify(key)] = value == '' ? null : value;
        }
              
        output.push(r);
    }

    return output;
}
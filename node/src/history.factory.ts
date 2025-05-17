import xlsx from 'node-xlsx';
import { formatDate, nextMondayFromWeek } from './date.factory';
import { stripCurrency } from './format.factory';

const rowByDesc = (rows: any[], namespace, desc: string) =>  {

    return rows.find( r => r[0] != undefined && r[1] != undefined && r[0].trim() == namespace && r[1].trim() == desc);
}

const removePercentage = (s: string) => {

    s = (parseFloat(s) * 100).toString();
    return Math.round(parseFloat(s) * 10) / 10;
}

// const formatDate = (date: Date): string =>  {
//     // const date = new Date(_date)
//     const year = date.getFullYear();
//     const month = (date.getMonth() + 1).toString().padStart(2, '0');
//     const day = date.getDate().toString().padStart(2, '0');

//     return `${year}-${month}-${day}`;
// }

export const parseHistory = (data: any, key: string) => {

    data = xlsx.parse(data);

    let years = data[0].data.filter( (row) => row[0] == 'Jaar')[0].slice(1);
    let weeks = data[0].data.filter( (row) => row[0] == 'Rapportage_over_week')[0].slice(1);
    let numbers = data[0].data.filter( (row) => row[0] == key)[0];

    let os: any[] = [];
    let prevValue = 0
    
    weeks.forEach( (w: string,i: number) => {

        let date = nextMondayFromWeek(w, years[i]);

        if(new Date(date) > new Date("2018-01-01")) {
            
            os.push({
                date: formatDate(date),
                value: numbers[i] || prevValue
            })

            if(numbers[i] != undefined) {
                prevValue = numbers[i];
            }
        }
    });

    return os;

}


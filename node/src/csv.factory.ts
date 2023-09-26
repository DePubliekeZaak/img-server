
export const arrayToCsv = (json: any) => {

    const fields = Object.keys(json[0])
    const replacer = (key, value) => { return value === null ? '' : value } 
    let csv = json.map( (row) => {
        return fields.map( (fieldName) => {
            return JSON.stringify(row[fieldName], replacer)
        }).join(',')
    })
    csv.unshift(fields.join(',')) // add header column
    csv = csv.join('\r\n');
    return csv;
}

export const csvToArray = (str: string, delimiter = ";") => {

    const headers = str.slice(0, str.indexOf("\n")).split(delimiter);
    const rows = str.slice(str.indexOf("\n") + 1).split("\n");

    const arr = rows.map(function (row) {
      const values = row.split(delimiter);
      const el = headers.reduce(function (object, header, index) {
        object[header] = values[index];
        return object;
      }, {});
      return el;
    });
  
    return arr;
}
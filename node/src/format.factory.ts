export const stripCurrency = (str: string) => {

    console.log(str);

    return (str != undefined) ? str.replace("€","").replace(/,/g,"") : "0";
}

export const slugify = (string: string) => {

    string = string.toLowerCase();
    string = string.replace(" ","_");
    string = string.replace("-","_");

    return string;
}
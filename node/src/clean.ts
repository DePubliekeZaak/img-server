import slugify from "slugify";

function normalizeSpecialChars(text: string): string {
  if (!text || typeof text !== "string") return text;

  // Handle corrupted replacement characters and specific cases
  const result = text
    // Fix corrupted characters first
    .replace(/�/g, "a") // Replace replacement character with 'a' for Fryslân -> Fryslan
    .replace(/Frysl�n/g, "Fryslan") // Specific fix for Fryslân
    .replace(/Noardeast-Frysl�n/g, "Noardeast-Fryslan") // Full municipality name fix
    // Then normalize other characters
    .normalize("NFD") // Decompose accented characters
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritical marks
    .normalize("NFC") // Recompose if needed
    // Handle specific cases that might not be caught by normalization
    .replace(/ĳ/g, "ij")
    .replace(/IJ/g, "IJ")
    .replace(/Ĳ/g, "IJ")
    .replace(/[–—]/g, "-")
    .replace(/æ/g, "ae")
    .replace(/Æ/g, "AE")
    .replace(/œ/g, "oe")
    .replace(/Œ/g, "OE")
    .replace(/ß/g, "ss");

  return result;
}

function checkEurValue(value: any): number {
  if (value === "" || value === null) return 0;
  const num = parseFloat(value);
  if (isNaN(num)) return 0;
  // If number exceeds PostgreSQL's DECIMAL(15,2) limit, return 0
  return Math.abs(num) >= 1e13 ? 0 : num;
}

function formatDateForPostgres(dateString: string): string {
  try {
    // Define a mapping of month abbreviations to their corresponding numbers
    const monthMap: { [key: string]: number } = {
      Jan: 1,
      Feb: 2,
      Mar: 3,
      Apr: 4,
      May: 5,
      Jun: 6,
      Jul: 7,
      Aug: 8,
      Sep: 9,
      Oct: 10,
      Nov: 11,
      Dec: 12,
    };

    // Extract day, month, and year from the date string
    const day = parseInt(dateString.substring(0, 2), 10);
    const monthAbbreviation = dateString.substring(2, 5);
    const year = parseInt(dateString.substring(5), 10);

    // Get the month number from the month abbreviation
    const month = monthMap[monthAbbreviation];

    // Create a Date object
    const date = new Date(year, month - 1, day); // Month is 0-based in JavaScript Date object

    if (isNaN(date.getTime())) {
      console.log("fout", dateString);
      return null;
    }

    // Format the date as YYYY-MM-DD
    const yearStr = date.getFullYear().toString();
    const monthStr = (date.getMonth() + 1).toString().padStart(2, "0"); // Month is 0-based
    const dayStr = date.getDate().toString().padStart(2, "0");

    return `${yearStr}-${monthStr}-${dayStr}`;
  } catch (error) {
    console.log(dateString, error);
    return null;
  }
}

export const cleanGemeenten = (data: any) => {
  let output: any[] = [];

  for (let row of data) {
    if (row.domein_code === "") {
      continue;
    }

    // Skip rows with empty required fields
    // Check if this row has jaar_week or jaar_maand and validate accordingly
    const hasJaarWeek = row.hasOwnProperty("jaar_week");
    const hasJaarMaand = row.hasOwnProperty("jaar_maand");

    if (
      hasJaarWeek &&
      (row.jaar_week === "" ||
        row.jaar_week === null ||
        row.jaar_week === undefined ||
        row.jaar_week === "NULL")
    ) {
      continue;
    }

    if (
      hasJaarMaand &&
      (row.jaar_maand === "" ||
        row.jaar_maand === null ||
        row.jaar_maand === undefined ||
        row.jaar_maand === "NULL")
    ) {
      continue;
    }

    let r: any = {};

    for (const key of Object.keys(row)) {
      const value = row[key];

      if (
        [
          "gemeente",
          "datum",
          "pc4",
          "jaar_week",
          "domein_code",
          "regeling_code",
          "zaaktype",
        ].indexOf(key) > -1
      ) {
        r[slugify(key)] =
          value === ""
            ? null
            : key === "gemeente"
              ? normalizeSpecialChars(value)
              : value;
      } else if (["week_vanaf", "week_totenmet"].indexOf(key) > -1) {
        r[slugify(key)] =
          value === ""
            ? null
            : key === "gemeente"
              ? normalizeSpecialChars(value)
              : value;
      } else if (["laad_dt"].indexOf(key) > -1) {
        r[slugify(key)] = value === "" ? null : value.split("T")[0];
      } else if (key.endsWith("_eur")) {
        r[slugify(key)] = value === "" || value === null || value === undefined ? null : value;
      } else if (key.endsWith("_aantal") || key.endsWith("_cumul")) {
        r[slugify(key)] = value === "" || value === null ? 0 : parseInt(value);
      } else {
        r[slugify(key)] = value === "" ? null : String(value);
      }
    }

    output.push(r);
  }

  return output;
};

export const cleanZaaktypes = (data: any) => {
  let output: any[] = [];

  for (let row of data) {
    if (row.domein_code === "") {
      continue;
    }

    // Skip rows with empty required fields
    // Check if this row has jaar_week or jaar_maand and validate accordingly
    const hasJaarWeek = row.hasOwnProperty("jaar_week");
    const hasJaarMaand = row.hasOwnProperty("jaar_maand");

    if (
      hasJaarWeek &&
      (row.jaar_week === "" ||
        row.jaar_week === null ||
        row.jaar_week === undefined ||
        row.jaar_week === "NULL")
    ) {
      continue;
    }

    if (
      hasJaarMaand &&
      (row.jaar_maand === "" ||
        row.jaar_maand === null ||
        row.jaar_maand === undefined ||
        row.jaar_maand === "NULL")
    ) {
      continue;
    }

    let r: any = {};

    for (const key of Object.keys(row)) {
      let value = row[key];
      value =
        value === "" ||
        value === undefined ||
        value === "NULL" ||
        value === null
          ? null
          : value;

      if (
        [
          "gemeente",
          "jaar_week",
          "jaar_maand",
          "domein_code",
          "regeling_code",
          "zaaktype",
          "week_vanaf",
          "week_totenmet",
          "maand_vanaf",
          "maand_totenmet",
          "voorraad_d",
        ].indexOf(key) > -1
      ) {
        r[slugify(key)] = value === "" ? null : value;
      } else if (key.endsWith("_eur")) {
        r[slugify(key)] = value;
      } else if (key.endsWith("_aantal") || key.endsWith("_cumul")) {
        r[slugify(key)] = value === "" || value === null ? 0 : parseInt(value);
      } else {
        r[slugify(key)] = value === "" ? null : String(value);
      }
    }

    // Skip rows where required fields are still null after processing
    const hasProcessedJaarWeek = r.hasOwnProperty("jaar-week");
    const hasProcessedJaarMaand = r.hasOwnProperty("jaar-maand");

    if (
      (hasProcessedJaarWeek && r["jaar-week"] === null) ||
      (hasProcessedJaarMaand && r["jaar-maand"] === null)
    ) {
      continue;
    }

    output.push(r);
  }

  return output;
};

let values;
console.log("Cache.js is running");

const loadList = (items) => {
    itemsJSON = JSON.parse(items);
    console.log(typeof itemsJSON);
    let selectbox = $("#country-select");
    for (let i=0;i< itemsJSON.length;i++)
    {
        let country = itemsJSON[i]["name"];
        selectbox.append("<option value='" + i + "'>" + country + "</option>");
    }
    selectbox.change((event) => {
        const itemJSON = itemsJSON[event.target.value];
        const year = "2005"
        let infotitle = $("#title");
        let infoPopulation=$("#population");
        let infoEmployment=$("#employment-rate");
        let infoSpending=$("#spending");
        let infoAlcohol=$("#alcohol-consumption");
        let infoInternet=$("#internet-access");
        infotitle.text(itemJSON["name"]);
        infoPopulation.text(getFromJSON("population", year, itemJSON));
        let suffix = (getFromJSON("employment", year, itemJSON) === "N/A") ? "" : "%";
        infoEmployment.text(getFromJSON("employment", year, itemJSON, "Rate", "", suffix));
        let prefix = (getFromJSON("spending", year, itemJSON) === "N/A") ? "" : "$";
        infoSpending.text(getFromJSON("spending", year, itemJSON, "Per Capita", prefix));
        infoAlcohol.text(getFromJSON("alcohol", year, itemJSON, "Consumption"));
        infoInternet.text(getFromJSON("internet", year, itemJSON, "Access"));
    });
}


if (localStorage.getItem('countries') === null)
{
    console.log("Well, the checking part worked.")
    $.get("http://10.25.137.137:80/api/countries", (response) => {
        responseJSON = JSON.parse(response);
        localStorage.setItem('countries', JSON.stringify(responseJSON));
        return responseJSON;
        //console.log(JSON.stringify(values));
    }).then((values) => {
        loadList(values);
    });
}
else
{
    values = localStorage.getItem('countries');
    valuesString = JSON.stringify(values);
    loadList(JSON.parse(valuesString));
}

const getFromJSON = (field, year, itemJSON, extra = "", prefix = "", suffix = "") => {
    const rawData = (itemJSON["data"][field] !== undefined) ? itemJSON["data"][field][year] : undefined;
    console.log(rawData);
    const numString = (rawData !== undefined && rawData != 0) ? prefix + formatNumbers(rawData) + suffix : "N/A";
    extra = (extra != "") ? " " + extra : "";
    return capitalize(field) + extra + ": " + numString;
};

const formatNumbers = (amount, decimalCount = 0, decimal = ".", thousands = ",") => {
    try {
        decimalCount = Math.abs(decimalCount);
        decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

        const negativeSign = amount < 0 ? "-" : "";

        let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
        let j = (i.length > 3) ? i.length % 3 : 0;

        return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
    } catch (e) {
        console.log(e)
    }
};

const capitalize = (s) => {
    if (typeof s !== 'string') return '';
    n = s.replace("_", " ");
    n = n.replace("id", "ID");
    n = n.charAt(0).toUpperCase() + n.slice(1);
    return n;
};
let values;
const base_url = "http://10.25.137.137:80/api/countries/";
console.log("Cache.js is running");

const loadList = (items) => {
    itemsJSON = JSON.parse(items);
    itemsJSON.sort(function(a, b) {
        var x = a.name; var y = b.name;
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
    console.log(typeof itemsJSON);
    let selectbox = $("#country-select");
    for (let i=0;i< itemsJSON.length;i++)
    {
        let country = itemsJSON[i]["name"];
        selectbox.append("<option value='" + i + "'>" + country + "</option>");
    }
    selectbox.change(() => {
        changeInfoBox();
    });
}


if (localStorage.getItem('countries') === null)
{
    console.log("Well, the checking part worked.")
    $.get(base_url, (response) => {
        responseJSON = JSON.parse(response);
        localStorage.setItem('countries', JSON.stringify(responseJSON));
        return responseJSON;
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

const yearbox = $("#year-select");
for (let y = 1998; y <= 2008; y++)
{
    yearbox.append("<option value='" + y + "'>" + y + "</option>");
}
yearbox.change(() => {
    changeInfoBox();
});

function changeInfoBox() {
    const itemJSONname = itemsJSON[$("#country-select").children("option:selected").val()]["name"];
    $.get(base_url + itemJSONname, (response) => {
        responseJSON = JSON.parse(response);
        return responseJSON;
    }).then((updatedJSON) => {
        let itemJSON = updatedJSON;
        console.log(itemJSON);
        keys = Object.keys(itemJSON);
        for (k in keys)
        {
            console.log(k + ": " + keys[k]);
        }
    
        const year = $("#year-select").children("option:selected").val();
        const infobox = $("#infobox");
        if (itemJSON["name"] != "")
        {
            infobox.removeClass("hidden");
            let infotitle = $("#title");
            let titletext = itemJSON["name"] + ", " + year;
            infotitle.text(titletext);

            let infoPopulation=$("#population");
            let infoEmployment=$("#employment-rate");
            let infoSpending=$("#spending");
            let infoAlcohol=$("#alcohol-consumption");
            let infoInternet=$("#internet-access");

            infoPopulation.text(getFromJSON("population", year, itemJSON));
            let suffix = (getFromJSON("employment", year, itemJSON) === "N/A") ? "" : "%";
            infoEmployment.text(getFromJSON("employment", year, itemJSON, "Rate", "", suffix));
            let prefix = (getFromJSON("spending", year, itemJSON) === "N/A") ? "" : "$";
            infoSpending.text("Government Health " + getFromJSON("spending", year, itemJSON, "Per Capita", prefix));
            suffix = (getFromJSON("spending", year, itemJSON) === "N/A") ? "" : " litres";
            infoAlcohol.text(getFromJSON("alcohol", year, itemJSON, "Consumption Per Adult", "", suffix));
            infoInternet.text("Population With " + getFromJSON("internet", year, itemJSON, "Access"));
        }
        else
        {
            infobox.addClass("hidden");
        }
    });
};

function getFromJSON(field, year, itemJSON, extra = "", prefix = "", suffix = "") {
    const rawData = (itemJSON["data"][field] !== undefined) ? itemJSON["data"][field][year] : undefined;
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

function capitalize(s) {
    if (typeof s !== 'string') return '';
    n = s.replace("_", " ");
    n = n.replace("id", "ID");
    n = n.charAt(0).toUpperCase() + n.slice(1);
    return n;
};
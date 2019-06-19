var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var values = void 0;
console.log("Cache.js is running");

var loadList = function loadList(items) {
    itemsJSON = JSON.parse(items);
    console.log(typeof itemsJSON === "undefined" ? "undefined" : _typeof(itemsJSON));
    var selectbox = $("#country-select");
    for (var i = 0; i < itemsJSON.length; i++) {
        var country = itemsJSON[i]["name"];
        selectbox.append("<option value='" + i + "'>" + country + "</option>");
    }
    selectbox.change(function (event) {
        var itemJSON = itemsJSON[event.target.value];
        var year = "2005";
        var infotitle = $("#title");
        var infoPopulation = $("#population");
        var infoEmployment = $("#employment-rate");
        var infoSpending = $("#spending");
        var infoAlcohol = $("#alcohol-consumption");
        var infoInternet = $("#internet-access");
        infotitle.text(itemJSON["name"]);
        infoPopulation.text(getFromJSON("population", year, itemJSON));
        var suffix = getFromJSON("employment", year, itemJSON) === "N/A" ? "" : "%";
        infoEmployment.text(getFromJSON("employment", year, itemJSON, "Rate", "", suffix));
        var prefix = getFromJSON("spending", year, itemJSON) === "N/A" ? "" : "$";
        infoSpending.text(getFromJSON("spending", year, itemJSON, "Per Capita", prefix));
        infoAlcohol.text(getFromJSON("alcohol", year, itemJSON, "Consumption"));
        infoInternet.text(getFromJSON("internet", year, itemJSON, "Access"));
    });
};

if (localStorage.getItem('countries') === null) {
    console.log("Well, the checking part worked.");
    $.get("http://10.25.137.137:80/api/countries", function (response) {
        responseJSON = JSON.parse(response);
        localStorage.setItem('countries', JSON.stringify(responseJSON));
        return responseJSON;
        //console.log(JSON.stringify(values));
    }).then(function (values) {
        loadList(values);
    });
} else {
    values = localStorage.getItem('countries');
    valuesString = JSON.stringify(values);
    loadList(JSON.parse(valuesString));
}

var getFromJSON = function getFromJSON(field, year, itemJSON) {
    var extra = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "";
    var prefix = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "";
    var suffix = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : "";

    var rawData = itemJSON["data"][field] !== undefined ? itemJSON["data"][field][year] : undefined;
    console.log(rawData);
    var numString = rawData !== undefined && rawData != 0 ? prefix + formatNumbers(rawData) + suffix : "N/A";
    extra = extra != "" ? " " + extra : "";
    return capitalize(field) + extra + ": " + numString;
};

var formatNumbers = function formatNumbers(amount) {
    var decimalCount = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var decimal = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ".";
    var thousands = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : ",";

    try {
        decimalCount = Math.abs(decimalCount);
        decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

        var negativeSign = amount < 0 ? "-" : "";

        var i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
        var j = i.length > 3 ? i.length % 3 : 0;

        return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
    } catch (e) {
        console.log(e);
    }
};

var capitalize = function capitalize(s) {
    if (typeof s !== 'string') return '';
    n = s.replace("_", " ");
    n = n.replace("id", "ID");
    n = n.charAt(0).toUpperCase() + n.slice(1);
    return n;
};
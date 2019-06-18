var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var values = void 0;
console.log("Cache.js is running");

var loadList = function loadList(items) {
    itemsJSON = JSON.parse(items);
    console.log(typeof itemsJSON === "undefined" ? "undefined" : _typeof(itemsJSON));
    var selectbox = $("#country-select");
    for (var i = 0; i < itemsJSON.length; i++) {
        var country = itemsJSON[i]["name"];
        selectbox.append("<option value='" + country + "'>" + country + "</option>");
        console.log(itemsJSON[i]["name"]);
    }
    selectbox.addEventListener("change", function (event) {
        var infotitle = $("#title");
        infotitle.append("SELECTED");
    });
};

if (localStorage.getItem('countries') === null) {
    console.log("Well, the checking part worked.");
    $.get("http://10.25.137.137:80/api/countries", function (response) {
        responseJSON = JSON.parse(response);
        console.log("Response: " + responseJSON);
        //localStorage.setItem('countries', JSON.stringify(responseJSON));
        values = responseJSON;
        return values;
        //console.log(JSON.stringify(values));
    }).then(function (values) {
        loadList(values);
    });
} else {
    values = localStorage.getItem('countries');
    console.log("Local Storage: " + values);
    valuesString = JSON.stringify(values);
    console.log(JSON.parse(valuesString));
    loadList(JSON.parse(valuesString));
}
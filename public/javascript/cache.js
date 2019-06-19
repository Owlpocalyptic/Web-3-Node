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
        var infotitle = $("#title");
        var infoPopulation = $("#population");
        infotitle.text(itemJSON["name"]);
        infoPopulation.text(function () {
            var popData = itemJSON["data"]["population"]["2005"];
            var popString = itemJSON["data"]["population"] !== undefined ? popData : "N/A";
            return "Population: " + popString;
        });
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
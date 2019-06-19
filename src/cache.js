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
        let infotitle = $("#title");
        let infoPopulation=$("#population")
        infotitle.text(itemJSON["name"]);
        infoPopulation.text(() => {
            const popData = itemJSON["data"]["population"]["2005"]
            const popString = (itemJSON["data"]["population"] !== undefined) ? popData : "N/A";
            return "Population: " + popString;
        });
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
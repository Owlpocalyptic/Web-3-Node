let values;
console.log("Cache.js is running");

const loadList = (items) => {
    itemsJSON = JSON.parse(items);
    console.log(typeof itemsJSON);
    let selectbox = $("#country-select");
    for (let i=0;i< itemsJSON.length;i++)
    {
        let country = itemsJSON[i]["name"];
        selectbox.append("<option value='" + country + "'>" + country + "</option>");
        console.log(itemsJSON[i]["name"]);
    }
    selectbox.addEventListener("change", (event) => {
        let infotitle = $("#title");
        infotitle.append("SELECTED");
    });
}


if (localStorage.getItem('countries') === null)
{
    console.log("Well, the checking part worked.")
    $.get("http://10.25.137.137:80/api/countries", (response) => {
        responseJSON = JSON.parse(response);
        console.log("Response: " + responseJSON);
        //localStorage.setItem('countries', JSON.stringify(responseJSON));
        values = responseJSON;
        return values;
        //console.log(JSON.stringify(values));
    }).then((values) => {
        loadList(values);
    });
}
else
{
    values = localStorage.getItem('countries');
    console.log("Local Storage: " + values);
    valuesString = JSON.stringify(values);
    console.log(JSON.parse(valuesString));
    loadList(JSON.parse(valuesString));
}
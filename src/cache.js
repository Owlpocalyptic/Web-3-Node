let values;
console.log("Cache.js is running");

$.ajaxSetup({
    type: "GET",
    data: {},
    dataType: 'json',
    crossDomain: true,
    contentType: 'application/json; charset=utf-8'
});

if (localStorage.getItem('countries') === null)
{
    $.get("10.25.137.137:80/api/countries", (response) => {
        console.log("Response: " + response);
        localStorage.setItem('countries', 'response');
    });
}
else
{
    console.log("Local Storage: " + localStorage.getItem('countries'));
    values = localStorage.getItem('countries');
}
let values;
console.log("Cache.js is running");
if (localStorage.getItem('countries') === null)
{
    $.get("10.25.137.196/api/countries", (response) => {
        console.log("Response: " + response);
        localStorage.setItem('countries', 'response');
    });
}
else
{
    console.log("Local Storage: " + localStorage.getItem('countries'));
    values = localStorage.getItem('countries');
}
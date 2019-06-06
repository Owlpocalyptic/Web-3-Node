let values;
console.log("Cache.js is running");
if (localStorage.getItem('countries') === null)
{
    console.log("Local Storage: " + localStorage.getItem('countries'));
    values = localStorage.getItem('countries');
}
else
{
    $.get("10.25.137.196:80/api/countries", (response) => {
        console.log("Response: " + response);
        localStorage.setItem('countries', 'response');
    });
}
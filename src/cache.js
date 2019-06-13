let values;
console.log("Cache.js is running");


if (localStorage.getItem('countries') === null)
{
    console.log("Well, the checking part worked.")
    fetch("10.25.137.137:80/api/countries", { method: 'get', mode: 'cors'}, (response) => {
        console.log("Response: " + response);
        localStorage.setItem('countries', 'response');
    });
}
else
{
    console.log("Local Storage: " + localStorage.getItem('countries'));
    values = localStorage.getItem('countries');
}
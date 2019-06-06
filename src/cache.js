let values;

if (localStorage.getItem('countries'))
{
    console.log("Local Storage: " + localStorage.getItem('countries'));
    values = localStorage.getItem('countries');
}
else
{
    $.get("10.25.137.196:5000/api/countries", (response) => {
        console.log("Response: " + response);
        localStorage.setItem('countries', 'response');
    });
}
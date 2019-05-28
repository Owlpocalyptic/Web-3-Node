if (localStorage.getItem('countries')) {} else {
    $.get("127.0.0.1:5000/api/countries", function (response) {
        console.log("Response: " + response);
    });
}
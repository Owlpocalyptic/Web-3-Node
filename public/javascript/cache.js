'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var values = void 0;
var base_url = "http://10.25.137.137:80/api/countries";
console.log("Cache.js is running");

var CountryList = function (_React$Component) {
    _inherits(CountryList, _React$Component);

    function CountryList(props) {
        _classCallCheck(this, CountryList);

        var _this = _possibleConstructorReturn(this, (CountryList.__proto__ || Object.getPrototypeOf(CountryList)).call(this, props));

        _this.countrySelect = React.createRef();
        _this.yearSelect = React.createRef();
        _this.state = {
            countries: null
        };
        _this.addCountries();
        return _this;
    }

    _createClass(CountryList, [{
        key: "addCountries",
        value: function addCountries() {
            var _this2 = this;

            if (localStorage.getItem('countries') === null) {
                console.log("Well, the checking part worked.");
                $.get(base_url, function (response) {
                    var responseJSON = JSON.parse(response);
                    var resultArray = $.map(responseJSON, function (value, index) {
                        return [value];
                    });
                    resultArray.sort().reverse();
                    localStorage.setItem('countries', JSON.stringify(responseJSON));
                    return responseJSON;
                }).done(function (values) {
                    _this2.state.countries = values;
                });
            } else {
                var _values = localStorage.getItem('countries');
                this.state.countries = _values;
            }
            this.state.countries = this.state.countries;
        }
    }, {
        key: "render",
        value: function render() {
            var countries = this.state.countries;
            var countriesJSON = JSON.parse(countries);

            var listCountries = countriesJSON.map(function (country) {
                var name = country["name"];
                return React.createElement(
                    "option",
                    { key: name, value: name },
                    name
                );
            });

            var yearArray = [];
            for (var y = 1998; y <= 2008; y++) {
                yearArray.push(y);
            }

            var listYears = yearArray.map(function (year) {
                return React.createElement(
                    "option",
                    { key: year, value: year },
                    year
                );
            });

            return React.createElement(
                "table",
                null,
                React.createElement(
                    "tbody",
                    null,
                    React.createElement(
                        "tr",
                        null,
                        React.createElement(
                            "td",
                            null,
                            React.createElement(
                                "label",
                                { htmlFor: "country-select" },
                                "Country"
                            )
                        ),
                        React.createElement(
                            "td",
                            null,
                            React.createElement(
                                "select",
                                { id: "country-select", ref: this.countrySelect, name: "countries", onChange: this.props.onChange },
                                listCountries
                            )
                        )
                    ),
                    React.createElement(
                        "tr",
                        null,
                        React.createElement(
                            "td",
                            null,
                            React.createElement(
                                "label",
                                { htmlFor: "year-select" },
                                "Year"
                            )
                        ),
                        React.createElement(
                            "td",
                            null,
                            React.createElement(
                                "select",
                                { id: "year-select", ref: this.yearSelect, name: "years", onChange: this.props.onChangeYear },
                                listYears
                            )
                        )
                    )
                )
            );
        }
    }]);

    return CountryList;
}(React.Component);

var InfoBox = function (_React$Component2) {
    _inherits(InfoBox, _React$Component2);

    function InfoBox(props) {
        _classCallCheck(this, InfoBox);

        var _this3 = _possibleConstructorReturn(this, (InfoBox.__proto__ || Object.getPrototypeOf(InfoBox)).call(this, props));

        _this3.state = {
            countryData: null,
            country: null,
            population: null,
            employment: null,
            spending: null,
            alcohol: null,
            internet: null,
            year: "1998",
            failed: false
        };
        _this3.handleChange = _this3.handleChange.bind(_this3);
        _this3.handleChangeYear = _this3.handleChangeYear.bind(_this3);
        _this3.cycleData = _this3.cycleData.bind(_this3);
        return _this3;
    }

    // onChange handler for the Country-Select input. Makes an API request to the other app each time it's called.


    _createClass(InfoBox, [{
        key: "handleChange",
        value: function handleChange(val) {
            var _this4 = this;

            var countryName = val.target.value;
            var year = this.state.year;
            $.get(base_url + "/" + countryName, function (response) {
                return JSON.parse(response);
            }).done(function (updatedJSON) {
                var countryData = JSON.parse(updatedJSON);
                _this4.cycleData(countryData, year, countryName);
                _this4.setState({
                    failed: false
                });
            }).fail(function () {
                _this4.setState({
                    failed: true
                });
            });
        }

        // onChange handler for the Year-Select input. Does not make an API request: the data is already in storage.

    }, {
        key: "handleChangeYear",
        value: function handleChangeYear(val) {
            this.cycleData(this.state.countryData, val.target.value);
        }

        // helper method that vastly reduces code duplication, since every single value except for country and countryData have to be set whenever
        // the year changes, and every single value except for year has to be set whenever the country changes.

    }, {
        key: "cycleData",
        value: function cycleData(countryData, year) {
            var countryName = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.state.country;

            this.setState({
                countryData: countryData,
                country: countryName,
                population: getFromJSON("population", year, countryData),
                employment: getFromJSON("employment", year, countryData, "", "%"),
                spending: getFromJSON("spending", year, countryData, "$"),
                alcohol: getFromJSON("alcohol", year, countryData, "", " litres"),
                internet: getFromJSON("internet", year, countryData),
                year: year
            });
        }
    }, {
        key: "render",
        value: function render() {
            var _this5 = this;

            if (!this.state.country || this.state.failed) {
                return React.createElement(
                    "div",
                    null,
                    React.createElement(CountryList, {
                        onChange: function onChange(val) {
                            return _this5.handleChange(val);
                        },
                        onChangeYear: function onChangeYear(val) {
                            return _this5.handleChangeYear(val);
                        }
                    })
                );
            }

            return React.createElement(
                "div",
                null,
                React.createElement(CountryList, {
                    onChange: function onChange(val) {
                        return _this5.handleChange(val);
                    },
                    onChangeYear: function onChangeYear(val) {
                        return _this5.handleChangeYear(val);
                    }
                }),
                React.createElement(
                    "div",
                    { id: "title" },
                    React.createElement(
                        "h2",
                        null,
                        this.state.country
                    ),
                    React.createElement(
                        "div",
                        { id: "population" },
                        "Population: ",
                        this.state.population
                    ),
                    React.createElement(
                        "div",
                        { id: "employment" },
                        "Employment Rate: ",
                        this.state.employment
                    ),
                    React.createElement(
                        "div",
                        { id: "spending" },
                        "Government Health Spending Per Capita: ",
                        this.state.spending
                    ),
                    React.createElement(
                        "div",
                        { id: "alcohol" },
                        "Alcohol Consumption Per Adult: ",
                        this.state.alcohol
                    ),
                    React.createElement(
                        "div",
                        { id: "internet" },
                        "Population With Internet Access: ",
                        this.state.internet
                    )
                )
            );
        }
    }]);

    return InfoBox;
}(React.Component);

// pulls the relevant field out of any JSON object with a "data" field.
// if the field returns undefined, this will return N/A instead. (error checking!)


function getFromJSON(field, year, itemJSON) {
    var prefix = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "";
    var suffix = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "";

    var rawData = itemJSON["data"][field] !== undefined ? itemJSON["data"][field][year] : undefined;
    var numString = rawData !== undefined && rawData != 0 ? prefix + formatNumbers(rawData) + suffix : "N/A";
    return numString;
};

// formats numbers so that they're legible and users don't have to count digits to get a sense of
// what each country's population is.
var formatNumbers = function formatNumbers(amount) {
    var decimalCount = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var decimal = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ".";
    var thousands = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : ",";

    try {
        decimalCount = Math.abs(decimalCount);
        decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

        var negativeSign = amount < 0 ? "-" : "";

        var i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
        var j = i.length > 3 ? i.length % 3 : 0;

        return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
    } catch (e) {
        console.log(e);
    }
};

ReactDOM.render(React.createElement(InfoBox, null), document.getElementById('info'));

// ==============================
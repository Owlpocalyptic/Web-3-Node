'use strict';

let values;
const base_url = "http://10.25.137.137:80/api/countries";
console.log("Cache.js is running");


class CountryList extends React.Component {
    constructor(props) {
        super(props);
        this.countrySelect = React.createRef();
        this.yearSelect = React.createRef();
        this.state = {
            countries: null
        }
        this.addCountries();
    }

    addCountries() {
        if (localStorage.getItem('countries') === null)
        {
            console.log("Well, the checking part worked.")
            $.get(base_url, (response) => {
                let responseJSON = JSON.parse(response);
                const resultArray = $.map(responseJSON, function(value, index) { return [value]; });
                resultArray.sort().reverse();
                localStorage.setItem('countries', JSON.stringify(responseJSON));
                return responseJSON;
            }).done((values) => {
                this.state.countries = values;
            });
        }
        else
        {
            let values = localStorage.getItem('countries');
            this.state.countries = values;
        }
        this.state.countries = this.state.countries
    }

    render() {
        const countries = this.state.countries;
        const countriesJSON = JSON.parse(countries);
        
        const listCountries = countriesJSON.map((country) => {
            const name = country["name"]
            return (
                <option key={name} value={name}>{name}</option>
            );
        });

        const yearArray = []
        for (let y = 1998; y <= 2008; y++)
        {
            yearArray.push(y);
        }

        const listYears = yearArray.map((year) => {
            return (
                <option key={year} value={year}>{year}</option>
            )
        });

        return (
            <table>
                <tbody>
                <tr>
                    <td>
                        <label htmlFor="country-select">Country</label>
                    </td>
                    <td>
                        <select id="country-select" ref={this.countrySelect} name="countries" onChange={this.props.onChange}>{listCountries}</select>
                    </td>
                </tr>
                <tr>
                    <td>
                        <label htmlFor="year-select">Year</label>
                    </td>
                    <td>
                        <select id="year-select" ref={this.yearSelect} name="years" onChange={this.props.onChangeYear}>{listYears}</select>
                    </td>
                </tr>
                </tbody>
            </table>
        );
    }
}

class InfoBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            countryData : null,
            country: null,
            population: null,
            employment: null,
            spending: null,
            alcohol: null,
            internet: null,
            year: "1998",
            failed: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeYear = this.handleChangeYear.bind(this);
        this.cycleData = this.cycleData.bind(this);
    }

    // onChange handler for the Country-Select input. Makes an API request to the other app each time it's called.
    handleChange(val) {
        const countryName = val.target.value;
        const year = this.state.year;
        $.get(base_url + "/" + countryName, (response) => {
            return JSON.parse(response);
        }).done((updatedJSON) => {
            const countryData = JSON.parse(updatedJSON);
            this.cycleData(countryData, year, countryName);
            this.setState({ 
                failed: false
            });
        }).fail(() => {
            this.setState({ 
                failed: true
            });
        });
    }

    // onChange handler for the Year-Select input. Does not make an API request: the data is already in storage.
    handleChangeYear(val) {
        this.cycleData(this.state.countryData, val.target.value);
    }

    // helper method that vastly reduces code duplication, since every single value except for country and countryData have to be set whenever
    // the year changes, and every single value except for year has to be set whenever the country changes.
    cycleData(countryData, year, countryName=this.state.country) {
        this.setState({
            countryData : countryData,
            country: countryName,
            population: getFromJSON("population", year, countryData),
            employment: getFromJSON("employment", year, countryData, "", "%"),
            spending: getFromJSON("spending", year, countryData, "$"),
            alcohol: getFromJSON("alcohol", year, countryData, "", " litres"),
            internet: getFromJSON("internet", year, countryData),
            year: year
        });
    }

    render() {
        if (!this.state.country || this.state.failed)
        {
            return (
            <div>
                <CountryList 
                    onChange={(val) => this.handleChange(val)}
                    onChangeYear={(val) => this.handleChangeYear(val)}
                />  
            </div>);
        }

        return (
            <div>
                <CountryList 
                    onChange={(val) => this.handleChange(val)}
                    onChangeYear={(val) => this.handleChangeYear(val)}
                />
                <div id="title">
                    <h2>{this.state.country}</h2>
                    <div id="population">Population: {this.state.population}</div>
                    <div id="employment">Employment Rate: {this.state.employment}</div>
                    <div id="spending">Government Health Spending Per Capita: {this.state.spending}</div>
                    <div id="alcohol">Alcohol Consumption Per Adult: {this.state.alcohol}</div>
                    <div id="internet">Population With Internet Access: {this.state.internet}</div>
                </div>
            </div>
        );
    }
}

// pulls the relevant field out of any JSON object with a "data" field.
// if the field returns undefined, this will return N/A instead. (error checking!)
function getFromJSON(field, year, itemJSON, prefix = "", suffix = "") {
    const rawData = (itemJSON["data"][field] !== undefined) ? itemJSON["data"][field][year] : undefined;
    const numString = (rawData !== undefined && rawData != 0) ? prefix + formatNumbers(rawData) + suffix : "N/A";
    return numString;
};

const formatNumbers = (amount, decimalCount = 0, decimal = ".", thousands = ",") => {
    try {
        decimalCount = Math.abs(decimalCount);
        decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

        const negativeSign = amount < 0 ? "-" : "";

        let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
        let j = (i.length > 3) ? i.length % 3 : 0;

        return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
    } catch (e) {
        console.log(e)
    }
};

ReactDOM.render(
    <InfoBox />,
    document.getElementById('info')
  );




// ==============================
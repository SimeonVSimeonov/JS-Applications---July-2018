function attachEvents() {
    let baseUrl = `https://judgetests.firebaseio.com/`;
    $('#submit').click(getForecast);

    function request(endpoint) {
        return $.ajax({
            method: 'GET',
            url: baseUrl + endpoint
        })
    }

    function getForecast() {
        request('locations.json')
            .then(displayForecast)
            .catch(handleError);

        function displayForecast(allLocations) {
            let location = $('#location').val();
            let locationCode = allLocations
                .filter(l => l['name'] === location)
                .map(l => l['code'])[0];
            if (!locationCode) {
                handleError();
            }

            let weatherSymbols = {
                'Sunny': '&#x2600',
                'Partly sunny': '&#x26C5',
                'Overcast': '&#x2601',
                'Rain': '&#x2614'
            };

            let currentForecastProm = request(`forecast/today/${locationCode}.json`);
            let threeDaysForecastProm = request(`forecast/upcoming/${locationCode}.json`);

            Promise.all([currentForecastProm, threeDaysForecastProm])
                .then(displayCondition)
                .catch(handleError);

            function displayCondition([currCondition, upcomingCondition]) {
                $('#forecast').css('display', 'block');

                appendDataCurr();
                appendDataUpComm();

                function appendDataCurr() {
                    let current = $('#current');
                    current.empty();

                    let condition = currCondition['forecast']['condition'];
                    let name = currCondition['name'];
                    let low = currCondition['forecast']['low'];
                    let high = currCondition['forecast']['high'];

                    current
                        .append($('<div class="label">Current conditions</div>'))
                        .append($('<span>')
                            .addClass('condition symbol')
                            .html(weatherSymbols[condition]))
                        .append($('<span>')
                            .addClass('condition')
                            .append($('<span>')
                                .addClass('forecast-data')
                                .text(name))
                            .append($('<span>')
                                .addClass('forecast-data')
                                .html(`${low}&#176/${high}&#176`))
                            .append($('<span>')
                                .addClass('forecast-data')
                                .text(condition)));
                }

                function appendDataUpComm() {
                    let upcoming = $('#upcoming');
                    upcoming.empty();
                    upcoming.append($('<div class="label">Three-day forecast </div>'));

                    for (let forecast of upcomingCondition['forecast']) {
                        let condition = forecast['condition'];
                        let low = forecast['low'];
                        let high = forecast['high'];
                        upcoming.append($('<span>')
                            .addClass('upcoming')
                            .append($('<span>')
                                .addClass('symbol')
                                .html(weatherSymbols[condition]))
                            .append($('<span>')
                                .addClass('forecast-data')
                                .html(`${low}&#176;/${high}&#176;`))
                            .append($('<span>')
                                .addClass('forecast-data')
                                .text(condition)))
                    }
                }
            }
        }

    }

    function handleError() {
        $('#forecast')
            .css('display', 'block')
            .text('Error');
    }
}
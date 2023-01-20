// use const for JS DOM because JS DOM usually not changed through usage
const weatherTime = document.getElementById('weather-time');
const weatherLoc = document.getElementById('weather-loc');
const weatherTemp = document.getElementById('weather-temp');
const weatherIcon = document.getElementById('weather-icon');
const weatherSimpleDesc = document.getElementById('weather-simple-desc');
const weatherLongDesc = document.getElementById('weather-long-desc');
const weatherPressure = document.getElementById('weather-pressure');
const weatherHumidity = document.getElementById('weather-humidity');
const weatherSunrise = document.getElementById('weather-sunrise');
const weatherSunset = document.getElementById('weather-sunset');

const hpaToAtm = 0.0009869233;

function convertEpochToSpecificTimezone(timeEpoch, offset) {
  let d = new Date(timeEpoch * 1000); // * 1000 to set unix timestamp from second to milisecond
  let utc = d.getTime() + d.getTimezoneOffset() * 60000; //This converts to UTC 00:00
  let nd = new Date(utc + 3600000 * offset); // 3600000 = 1 hour in milisecond
  let day = nd.toLocaleString('id-ID', { day: 'numeric' });
  let month = nd.toLocaleString('id-ID', { month: 'long' });
  let year = nd.toLocaleString('id-ID', { year: 'numeric' });
  let time = nd.toLocaleString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  let dateTimeConv = day + ' ' + month + ' ' + year + ', ' + time + ' WIB';
  return dateTimeConv;
}

let promise = new Promise(function (resolve, reject) {
  let xhr = new XMLHttpRequest(),
    method = 'GET',
    url =
      'https://api.openweathermap.org/data/2.5/weather?q=Jakarta,id&units=metric&lang=id&appid=7b0d62bdcdbc3faf539c206ffcbd3dc3';

  xhr.open(method, url, true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      resolve(JSON.parse(xhr.responseText));
    }
  };
  xhr.send();
});

promise.then(function (value) {
  weatherLoc.innerHTML = '<h1><b>' + value.name + '</b></h1>';
  weatherTime.innerText =
    'Data diambil pada: ' + convertEpochToSpecificTimezone(value.dt, +7);
  weatherTemp.innerHTML = value.main.temp + '&#8451;';
  weatherIcon.innerHTML =
    '<img src="http://openweathermap.org/img/wn/' +
    value.weather[0].icon +
    '@2x.png" alt="" style="border: 2px solid black; border-radius: 10px;">';
  weatherSimpleDesc.innerText = value.weather[0].main;
  weatherLongDesc.innerText = value.weather[0].description;
  weatherPressure.innerText =
    Math.round(value.main.pressure * hpaToAtm * 100) / 100 + ' atm';
  weatherHumidity.innerHTML = value.main.humidity + '&#37;';
  weatherSunrise.innerText = convertEpochToSpecificTimezone(
    value.sys.sunrise,
    +7
  );
  weatherSunset.innerText = convertEpochToSpecificTimezone(
    value.sys.sunset,
    +7
  );
});

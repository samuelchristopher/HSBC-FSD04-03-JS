let weatherTime = document.getElementById('weather-time');
let weatherLoc = document.getElementById('weather-loc');
let weatherTemp = document.getElementById('weather-temp');
let weatherIcon = document.getElementById('weather-icon');
let weatherSimpleDesc = document.getElementById('weather-simple-desc');
let weatherLongDesc = document.getElementById('weather-long-desc');
let weatherPressure = document.getElementById('weather-pressure');
let weatherHumidity = document.getElementById('weather-humidity');
let weatherSunrise = document.getElementById('weather-sunrise');
let weatherSunset = document.getElementById('weather-sunset');

const hpaToAtm = 0.0009869233;

function convertEpochToSpecificTimezone(timeEpoch, offset) {
  let d = new Date(timeEpoch * 1000);
  let utc = d.getTime() + d.getTimezoneOffset() * 60000; //This converts to UTC 00:00
  let nd = new Date(utc + 3600000 * offset);
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

let promise1 = new Promise(function (resolve, reject) {
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

promise1.then(function (value) {
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

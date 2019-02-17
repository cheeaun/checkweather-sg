const $rain = document.getElementById('rain');
const $obs = document.getElementById('obs');
const $datetime = document.getElementById('datetime');
const HOST = 'https://api.checkweather.sg';
const lowerLat = 1.156, upperLat = 1.475, lowerLong = 103.565, upperLong = 104.130;
const longRange = upperLong - lowerLong;
const latRange = upperLat - lowerLat;

import arrowDown from '../assets/arrow-down.svg';

const calcPos = (long, lat) => {
  // Note: These are inaccurate measurements.
  // Maybe only works for Singapore since it's small.
  return {
    x: (long - lowerLong) / longRange * 400,
    y: (upperLat - lat) / latRange * 226,
  };
};

const timeID = (id) => (id.match(/\d{4}$/) || [''])[0].replace(/(\d{2})(\d{2})/, (m, m1, m2) => {
  let h = parseInt(m1, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  if (h == 0) h = 12;
  if (h > 12) h -= 12;
  return h + ':' + m2 + ' ' + ampm;
});

let nowID;
const showRain = () => {
  fetch(HOST + '/now-id').then(res => res.text()).then(id => {
    if (nowID === id){
      setTimeout(requestAnimationFrame, 60 * 1000, showRain); // every min
      return;
    }
    nowID = id;
    $datetime.visiblity = 'hidden';
    const path = `https://www.weather.gov.sg/files/rainarea/50km/v2/dpsri_70km_${id}0000dBR.dpsri.png`;
    $rain.setAttribute('href', path);
    $rain.setAttribute('xlink:href', path);
    $datetime.innerHTML = timeID(id);
  });
}
$rain.onload = () => {
  setTimeout(requestAnimationFrame, 60 * 1000, showRain); // every min
  $datetime.visiblity = '';
};
$rain.onerror = () => {
  nowID = null;
  setTimeout(requestAnimationFrame, 1000, showRain);
};

const showObservations = () => {
  fetch(HOST + '/observations?compact=1').then(res => res.json()).then(body => {
    $obs.innerHTML = '';
    body.features.forEach(f => {
      const { coordinates } = f.geometry;
      const pos = calcPos(coordinates[0], coordinates[1]);
      const { temp_celcius, wind_direction } = f.properties;
      if (temp_celcius) {
        $obs.insertAdjacentHTML('beforeend', `<text class="t" x="${pos.x}" y="${pos.y}" text-anchor="middle" dominant-baseline="central">${temp_celcius}°</text>`);
      }
      if (wind_direction) {
        $obs.insertAdjacentHTML('afterbegin', `<image class="w" x="${pos.x-20}" y="${pos.y-20}" xlink:href="${arrowDown}" width="40" height="40" transform="rotate(${wind_direction}, ${pos.x}, ${pos.y})"/>`);
      }
    });
    setTimeout(requestAnimationFrame, 2 * 60 * 1000, showObservations); // every 2 mins
  });
}

showRain();
showObservations();

// fetch('https://api.checkweather.sg/now?ascii=1').then(res => res.text()).then(body => {
//   let id, data = [];
//   body.split('\n').forEach((line, i) => {
//     if (i === 0){
//       id = line;
//     } else {
//       for (let j=0, l=line.length; j<l; j++) {
//         const c = line[j];
//         if (!data[i-1]) data[i-1] = [];
//         data[i-1].push(c.charCodeAt()-33);
//       }
//     }
//   });
//   console.log(id, data);

// });
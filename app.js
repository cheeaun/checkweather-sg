import arrowPath from './assets/arrow-down.png';
import haversine from 'new-point-haversine';

const center = [103.972583, 1.349110];
const { lowerLat, upperLat } = haversine.getLatitudeBounds(center[1], 70, 'km');
const { lowerLong, upperLong } = haversine.getLongitudeBounds(center[1], center[0], 70, 'km');

mapboxgl.accessToken = 'pk.eyJ1IjoiY2hlZWF1biIsImEiOiIwMTkyNjRiOWUzOTMyZThkYTE3YjMyMWFiZGU2OTZlNiJ9.XsOEKtyctGiNGNsmVhetYg';
if (window.$map) window.$map.remove();
const map = window.$map = new mapboxgl.Map({
  container: 'map',
  maxBounds: [lowerLong, lowerLat, upperLong, upperLat], // w,s,e,n
  style: 'mapbox://styles/mapbox/dark-v9?optimize=true',
  logoPosition: 'top-right',
  maxZoom: 14,
  renderWorldCopies: false,
  boxZoom: false,
  attributionControl: false,
});
const sgCenter = [103.821842, 1.349139];
map.setCenter(sgCenter);

// Controls
map.addControl(new mapboxgl.AttributionControl({
  compact: true
}), 'top-right');
map.addControl(new mapboxgl.NavigationControl(), 'top-right');
map.addControl(new mapboxgl.GeolocateControl({
  positionOptions: {
    enableHighAccuracy: true,
  },
  trackUserLocation: true,
}));

// Pitch control
class PitchControl {
  onAdd(map) {
    this._map = map;
    const container = document.createElement('div');
    container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group';
    container.innerHTML = '<button class="mapboxgl-ctrl-icon mapboxgl-ctrl-custom-pitch" type="button"><span>3D</span></button>';
    container.onclick = function(){
      var pitch = map.getPitch();
      var nextPitch = 0;
      if (pitch < 30) {
        nextPitch = 30;
      } else if (pitch < 45) {
        nextPitch = 45;
      } else if (pitch < 60) {
        nextPitch = 60;
      }
      map.easeTo({ pitch: nextPitch });
    };
    map.on('pitchend', this.onPitch.bind(this));
    this._container = container;
    return this._container;
  }
  onPitch() {
    const pitch = this._map.getPitch();
    this._container.classList.toggle('active', !!pitch);
    const text = this._container.getElementsByTagName('span')[0];
    text.style.transform = 'rotate3d(1,0,0,' + pitch + 'deg)';
  }
  onRemove() {
    this._container.parentNode.removeChild(this._container);
    this._map.off('pitchend', this.onPitch.bind(this));
    this._map = undefined;
  }
};
map.addControl(new PitchControl(), 'top-right');

// Clouds Mode control
let cloudsMode = false;
class CloudsModeControl {
  onAdd(map) {
    this._map = map;
    const container = document.createElement('div');
    container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group';
    container.innerHTML = `<button class="mapboxgl-ctrl-icon mapboxgl-ctrl-custom-clouds-mode" type="button">
      <svg viewBox="0 0 640 512">
        <path d="M537.585 226.56C541.725 215.836 544 204.184 544 192c0-53.019-42.981-96-96-96-19.729 0-38.065 5.954-53.316 16.159C367.042 64.248 315.288 32 256 32c-88.366 0-160 71.634-160 160 0 2.728.07 5.439.204 8.133C40.171 219.845 0 273.227 0 336c0 79.529 64.471 144 144 144h368c70.692 0 128-57.308 128-128 0-61.93-43.983-113.586-102.415-125.44z"/>
      </svg>
    </button>`;
    container.onclick = function(){
      cloudsMode = !cloudsMode;
      container.classList.toggle('active', cloudsMode);
      document.body.classList.toggle('cloud-mode', cloudsMode);
      if (cloudsMode){
        map.setLayoutProperty('rain3d', 'visibility', 'none');
        map.setLayoutProperty('rainlay', 'visibility', 'none');
        map.setLayoutProperty('rainclouds', 'visibility', 'visible');
        map.setLayoutProperty('raincloudshadows', 'visibility', 'visible');
        map.easeTo({
          pitch: 60,
        });
      } else {
        const pitch = map.getPitch();
        map.setLayoutProperty('rain3d', 'visibility', pitch > 0 ? 'visible' : 'none');
        map.setLayoutProperty('rainlay', 'visibility', pitch > 0 ? 'none' : 'visible');
        map.setLayoutProperty('rainclouds', 'visibility', 'none');
        map.setLayoutProperty('raincloudshadows', 'visibility', 'none');
      }
    };
    this._container = container;
    return this._container;
  }
  onRemove() {
    this._container.parentNode.removeChild(this._container);
    this._map = undefined;
  }
}
map.addControl(new CloudsModeControl(), 'top-right');

// Fade out the legend when interacting on the map
const $legend = document.getElementById('legend');
map.on('movestart', () => $legend.classList.add('faded'));
map.on('moveend', () => $legend.classList.remove('faded'));

const uniqMinute = () => {
  return Math.floor((new Date()).getMinutes()/5)*5;
};

const stationsMap = {};
const genReadingsGeoJSON = (data) => {
  data.metadata.stations.forEach(station => {
    if (stationsMap[station.id]) return;
    const { latitude, longitude } = station.location;
    stationsMap[station.id] = [longitude, latitude];
  });
  return {
    type: 'FeatureCollection',
    features: data.items[0].readings.map(reading => {
      return {
        type: 'Feature',
        properties: {
          reading: reading.value,
        },
        geometry: {
          type: 'Point',
          coordinates: stationsMap[reading.station_id],
        },
      }
    }),
  };
}

let um;
const sources = {
  rain: 'https://rain-geojson-sg.now.sh/now',
  rainfall: 'https://api.data.gov.sg/v1/environment/rainfall',
  temp: 'https://api.data.gov.sg/v1/environment/air-temperature',
  humid: 'https://api.data.gov.sg/v1/environment/relative-humidity',
  wind: 'https://api.data.gov.sg/v1/environment/wind-direction',
};

const showRain = () => {
  const newUM = uniqMinute();
  if (um === newUM) return;
  um = newUM;
  console.log('UM', um);

  const rainSource = map.getSource('rainsource');
  if (rainSource){
    rainSource.setData(sources.rain);
    fetch(sources.rainfall)
      .then(r => r.json())
      .then(data => {
        map.getSource('rainmm').setData(genReadingsGeoJSON(data));
      })
      .catch(_=>_);
  } else {
    map.addSource('rainsource', {
      type: 'geojson',
      data: sources.rain,
    });

    // 2D radar
    map.addLayer({
      id: 'rainlay',
      type: 'fill',
      source: 'rainsource',
      paint: {
        'fill-color': ['get', 'color'],
        'fill-antialias': false,
        // 'fill-outline-color': 'black',
        'fill-opacity': [
          'interpolate', ['linear'], ['zoom'],
          8, .9,
          14, ['*', ['/', ['get', 'intensity'], 100], .3]
        ],
      },
    }, labelLayerId);

    // 3D radar
    map.addLayer({
      id: 'rain3d',
      type: 'fill-extrusion',
      source: 'rainsource',
      layout: {
        visibility: 'none',
      },
      paint: {
        'fill-extrusion-color': ['get', 'color'],
        'fill-extrusion-opacity': [
          'interpolate', ['linear'], ['zoom'],
          8, .9,
          14, .1
        ],
        'fill-extrusion-height': ['*', 50, ['get', 'intensity']],
      },
    }, labelLayerId);

    // 3D clouds
    map.addLayer({
      id: 'rainclouds',
      type: 'fill-extrusion',
      source: 'rainsource',
      layout: {
        visibility: 'none',
      },
      paint: {
        'fill-extrusion-color': '#fff',
        'fill-extrusion-opacity': .8,
        'fill-extrusion-height': ['+', 5200, ['*', 5, ['get', 'intensity']]],
        'fill-extrusion-base': 5000,
      },
    });
    map.addLayer({
      id: 'raincloudshadows',
      type: 'fill',
      source: 'rainsource',
      layout: {
        visibility: 'none',
      },
      paint: {
        'fill-antialias': false,
        'fill-opacity': [
          'interpolate', ['linear'], ['zoom'],
          8, 1,
          14, ['/', ['get', 'intensity'], 100]
        ],
      },
    });

    let currentPitch = -1;
    map.on('pitchend', () => {
      const pitch = map.getPitch();
      if (pitch === currentPitch) return;
      currentPitch = pitch;
      if (cloudsMode) return;
      map.setLayoutProperty('rain3d', 'visibility', pitch > 0 ? 'visible' : 'none');
      map.setLayoutProperty('rainlay', 'visibility', pitch > 0 ? 'none' : 'visible');
    });

    fetch(sources.rainfall)
    .then(r => r.json())
    .then((rainfallData) => {
      map.addSource('rainmm', {
        type: 'geojson',
        data: genReadingsGeoJSON(rainfallData),
      });
      map.addLayer({
        id: 'rainreadings',
        type: 'symbol',
        source: 'rainmm',
        filter: ['!=', 'reading', 0],
        layout: {
          'text-field': '{reading}',
          'text-size': [
            'interpolate', ['linear'], ['zoom'],
            8, ['zoom'],
            14, ['*', 1.5, ['zoom']]
          ],
        },
        paint: {
          'text-color': 'aqua',
          'text-halo-color': '#000',
          'text-halo-width': 1,
        },
      }, 'rainclouds');
    });
  }
};

const showWeather = () => {
  const hasWeatherSource = map.getSource('temp');
  if (hasWeatherSource){
    Promise.all([
      fetch(sources.temp),
      fetch(sources.humid),
      fetch(sources.wind)
    ])
    .then((responses) => Promise.all(responses.map(r => r.json())))
    .then(([tempData, humidData, windData]) => {
      map.getSource('temp').setData(genReadingsGeoJSON(tempData));
      map.getSource('humid').setData(genReadingsGeoJSON(humidData));
      map.getSource('wind').setData(genReadingsGeoJSON(windData));
    })
    .catch(_=>_);
  } else {
    Promise.all([
      fetch(sources.temp),
      fetch(sources.humid),
      fetch(sources.wind)
    ])
    .then((responses) => Promise.all(responses.map(r => r.json())))
    .then(([tempData, humidData, windData]) => {
      map.addSource('temp', {
        type: 'geojson',
        data: genReadingsGeoJSON(tempData),
      });
      map.addLayer({
        id: 'tempreadings',
        type: 'symbol',
        source: 'temp',
        filter: ['!=', 'reading', 0],
        layout: {
          'text-field': '{reading}°',
          'text-allow-overlap': true,
          'text-size': [
            'interpolate', ['linear'], ['zoom'],
            8, ['zoom'],
            14, ['*', 1.5, ['zoom']]
          ],
          'text-padding': 1,
        },
        paint: {
          'text-color': 'yellow',
          'text-halo-color': '#000',
          'text-halo-width': 1,
        },
      }, 'rainclouds');

      map.addSource('humid', {
        type: 'geojson',
        data: genReadingsGeoJSON(humidData),
      });
      map.addLayer({
        id: 'humidreadings',
        type: 'symbol',
        source: 'humid',
        minzoom: 10,
        filter: ['!=', 'reading', 0],
        layout: {
          'text-field': '{reading}%',
          'text-size': [
            'interpolate', ['linear'], ['zoom'],
            8, ['zoom'],
            14, ['zoom']
          ],
          'text-offset': [0, -1],
          'text-padding': 0,
        },
        paint: {
          'text-color': 'orange',
          'text-halo-color': '#000',
          'text-halo-width': 1,
        },
      }, 'rainclouds');

      map.addSource('wind', {
        type: 'geojson',
        data: genReadingsGeoJSON(windData),
      });
      map.loadImage(arrowPath, (e, image) => {
        if (e) throw e;
        map.addImage('arrow', image, { sdf: true });
        map.addLayer({
          id: 'windirections',
          type: 'symbol',
          source: 'wind',
          layout: {
            'icon-image': 'arrow',
            'icon-rotate': ['get', 'reading'],
            'icon-allow-overlap': true,
            'icon-ignore-placement': true,
            'icon-pitch-alignment': 'map',
            'icon-rotation-alignment': 'map',
            'icon-size': [
              'interpolate', ['linear'], ['zoom'],
              8, .4,
              14, 3
            ],
          },
          paint: {
            'icon-color': '#fff',
            'icon-opacity': .2,
          },
        }, 'tempreadings');
      });
    })
    .catch(_=>_);
  }
};

const rafInterval = (fn, delay) => {
  let rafint;
  const start = () => requestAnimationFrame(() => {
    fn();
    fnTimeout();
  });
  const stop = () => clearTimeout(rafint);
  const fnTimeout = () => {
    stop();
    rafint = setTimeout(start, delay);
  }
  return {
    start,
    stop,
  };
};

let labelLayerId;
map.on('load', function(){
  const layers = map.getStyle().layers;
  // Find the index of the first symbol layer in the map style
  for (let i=0; i<layers.length; i++){
    if (layers[i].type === 'symbol' && layers[i].layout['text-field']){
      labelLayerId = layers[i].id;
      break;
    }
  }

  rafInterval(showRain, 2 * 60 * 1000).start(); // every 2 mins
  rafInterval(showWeather, 60 * 1000).start(); // every min
});

// https://stackoverflow.com/a/21829819/20838
// http://w3c.github.io/deviceorientation/spec-source-orientation.html#worked-example
const degtorad = Math.PI / 180; // Degree-to-Radian conversion
function compassHeading(alpha, beta, gamma){
  var _x = beta  ? beta  * degtorad : 0; // beta value
  var _y = gamma ? gamma * degtorad : 0; // gamma value
  var _z = alpha ? alpha * degtorad : 0; // alpha value

  var cX = Math.cos( _x );
  var cY = Math.cos( _y );
  var cZ = Math.cos( _z );
  var sX = Math.sin( _x );
  var sY = Math.sin( _y );
  var sZ = Math.sin( _z );

  // Calculate Vx and Vy components
  var Vx = - cZ * sY - sZ * sX * cY;
  var Vy = - sZ * sY + cZ * sX * cY;

  // Calculate compass heading
  var compassHeading = Math.atan( Vx / Vy );

  // Convert compass heading to use whole unit circle
  if( Vy < 0 ) {
    compassHeading += Math.PI;
  } else if( Vx < 0 ) {
    compassHeading += 2 * Math.PI;
  }

  return compassHeading * ( 180 / Math.PI ); // Compass Heading (in degrees)
}

const $windCompasss = document.getElementById('wind-compass');
if (window.DeviceOrientationEvent){
  // https://developers.google.com/web/updates/2016/03/device-orientation-changes
  // https://stackoverflow.com/a/47870694/20838
  var deviceorientation = 'ondeviceorientationabsolute' in window ? 'deviceorientationabsolute' : 'deviceorientation';
  window.addEventListener(deviceorientation, function(e){
    if (!e || e.alpha === null) return;
    const heading = e.compassHeading || e.webkitCompassHeading || compassHeading(e.alpha, e.beta, e.gamma);
    $windCompasss.classList.add('compassing');
    $windCompasss.style.transform = `rotate(${heading-180}deg)`;
  }, false);
}
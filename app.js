import { h, render } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import useInterval from 'react-use/lib/useInterval';
import useRafState from 'react-use/lib/useRafState';
import contours from 'd3-contour/src/contours';
import nanomemoize from 'nano-memoize';
import { featureCollection, point, polygon, round } from '@turf/helpers';

import firebase from 'firebase/app';
import 'firebase/firestore';

import arrowPath from 'url:./assets/arrow-down-white.png';
import iconSVGPath from 'url:./icons/icon-standalone.svg';

import chaikin from './utils/chaikin';

// const TESTING_MODE = location.hash === '#test-mode';
// const testSnapshot = require('./utils/testSnapshot').default;

// Initialize Firebase
firebase.initializeApp({
  projectId: 'check-weather-sg',
});
const db = firebase.firestore();

const width = 217,
  height = 120;
const center = [103.8475, 1.3011];
const lowerLat = 1.156,
  upperLat = 1.475,
  lowerLong = 103.565,
  upperLong = 104.13;
const distanceLong = Math.abs(upperLong - lowerLong);
const distanceLat = Math.abs(upperLat - lowerLat);

const bboxGeoJSON = polygon([
  [
    [-180, 90],
    [180, 90],
    [180, -90],
    [-180, -90],
    [-180, 90],
  ],
  [
    [lowerLong, upperLat],
    [upperLong, upperLat],
    [upperLong, lowerLat],
    [lowerLong, lowerLat],
    [lowerLong, upperLat],
  ],
]);

const intensityColors = [
  '#40FFFD',
  '#3BEEEC',
  '#32D0D2',
  '#2CB9BD',
  '#229698',
  '#1C827D',
  '#1B8742',
  '#229F44',
  '#27B240',
  '#2CC53B',
  '#30D43E',
  '#38EF46',
  '#3BFB49',
  '#59FA61',
  '#FEFB63',
  '#FDFA53',
  '#FDEB50',
  '#FDD74A',
  '#FCC344',
  '#FAB03F',
  '#FAA23D',
  '#FB8938',
  '#FB7133',
  '#F94C2D',
  '#F9282A',
  '#DD1423',
  '#BE0F1D',
  '#B21867',
  '#D028A6',
  '#F93DF5',
];
const intensityColorsCount = intensityColors.length;

const sgPolygon = {
  type: 'Polygon',
  coordinates: [
    [
      [103.56983184814452, 1.1984523335134731],
      [103.71986389160156, 1.1459349466540576],
      [104.13459777832031, 1.2763684180848154],
      [104.0789794921875, 1.3580576343735706],
      [104.09442901611328, 1.3913503559342686],
      [104.08344268798828, 1.4260154737416286],
      [104.04155731201172, 1.4462651532861726],
      [103.97151947021484, 1.4229265238497912],
      [103.9368438720703, 1.4304772829308758],
      [103.89667510986328, 1.4263586901405338],
      [103.86817932128906, 1.4555318956783565],
      [103.81153106689452, 1.4788701887242242],
      [103.75968933105469, 1.4469515799492016],
      [103.72535705566406, 1.4596504356431457],
      [103.67523193359375, 1.4308204986633148],
      [103.65943908691406, 1.4067952740787528],
      [103.61721038818358, 1.323391529857783],
      [103.56983184814452, 1.1984523335134731],
    ],
  ],
};

mapboxgl.accessToken =
  'pk.eyJ1IjoiY2hlZWF1biIsImEiOiJjam9weHp6MTUwZThvM3FwM3pjd2J1ZGU5In0.gW0WGZAbconHv5JYwSFI6w';
if (window.$map) window.$map.remove();

const bounds = [lowerLong, lowerLat, upperLong, upperLat];
const fitBoundsOptions = () => ({
  padding: window.innerWidth > 640 && window.innerHeight > 640 ? 120 : 0,
});
const maxZoom = 14;
const map = (window.$map = new mapboxgl.Map({
  container: 'map',
  center,
  // style: 'mapbox://styles/mapbox/dark-v10?optimize=true',
  style: 'mapbox://styles/cheeaun/ck7rpspsa2mwh1imt7s5ual7l',
  minZoom: 8,
  maxZoom,
  renderWorldCopies: false,
  boxZoom: false,
  pitchWithRotate: false,
  dragRotate: false,
  touchPitch: false,
  attributionControl: false,
  bounds,
  fitBoundsOptions: fitBoundsOptions(),
}));
map.touchZoomRotate.disableRotation();

// Controls
map.addControl(
  new mapboxgl.NavigationControl({
    showCompass: false,
  }),
  'top-right',
);
map.addControl(
  new mapboxgl.GeolocateControl({
    positionOptions: {
      enableHighAccuracy: true,
    },
    trackUserLocation: true,
  }),
  'top-right',
);

class SnapBoundaryControl {
  onAdd(map) {
    this._map = map;
    this._container = document.createElement('div');
    this._container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group';

    const button = document.createElement('button');
    button.type = 'button';
    button.title = 'Snap to boundary';
    button.innerHTML =
      '<svg height="100%" width="100%" viewBox="0 0 24 24" fill="#333"><path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm-7 7H3v4c0 1.1.9 2 2 2h4v-2H5v-4zM5 5h4V3H5c-1.1 0-2 .9-2 2v4h2V5zm14-2h-4v2h4v4h2V5c0-1.1-.9-2-2-2zm0 16h-4v2h4c1.1 0 2-.9 2-2v-4h-2v4z"/></svg>';
    button.onclick = (e) => {
      e.preventDefault();
      this._container.hidden = true;
      map.fitBounds(bounds, fitBoundsOptions(), { snap: true });
    };
    this._container.appendChild(button);

    this._container.hidden = true;
    map.on('moveend', (e) => {
      if (e.snap) return;
      this._container.hidden = false;
    });

    return this._container;
  }
  onRemove() {
    this._container.parentNode.removeChild(this._container);
    this._map = undefined;
  }
}
map.addControl(new SnapBoundaryControl(), 'top-right');

const $loader = document.getElementById('loader');
map.on('dataloading', (e) => {
  $loader.hidden = false;
});
let dataDone = null;
map.on('data', (e) => {
  clearTimeout(dataDone);
  dataDone = setTimeout(() => {
    $loader.hidden = true;
  }, 500);
});

const $legend = document.getElementById('legend');
const $infoButton = document.getElementById('info-button');
const $legendClose = document.getElementById('legend-close');
$infoButton.onclick = (e) => {
  e.preventDefault();
  $legend.hidden = !$legend.hidden;
};
$legendClose.onclick = (e) => {
  e.preventDefault();
  $legend.hidden = true;
};

const convertRainID2Time = nanomemoize((id) => {
  const time = (id.match(/\d{4}$/) || [''])[0].replace(
    /(\d{2})(\d{2})/,
    (m, m1, m2) => {
      let h = parseInt(m1, 10);
      const ampm = h >= 12 ? 'PM' : 'AM';
      if (h == 0) h = 12;
      if (h > 12) h -= 12;
      return h + ':' + m2 + ' ' + ampm;
    },
  );
  return time;
});

const convertX2Lng = nanomemoize((x) =>
  round(lowerLong + (x / width) * distanceLong, 4),
);
const convertY2Lat = nanomemoize((y) =>
  round(upperLat - (y / height) * distanceLat, 4),
);

const zerosArray = new Array(width * height).fill(0);
const convertRadar2Values = nanomemoize(
  (id, radar) => {
    const rows = radar.trimEnd().split(/\n/g);
    const values = zerosArray.slice();
    for (let y = 0, l = rows.length; y < l; y++) {
      const chars = rows[y];
      for (let x = chars.search(/[^\s]/), rl = chars.length; x < rl; x++) {
        const char = chars[x];
        if (char && char !== ' ') {
          const intensity = char.charCodeAt() - 33;
          values[y * width + x] = intensity;
        }
      }
    }
    return values;
  },
  {
    maxArgs: 1,
  },
);

// console.log({ intensityColors });
const contour = contours()
  .size([width, height])
  // .thresholds(
  //   intensityColors.map((_, i) => Math.ceil((i / intensityColorsCount) * 100)),
  //   // .filter((_, i) => i % 2 !== 0),
  // )
  .thresholds([4, 10, 20, 30, 40, 50, 60, 70, 80, 85, 90, 95, 97.5])
  .smooth(false);
const convertValues2GeoJSON = nanomemoize(
  (id, values) => {
    const results = [];
    const conValues = contour(values);
    for (let i = 0, l = conValues.length; i < l; i++) {
      const { type, value, coordinates } = conValues[i];
      if (coordinates.length) {
        results.push({
          type: 'Feature',
          properties: { intensity: value, id },
          geometry: {
            type,
            coordinates: coordinates.map((c1) =>
              c1.map((c2) => {
                c2.pop(); // Remove last coord
                return chaikin(c2).map(([x, y]) => [
                  convertX2Lng(x),
                  convertY2Lat(y),
                ]);
              }),
            ),
          },
        });
      }
    }
    return results;
  },
  {
    maxArgs: 1,
  },
);

const genMidValues = nanomemoize(
  (id, values1, values2) => {
    const midValues = [];
    for (let i = 0, l = values1.length; i < l; i++) {
      midValues[i] = (values1[i] + values2[i]) / 2;
    }
    return midValues;
  },
  {
    maxArgs: 1,
  },
);

const showObservations = () => {
  fetch('https://api.checkweather.sg/v2/observations')
    .then((res) => res.json())
    .then((data) => {
      // console.log('observations', data);
      const points = data.map((d) => {
        const { id, lng, lat, ...props } = d;
        return point([lng, lat], props, { id });
      });
      const pointsCollection = featureCollection(points);
      map.getSource('observations').setData(pointsCollection);
    });
};

const rafInterval = (fn, delay, immediate = false) => {
  if (immediate) fn();
  setTimeout(requestAnimationFrame, delay, () => {
    fn();
    rafInterval(fn, delay);
  });
};

const ClipPathSparkline = ({
  values = [],
  maxValue = null,
  smoothIterations = 1,
  style = {},
  ...props
}) => {
  if (!values.length) return null;
  const total = values.length - 1;
  const max = maxValue || Math.max(...values);
  let path = '';
  chaikin(
    values.map((v, i) => {
      const x = Math.round((i / total) * 100);
      const y = Math.round((v / max) * 100);
      return [x, y];
    }),
    smoothIterations,
    false,
  ).forEach((p, i) => {
    if (i > 0) path += ',';
    path += `${p[0]}% ${100 - p[1]}%`;
  });
  return (
    <div
      {...props}
      style={{
        ...style,
        clipPath: `polygon(0 100%, ${path}, 100% 100%)`,
      }}
    />
  );
};

const testRadar = () => {
  let test = '';
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      const intensity = ~~Math.round((j / width) * 100);
      const c = String.fromCharCode(intensity + 33);
      test += c;
    }
    test += '\n';
  }
  return test;
};

function debounce(fn, wait = 1) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.call(this, ...args), wait);
  };
}

const styleDataLoaded = new Promise((res) => {
  map.once('styledata', res);
});

const RAINAREA_COUNT = 25;
const weatherDB = db
  .collection('weather')
  .orderBy('id', 'desc')
  .limit(RAINAREA_COUNT);

let firstLoad = true;
let memorySaverMode = false;
const Player = () => {
  const [loading, setLoading] = useState(false);
  const [index, setIndex] = useRafState(null);
  const [snapshots, setSnapshots] = useRafState([]);
  const [playing, setPlaying] = useState(false);
  const [fwd, setFwd] = useState(false);
  const [docHidden, setDocHidden] = useState(document.hidden);

  useEffect(() => {
    document.addEventListener(
      'visibilitychange',
      () => {
        setDocHidden(document.hidden);
      },
      false,
    );
  }, []);

  const debouncedOnSnapshot = debounce((s) => {
    // if (TESTING_MODE) s = testSnapshot();
    if (firstLoad) console.timeEnd('Fetch Snapshots');
    setLoading(false);

    memorySaverMode = s.docs.every(
      (d) => d.data().coverage_percentage.all > 90,
    );

    const processSnapshots = () => {
      console.time('Process Snapshots');
      const shots = [];
      const geoJSONList = [];

      const docs = s.docs.reverse();
      docs.forEach((doc, i) => {
        const rainarea = doc.data();
        const values = convertRadar2Values(rainarea.id, rainarea.radar);
        const geojsons = convertValues2GeoJSON(rainarea.id, values);
        geoJSONList.push(...geojsons);

        const nextDoc = docs[i + 1];
        if (nextDoc && !memorySaverMode) {
          const nextRainArea = nextDoc.data();
          const nextValues = convertRadar2Values(
            nextRainArea.id,
            nextRainArea.radar,
          );
          const midID = `${
            (Number(rainarea.id) + Number(nextRainArea.id)) / 2
          }`;
          const midValues = genMidValues(midID, values, nextValues);
          const nextGeojsons = convertValues2GeoJSON(midID, midValues);
          geoJSONList.push(...nextGeojsons);
        }

        shots.push(rainarea);
      });

      const collection = featureCollection(geoJSONList);
      styleDataLoaded.then(() => {
        if (!map.getFilter('rainradar')) {
          map.setFilter('rainradar', ['==', 'id', s.docs[0].data().id], {
            validate: false,
          });
        }
        map.getSource('rainradar').setData(collection);
        if (!index) setIndex(shots.length);
        setSnapshots(shots);
      });
      console.timeEnd('Process Snapshots');
    };

    if (firstLoad) {
      const firstDoc = s.docs[0].data();
      // const radar = testRadar();
      const values = convertRadar2Values(firstDoc.id, firstDoc.radar);
      const geojsons = convertValues2GeoJSON(firstDoc.id, values);
      styleDataLoaded.then(() => {
        map.getSource('rainradar').setData(featureCollection(geojsons));
        firstLoad = false;
        map.once('idle', () => requestAnimationFrame(processSnapshots));
      });
    } else {
      processSnapshots();
    }
  }, 300);

  useEffect(() => {
    let unsub = () => {};
    if (docHidden) {
      setPlaying(false);
      firstLoad = false;
    } else {
      console.log('Start Snapshots');
      console.time('Fetch Snapshots');
      setLoading(true);
      unsub = weatherDB.onSnapshot(debouncedOnSnapshot);
    }
    return () => unsub();
  }, [docHidden]);

  const snapshotsCount = snapshots.length;
  if (snapshotsCount <= 1) return null;

  useEffect(() => {
    if (index && snapshotsCount) {
      const roundIndex = Math.round(index);
      const floatIndex = Math.round(index / 0.5) * 0.5;

      const shot = snapshots[roundIndex - 1];
      let id = shot.id;

      if (floatIndex !== roundIndex && !memorySaverMode) {
        const floorSnapshot = snapshots[Math.floor(floatIndex) - 1];
        const ceilSnapshot = snapshots[Math.ceil(floatIndex) - 1];
        if (floorSnapshot && ceilSnapshot) {
          const midID = `${(floorSnapshot.dt + ceilSnapshot.dt) / 2}`;
          id = midID;
        }
      }

      setFwd(false);
      map.setFilter('rainradar', ['==', 'id', id], {
        validate: false,
      });

      const faded = index < snapshotsCount - 1;
      map.setPaintProperty('tempreadings', 'text-opacity', faded ? 0.3 : 1);
      map.setPaintProperty('humidreadings', 'text-opacity', faded ? 0.3 : 1);
      map.setPaintProperty('rainreadings', 'text-opacity', faded ? 0.3 : 1);
      map.setPaintProperty('windirections', 'icon-opacity', faded ? 0.1 : 0.3);
    }
  }, [index, snapshots]);

  useEffect(() => {
    if (index < snapshotsCount && !playing) {
      setFwd(true);
    }
  }, [snapshots]);

  const { id } = snapshots[Math.round(index) - 1];
  const sgCoveragePercentages = snapshots.map((s) => s.coverage_percentage.sg);
  const maxSGCoveragePercentage = Math.max(...sgCoveragePercentages);

  useInterval(
    () => {
      const endOfSnapshots = index >= snapshotsCount;
      if (endOfSnapshots && maxSGCoveragePercentage < 5) {
        setPlaying(false);
      } else {
        setIndex(endOfSnapshots ? 1 : index + 0.5);
      }
    },
    playing ? (index === snapshotsCount ? 2000 : 100) : null,
  );

  const indexPercentage = ((index - 1) / (snapshotsCount - 1)) * 100;
  const sparklineHeight = Math.max((maxSGCoveragePercentage / 100) * 40, 30);
  const playIconSize = Math.max((maxSGCoveragePercentage / 100) * 24, 16);

  return (
    <div id="player-content" class={loading ? 'loading' : ''}>
      <div
        id="player-button"
        class={playing ? 'playing' : ''}
        onClick={() => {
          if (fwd) {
            setIndex(snapshotsCount);
            return;
          }
          if (index === snapshotsCount && !playing) setIndex(1);
          setPlaying(!playing);
        }}
      >
        <div id="player-icon">
          <svg width={playIconSize} height={playIconSize} viewBox="0 0 24 24">
            <path
              d={
                fwd
                  ? 'M4 18l8.5-6L4 6v12zm9-12v12l8.5-6L13 6z'
                  : playing
                  ? 'M6 19h4V5H6v14zm8-14v14h4V5h-4z'
                  : 'M8 5v14l11-7z'
              }
            />
          </svg>
        </div>
      </div>
      <div id="player-range">
        <div
          id="player-time"
          class={index === snapshotsCount ? 'now' : ''}
          style={{
            left: `${indexPercentage}%`,
            transform: `translateX(-${indexPercentage}%)`,
          }}
        >
          {convertRainID2Time(id)}
        </div>
        <ClipPathSparkline
          values={sgCoveragePercentages}
          maxValue={100}
          smoothIterations={2}
          style={{ height: sparklineHeight }}
          id="player-sparkline"
        />
        <progress value={index} max={snapshotsCount} />
        <div id="player-labels">
          <span>{convertRainID2Time(snapshots[0].id)}</span>
          <span>
            {convertRainID2Time(
              snapshots[Math.round(snapshotsCount / 2) - 1].id,
            )}
          </span>
          <span>{convertRainID2Time(snapshots[snapshotsCount - 1].id)}</span>
        </div>
        <input
          type="range"
          min="1"
          max={snapshotsCount}
          step="any"
          value={index}
          onInput={(e) => {
            setPlaying(false);
            setIndex(e.target.value);
          }}
          onMouseUp={() => setIndex(Math.round(index))}
          onTouchEnd={(e) => {
            setIndex(Math.round(index));
            const touch = e.changedTouches[0];
            if (touch) {
              const { width, x } = touch.target.getBoundingClientRect();
              const padding = 8;
              const actualWidth = width - padding * 2;
              const index =
                ((touch.clientX - padding - x) / actualWidth) *
                  (snapshotsCount - 1) +
                1;
              setIndex(
                Math.max(1, Math.min(snapshotsCount, Math.round(index))),
              );
            }
          }}
          onTouchCancel={() => setIndex(Math.round(index))}
        />
      </div>
    </div>
  );
};
render(<Player />, document.getElementById('player'));

(async () => {
  await styleDataLoaded;

  // Add sources
  map.addSource('observations', {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: [],
    },
    tolerance: 5,
    buffer: 0,
    maxzoom: maxZoom,
  });
  map.addSource('rainradar', {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: [],
    },
    maxzoom: maxZoom,
    // tolerance: 0.5,
    // buffer: screen.width > 1280 ? 128 : 0,
  });

  const layers = map.getStyle().layers;
  // console.log({ layers });

  let labelLayerId;
  for (let i = 0; i < layers.length; i++) {
    const { id, type, layout } = layers[i];
    if (type === 'symbol' && layout['text-field']) {
      // Find the index of the first symbol layer in the map style
      if (!labelLayerId) {
        labelLayerId = layers[i].id;
      }
    }

    // Fade out all other labels
    if (type === 'symbol') {
      const textOpacity = map.getPaintProperty(id, 'text-opacity');
      map.setPaintProperty(id, 'text-opacity', [
        'case',
        ['within', sgPolygon],
        textOpacity || 1,
        0,
      ]);
      const iconOpacity = map.getPaintProperty(id, 'icon-opacity');
      if (typeof iconOpacity === 'number') {
        map.setPaintProperty(id, 'icon-opacity', [
          'case',
          ['within', sgPolygon],
          iconOpacity || 1,
          0,
        ]);
      }
    }
  }

  const radarColors = intensityColors.reduce((acc, color, i) => {
    const intensity = ((i + 1) / intensityColorsCount) * 100;
    acc.push(intensity, color);
    return acc;
  }, []);
  const radarFillColor = [
    'interpolate-lab',
    ['linear'],
    ['number', ['get', 'intensity'], 0],
    0,
    'transparent',
    ...radarColors,
  ];

  map.addLayer(
    {
      id: 'rainradar',
      type: 'fill',
      source: 'rainradar',
      layout: {
        'fill-sort-key': ['number', ['get', 'intensity'], 0],
      },
      paint: {
        'fill-antialias': false,
        'fill-color': radarFillColor,
        'fill-opacity': [
          'interpolate',
          ['linear'],
          ['zoom'],
          8,
          ['case', ['>', ['number', ['get', 'intensity'], 0], 90], 1, 0.4],
          12,
          0.05,
        ],
      },
    },
    'water-overlay',
  );

  map.addLayer({
    id: 'tempreadings',
    type: 'symbol',
    source: 'observations',
    minzoom: 8.5,
    filter: ['all', ['has', 'temp_celcius'], ['>', 'temp_celcius', 0]],
    layout: {
      'text-field': '{temp_celcius}°',
      'text-allow-overlap': true,
      'text-ignore-placement': true,
      'text-size': ['interpolate', ['linear'], ['zoom'], 8, 10, 14, 28],
      'text-padding': 1,
    },
    paint: {
      'text-color': 'yellow',
      'text-halo-color': '#000',
      'text-halo-width': 1.5,
    },
  });

  map.loadImage(arrowPath, (e, image) => {
    map.addImage('arrow', image);
  });
  map.addLayer(
    {
      id: 'windirections',
      type: 'symbol',
      source: 'observations',
      filter: ['has', 'wind_direction'],
      layout: {
        'icon-image': 'arrow',
        'icon-rotate': ['get', 'wind_direction'],
        'icon-allow-overlap': true,
        'icon-ignore-placement': true,
        'icon-size': ['interpolate', ['linear'], ['zoom'], 8, 0.05, 14, 0.6],
      },
      paint: {
        'icon-opacity': 0.3,
      },
    },
    'tempreadings',
  );

  map.addLayer({
    id: 'humidreadings',
    type: 'symbol',
    source: 'observations',
    minzoom: 10,
    filter: [
      'all',
      ['has', 'relative_humidity'],
      ['>', 'relative_humidity', 0],
    ],
    layout: {
      'text-field': '{relative_humidity}%',
      'text-ignore-placement': true,
      'text-size': ['interpolate', ['linear'], ['zoom'], 8, 8, 14, 14 * 1.1],
      'text-offset': [0, -1.2],
      'text-padding': 0,
    },
    paint: {
      'text-color': 'orange',
      'text-halo-color': '#000',
      'text-halo-width': 1.5,
    },
  });

  map.addLayer({
    id: 'rainreadings',
    type: 'symbol',
    source: 'observations',
    minzoom: 12,
    filter: ['all', ['has', 'rain_mm'], ['>', 'rain_mm', 0]],
    layout: {
      'text-field': '{rain_mm}mm',
      'text-size': ['interpolate', ['linear'], ['zoom'], 8, 8, 14, 14 * 1.1],
      'text-ignore-placement': true,
      'text-offset': [0, 1.2],
      'text-padding': 0,
    },
    paint: {
      'text-color': 'aqua',
      'text-halo-color': '#000',
      'text-halo-width': 1.5,
    },
  });

  rafInterval(showObservations, 2 * 60 * 1000, true); // every 2 mins

  // Mask the area outside Singapore
  map.addLayer(
    {
      id: 'bbox',
      type: 'fill',
      source: {
        type: 'geojson',
        tolerance: 10,
        buffer: 0,
        data: bboxGeoJSON,
        maxzoom: maxZoom,
      },
      paint: {
        'fill-color': 'rgba(0,0,0,.5)',
        'fill-antialias': false,
      },
    },
    labelLayerId,
  );
})();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('./sw.js');
  });
}

const isSafari = navigator.vendor && navigator.vendor.indexOf('Apple') !== -1;
if (isSafari) {
  setTimeout(function () {
    const ratio = window.devicePixelRatio;
    const canvas = document.createElement('canvas');
    const w = (canvas.width = window.screen.width * ratio);
    const h = (canvas.height = window.screen.height * ratio);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#343332';
    ctx.fillRect(0, 0, w, h);
    const icon = new Image();
    icon.onload = () => {
      const aspectRatio = icon.width / icon.height;
      icon.width = w / 2;
      icon.height = w / 2 / aspectRatio;
      ctx.drawImage(
        icon,
        (w - icon.width) / 2,
        (h - icon.height) / 2,
        icon.width,
        icon.height,
      );
      document.head.insertAdjacentHTML(
        'beforeend',
        `<link rel="apple-touch-startup-image" href="${canvas.toDataURL()}">`,
      );
    };
    icon.src = iconSVGPath;
  }, 5000);
}

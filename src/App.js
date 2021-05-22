import { useEffect, useState } from 'react';
import './App.css';
import ReactMapGL, { Source, Layer, Marker } from 'react-map-gl';
import ISSLogo from './iss.png';
import { Label, Icon } from 'semantic-ui-react';
function App() {
  const [issLocation, setIssLocation] = useState({
    latitude: 0,
    longitude: 0,
    altitude: 0,
    visibility: 0,
  });
  const [viewport, setViewport] = useState({
    width: '100vw',
    height: '100vh',
    zoom: 1,
  });
  const geojson = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [-122.4, 37.8] },
      },
    ],
  };

  const layerStyle = {
    id: 'point',
    type: 'circle',
    paint: {
      'circle-radius': 10,
      'circle-color': '#007cbf',
    },
  };
  useEffect(() => {
    setInterval(() => {
      fetchISS();
    }, 5000);
  }, []);

  const fetchISS = async () => {
    await fetch('https://api.wheretheiss.at/v1/satellites/25544')
      .then((response) => response.json())
      .then((data) => {
        setIssLocation({
          longitude: data.longitude,
          latitude: data.latitude,
          altitude: data.altitude,
          visibility: data.visibility,
        });
      })
      .catch((error) => {
        setIssLocation({
          longitude: 1,
          latitude: 1,
          altitude: 1,
          visibility: 'Daylight',
        });
      });
  };
  console.log('STATE:', issLocation);
  return (
    <div className='App'>
      <div
        className='all_label'
        style={{
          position: 'fixed',
          top: '1px',
          zIndex: 999999,
          display: 'flex',
          flexDirection: 'column',
          marginLeft: '10px',
        }}
      >
        <Label as='a' color='blue' image>
          <Icon name='marker' />
          Longitude
          <Label.Detail>{issLocation.longitude.toFixed(2)}</Label.Detail>
        </Label>
        <Label as='a' color='blue' image>
          <Icon name='marker' />
          Latitude
          <Label.Detail>{issLocation.latitude.toFixed(2)}</Label.Detail>
        </Label>
        <Label as='a' color='blue' image>
          <Icon name='marker' />
          Altitude
          <Label.Detail>{issLocation.altitude.toFixed(2)}</Label.Detail>
        </Label>
        <Label as='a' color='blue' image>
          <Icon name='marker' />
          Visibility
          <Label.Detail>{issLocation.visibility}</Label.Detail>
        </Label>
      </div>

      <ReactMapGL
        mapboxApiAccessToken='pk.eyJ1IjoiamlhaHVpODE2IiwiYSI6ImNrbHlyaHB6MTFvdzYzMHM1NnY0eXR3a3IifQ.CIy8poI4_Vk4Fu_jwgqOaQ'
        type='geojson'
        data={geojson}
        {...viewport}
        onViewportChange={(nextViewport) => setViewport(nextViewport)}
      >
        <Marker
          latitude={issLocation.latitude}
          longitude={issLocation.longitude}
        >
          <img
            style={{ width: '100px', height: '100px', objectFit: 'contain' }}
            src={ISSLogo}
            alt=''
          />
        </Marker>
      </ReactMapGL>
    </div>
  );
}

export default App;

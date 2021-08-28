import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Store } from '../utils/Store';
import useStyles from '../utils/styles';
import { useSnackbar } from 'notistack';
import { getError } from '../utils/error';
import axios from 'axios';
import {
  GoogleMap,
  LoadScript,
  Marker,
  StandaloneSearchBox,
} from '@react-google-maps/api';
import { CircularProgress } from '@material-ui/core';

const defaultLocation = { lat: 45.516, lng: -73.56 };
const libs = ['places'];

const Map = () => {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const [googleApiKey, setGoogleApikey] = useState('');
  const [location, setLocation] = useState(defaultLocation);
  const [center, setCenter] = useState(center);

  useEffect(() => {
    const fetchGoogleApiKey = async () => {
      try {
        const { data } = await axios.get('/api/keys/google', {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        });
        setGoogleApikey(data);
        getUserCurrentLocation();
      } catch (error) {
        enqueueSnackbar(getError(error), { variant: 'error' });
      }
    };
    fetchGoogleApiKey();
  }, [userInfo.token, getUserCurrentLocation, enqueueSnackbar]);
  const getUserCurrentLocation = () => {
    if (!navigator.geolocation) {
      enqueueSnackbar('Geolocation is not supported by this browser', {
        variant: 'error',
      });
    } else {
      navigator.geolocation.getCurrentPosition((position) => {
        setCenter({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      });
    }
  };
  const mapRef = useRef(null);
  const placeRef = useRef(null);
  const markerRef = useRef(null);

  const onLoad = (map) => {
    mapRef.current = map;
  };
  const onIdle = () => {
    setLocation({
      lat: mapRef.current.center.lat(),
      lng: mapRef.current.center.lng(),
    });
  };
  const onLoadPlaces = (place) => {
    placeRef.current = place;
  };
  const onPlacesChanged = () => {
    const place = placeRef.current.getPlaces()[0].geometry.location;
    setCenter({ lat: place.lat(), lng: place.lng() });
    setLocation({ lat: place.lat(), lng: place.lng() });
  };
  const onConfirm = () => {
    const places = placeRef.current.getPlaces();
    if (places && places.length === 1) {
      dispatch({
        type: 'SAVE_SHIPPING_ADDRESS_LOCATION',
        payload: {
          lat: location.lat,
          lng: location.lng,
          address: places[0].formatted_address,
          name: places[0].name,
          vicinity: places[0].vicinity,
          googleAddressId: places[0].id,
        },
      });
      enqueueSnackbar('Loaction selected succesfully', { variant: 'success' });
      router.push('/shipping');
    }
  };
  const onMarkerLoad = (marker) => {
    markerRef.current = marker;
  };
  return googleApiKey ? (
    <div className={classes.fullContainer}>
      <LoadScript libraries={libs} googleMapsApiKey={googleApiKey}>
        <GoogleMap
          id="sample-map"
          mapContainerStyle={{ height: '100%', width: '100%' }}
          center={center}
          zoom={15}
          onLoad={onLoad}
          onIdle={onIdle}
        >
          <StandaloneSearchBox
            onLoad={onLoadPlaces}
            onPlacesChanged={onPlacesChanged}
          >
            <div className={classes.mapInputBox}>
              <input type="text" placeholder="Enter your address"></input>
              <button type="button" className="primary" onClick={onConfirm}>
                Confirm
              </button>
            </div>
          </StandaloneSearchBox>
          <Marker position={location} onLoad={onMarkerLoad} />
        </GoogleMap>
      </LoadScript>
    </div>
  ) : (
    <CircularProgress />
  );
};

export default dynamic(() => Promise.resolve(Map), { ssr: false });

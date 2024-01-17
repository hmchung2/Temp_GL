import React, {useEffect, useState} from 'react';
import MapboxGL from '@react-native-mapbox-gl/maps';
import {useQuery, useSubscription, gql} from '@apollo/client';
import Geolocation from '@react-native-community/geolocation';
import {View} from 'react-native';

MapboxGL.setAccessToken('YOUR_MAPBOX_ACCESS_TOKEN');

const LiveMap = () => {
  const [coordinates, setCoordinates] = useState([0, 0]);

  // const {data, loading, error} = useSubscription(LOCATION_SUBSCRIPTION);

  useEffect(() => {
    Geolocation.getCurrentPosition(
      position => {
        const {longitude, latitude} = position.coords;
        setCoordinates([longitude, latitude]);
      },
      error => console.log(error.message),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );
  }, []);

  // useEffect(() => {
  //   if (data?.locationUpdated) {
  //     const {longitude, latitude} = data.locationUpdated;
  //     setCoordinates([longitude, latitude]);
  //   }
  // }, [data]);

  return (
    <View style={{flex: 1}}>
      <MapboxGL.MapView style={{flex: 1}}>
        <MapboxGL.Camera
          zoomLevel={14}
          centerCoordinate={coordinates}
          animationMode={'flyTo'}
          animationDuration={4000}
        />
        <MapboxGL.PointAnnotation
          id="currentLocation"
          coordinate={coordinates}
        />
      </MapboxGL.MapView>
    </View>
  );
};

export default LiveMap;

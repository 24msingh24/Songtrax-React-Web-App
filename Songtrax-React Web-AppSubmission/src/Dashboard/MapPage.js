/**
 * MapPage component
 */

import React, { useEffect, useState } from 'react';
import { View, Text, useColorScheme, ActivityIndicator, StyleSheet } from 'react-native';
import MapView, { Circle, PROVIDER_GOOGLE } from 'react-native-maps';
import colors, { darkTheme, lightTheme, mapCustomStyle } from '../styless';
import * as Location from 'expo-location';
import axios from 'axios';

/**
 * The base URL for API requests.
 */
const BASE_URL = 'https://comp2140.uqcloud.net/api/';

/**
 * The API key for accessing data.
 */
const API_KEY = 'IZZgpTrtQR';

/**
 * The MapPage component.
 * @param {object} props - The component's props.
 * @param {function} props.onNearbyStateChange - Function to handle nearby state changes.
 * @param {function} props.onSendSampleId - Function to send sample IDs.
 * @param {function} props.onNameOfLocation - Function to send the name of the location.
 */
const MapPage = ({ onNearbyStateChange, onSendSampleId, onNameOfLocation }) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [apiData, setApiData] = useState([]);
  const [mapRegion, setMapRegion] = useState(null);
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'light' ? lightTheme : darkTheme;
  const mapViewRef = React.useRef(null);

  const requestLocationPermission = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMessage('Permission denied');
      return;
    }
  
    let location = await Location.getCurrentPositionAsync({});
    setMapRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
    setCurrentLocation(location);
  };
  
  const fetchData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/location/?api_key=${API_KEY}`);
  
      if (response.status === 200) {
        const data = await response.data;
        setApiData(data);
      } else {
        setErrorMessage('Failed to fetch data');
      }
    } catch (e) {
      setErrorMessage('Error');
    }
  };
  
  useEffect(() => {
    requestLocationPermission();
  }, []);
  
  useEffect(() => {
    fetchData();
  }, []);
  
  useEffect(() => {
    if (currentLocation && apiData.length > 0) {
      checkCircles();
    }
  }, [currentLocation, apiData]);
  

  /**
   * Handles retrieving sample IDs for a location.
   * @param {number} locationId - The ID of the location.
   */
  const handleLocationId = async (locationId) => {
    try {
      const response = await axios.get(`${BASE_URL}/sampletolocation/?api_key=${API_KEY}`);
  
      if (response.status === 200) {
        const data = response.data;
        const filteredData = [];
  
        for (let i = 0; i < data.length; i++) {
          if (data[i].location_id === locationId) {
            filteredData.push(data[i]);
          }
        }
  
        const sampleIds = filteredData.map((item) => item?.sample_id);
        onSendSampleId(sampleIds);
      } else {
        setErrorMessage('Failed to fetch data');
      }
    } catch (e) {
      console.log(e);
      setErrorMessage('Error');
    }
  };
  

  /**
   * Checks for  circles on the map.
   */
  function haversineDistance(coord1, coord2) {
    // Convert degrees to radians
    const toRadians = (degrees) => (degrees * Math.PI) / 180;
    const radius = 6371; // Earth's radius in kilometers
  
    const lat1 = toRadians(coord1.latitude);
    const lon1 = toRadians(coord1.longitude);
    const lat2 = toRadians(coord2.latitude);
    const lon2 = toRadians(coord2.longitude);
  
    const dLat = lat2 - lat1;
    const dLon = lon2 - lon1;
  
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = radius * c;
  
    return distance * 1000; // Convert to meters
  }
  
  function findNearbyLocation(userLocation, locations, maxDistance) {
    return locations.find((location) => {
      const distance = haversineDistance(userLocation.coords, {
        latitude: parseFloat(location.latitude),
        longitude: parseFloat(location.longitude),
      });
  
      return distance <= maxDistance;
    });
  }
  
  function checkCircles() {
    if (currentLocation) {
      const radius = 100; // 100 meters
      const nearbyLocation = findNearbyLocation(currentLocation, apiData, radius);
  
      if (nearbyLocation) {
        onNameOfLocation(nearbyLocation.name);
        handleLocationId(nearbyLocation.id);
        onNearbyStateChange(true);
      } else {
        onNearbyStateChange(false);
      }
    }
  }
  

  return (
    <View
      style={[
        stylesMapPage.container,
        {
          backgroundColor: theme.bgColor,
        },
      ]}
    >
      {errorMessage ? (
        <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
          <Text>{errorMessage}</Text>
        </View>
      ) : !currentLocation || apiData.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="small" color={colors.purpleColorLighter} />
        </View>
      ) : (
        <MapView
          ref={mapViewRef}
          initialRegion={mapRegion}
          customMapStyle={colorScheme === 'light' ? [] : mapCustomStyle}
          provider={PROVIDER_GOOGLE}
          style={{ flex: 1 }}
          showsUserLocation={true}
          showsMyLocationButton={true}
        >
          {apiData.map((coord, index) => (
            <Circle
              key={index}
              center={{
                latitude: parseFloat(coord.latitude),
                longitude: parseFloat(coord.longitude),
              }}
              radius={100}
              fillColor={theme.lightPink}
              strokeColor={theme.fgColor}
            />
          ))}
        </MapView>
      )}
    </View>
  );
};

// Styles for MapPage
const stylesMapPage = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.whiteColor,
  },
});

export default MapPage;

/**
 * HomePage component
 */
import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import colors from '../styless';
import { moderateScale, scale } from '../dimensionsflexible';
import imagePath from '../SourcePic';
import MapPage from './MapPage';
import NearbyPage from './SidePage';
import ProfilePage from './PicturePage';
/**
 * The main HomePage component.
 */
const HomePage = () => {
  // State variables
  const [customNearbyActive, setCustomNearbyActive] = useState(false);
  const [customMapActive, setCustomMapActive] = useState(true);
  const [customSampleData, setCustomSampleData] = useState([]);
  const [customNearbyState, setCustomNearbyState] = useState(false);
  const [customProfileActive, setCustomProfileActive] = useState(false);
  const [customLocationName, setCustomLocationName] = useState('');

  /**
   * Handles setting the custom sample data.
   * @param {Array} sampleId - The custom sample data to set.
   */
  const handleCustomSampleId = (sampleId) => {
    setCustomSampleData(sampleId);
  };

  /**
   * Handles setting the custom location name.
   * @param {string} locationName - The location name to set.
   */
  const handleCustomLocationName = (locationName) => {
    setCustomLocationName(locationName);
  };

  /**
   * Handles changing the custom nearby state.
   * @param {boolean} newState - The new state to set.
   */
  const handleCustomNearbyStateChange = (newState) => {
    setCustomNearbyState(newState);
  };

  return (
    <View style={customStyles.container}>
      {customMapActive ? (
        <MapPage
          onNameOfLocation={handleCustomLocationName}
          onSendSampleId={handleCustomSampleId}
          onNearbyStateChange={handleCustomNearbyStateChange}
        />
      ) : customNearbyActive ? (
        <NearbyPage
          sampleId={customSampleData}
          locationName={customLocationName}
        />
      ) : (
        <ProfilePage />
      )}
      <View style={customStyles.tabBar}>
        <LinearGradient
          colors={[colors.purpleLight, colors.darkerBlue]}
          style={{
            flex: 1,
            height: moderateScale(80),
            paddingHorizontal: scale(40),
            justifyContent: 'space-between',
            flexDirection: 'row',
            alignItems: 'center',
          }}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        >
          <TouchableOpacity
            onPress={() => {
              setCustomMapActive(true);
              setCustomNearbyActive(false);
              setCustomProfileActive(false);
            }}
            style={[
              customStyles.iconBg,
              {
                backgroundColor: customMapActive
                  ? colors.transparentBlack
                  : 'transparent',
              },
            ]}
          >
            <Image
              source={imagePath.tabmapdarkpurple}
              style={customStyles.icon}
              tintColor={colors.customWhite}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setCustomMapActive(false);
              setCustomNearbyActive(true);
              setCustomProfileActive(false);
            }}
            style={[
              customStyles.iconBg,
              {
                backgroundColor: customNearbyActive
                  ? colors.transparentBlack
                  : 'transparent',
              },
            ]}
          >
            <Text style={customStyles.songText}>SongTrack</Text>
            {customNearbyState ? (
              <Text style={customStyles.songText}>Music Nearby</Text>
            ) : (
              ''
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setCustomMapActive(false);
              setCustomNearbyActive(false);
              setCustomProfileActive(true);
            }}
            style={[
              customStyles.iconBg,
              {
                backgroundColor: customProfileActive
                  ? colors.transparentBlack
                  : 'transparent',
              },
            ]}
          >
            <Image
              source={imagePath.tabprofiledarkpurple}
              style={customStyles.icon}
              tintColor={colors.customWhite}
            />
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </View>
  );
};

// Styles for HomePage
const customStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.customWhite,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  icon: {
    height: moderateScale(30),
    width: moderateScale(30),
    resizeMode: 'contain',
  },
  iconBg: {
    padding: moderateScale(14),
    justifyContent: 'center',
    alignItems: 'center',
    bottom: moderateScale(10),
  },
  songText: {
    color: colors.customWhiteTranslucent,
    fontSize: moderateScale(18),
  },
});

export default HomePage;

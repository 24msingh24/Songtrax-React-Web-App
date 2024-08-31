import {View,Text,SafeAreaView,useColorScheme,Image,TouchableOpacity,StyleSheet,} from "react-native";
import React, { useEffect, useState } from "react";
import { AirbnbRating } from "react-native-ratings";
import colors, { darkTheme, lightTheme } from "../styless";
import {moderateScale,scale,textScale,verticalScale,} from "../dimensionsflexible";
import imagePath from "../SourcePic";
import AsyncStorage from "@react-native-async-storage/async-storage";
const BASE_URL = "https://comp2140.uqcloud.net/api/";
const API_KEY = "IZZgpTrtQR";
import axios from "axios";
import { WebView } from "react-native-webview";
import { AntDesign } from "@expo/vector-icons";
/**
 * A component for displaying details of a song.
 * @param {Object} props - The component's props.
 * @param {Object} props.item - The song object with details.
 * @param {string} props.locationName - The name of the location.
 * @param {function} props.onPress - Function to handle the back button press.
 * @returns {JSX.Element}
 */
const SongDetails = ({ item, locationName, onPress }) => {
  // State variables
  const [name, setName] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [rating, setRating] = useState(0);
  const [webViewState, setWebViewState] = useState({
    loaded: false,
    actioned: false,
  });

  // Other variables and refs
  const colorScheme = useColorScheme();
  const webViewRef = React.useRef();
  const theme = colorScheme === 'light' ? lightTheme : darkTheme;

  // Fetch and set data from AsyncStorage on component mount
  useEffect(() => {
    // Retrieve 'name' from AsyncStorage
    AsyncStorage.getItem('name')
      .then((storedName) => {
        if (storedName) {
          setName(storedName);
        }
      })
      .catch((error) => {
        console.error('Error loading name from AsyncStorage: ', error);
      });

    // Retrieve 'selectedImage' from AsyncStorage
    AsyncStorage.getItem('selectedImage')
      .then((imageURI) => {
        if (imageURI) {
          setSelectedImage(imageURI);
        }
      })
      .catch((error) => {
        console.error('Error loading selectedImage from AsyncStorage: ', error);
      });

    // Retrieve 'rating' from AsyncStorage
    AsyncStorage.getItem(`rating_${item.id}`)
      .then((storedRating) => {
        if (storedRating) {
          setRating(parseFloat(storedRating));
        }
      })
      .catch((error) => {
        console.error('Error loading rating from AsyncStorage: ', error);
      });
  }, []);

  /**
   * Handle the user's rating of the song.
   * @param {number} newRating - The new rating value.
   */
  const manageRating = async (newRating) => {
    try {
      setRating(newRating);
      await AsyncStorage.setItem(`rating_${item.id}`, newRating.toString());

      const apiEndpoint = `${BASE_URL}/samplerating/?api_key=${API_KEY}`;
      const data = {
        api_key: API_KEY,
        sample_id: item.id,
        rating: newRating,
      };

      const response = await axios.post(apiEndpoint, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 201) {
        console.log('Rating sent successfully');
      } else {
        console.error('Failed to send rating');
      }
    } catch (error) {
      console.error('Error while handling the rating:', error);
    }
  };

  /**
   * Function to be called when the WebView is loaded.
   */
  function webViewLoaded() {
    setWebViewState({
      ...webViewState,
      loaded: true,
    });
  }

  /**
   * Handle the action (play/stop) button press for the WebView.
   */
  function handleActionPress() {
    if (!webViewState.actioned) {
      const jsCode = `playSong('${item.recording_data}')`;
      webViewRef.current.injectJavaScript(jsCode);
    } else {
      webViewRef.current.injectJavaScript('stopSong()');
    }
    setWebViewState({
      ...webViewState,
      actioned: !webViewState.actioned,
    });
  }

  return (
    <SafeAreaView
      style={[
        stylesSidePage.container,
        {
          backgroundColor: theme.bgColor,
        },
      ]}
    >
      {/* Back button */}
      <TouchableOpacity
        onPress={onPress}
        style={{
          position: 'absolute',
          top: verticalScale(60),
          left: verticalScale(30),
        }}
      >
        <AntDesign name="arrowleft" size={24} color="black" />
      </TouchableOpacity>

      {/* Location information */}
      <View style={stylesSidePage.container2}>
        <Image
          source={
            colorScheme === 'light' ? imagePath.pinDark : imagePath.pinLig
          }
          style={stylesSidePage.iconSize}
        />
        <Text
          style={[
            stylesSidePage.uqText,
            {
              color: theme.fgColor,
            },
          ]}
        >
          {locationName}
        </Text>
      </View>

      {/* Song details */}
      <View style={stylesSidePage.container3}>
        <Text
          style={[
            stylesSidePage.nameOfStyle,
            {
              color: theme.fgColor,
            },
          ]}
        >
          {item.name}
        </Text>
        <TouchableOpacity
          onPress={handleActionPress}
          style={[
            stylesSidePage.container4,
            {
              backgroundColor: theme.fgColor,
            },
          ]}
        >
          <Text
            style={[
              stylesSidePage.playText,
              {
                color: theme.bgColor,
              },
            ]}
          >
            {webViewState.actioned ? 'Stop Music' : 'Play Music'}
          </Text>
        </TouchableOpacity>

        {/* Rating component */}
        <AirbnbRating
          ratingContainerStyle={{ marginTop: verticalScale(10) }}
          unSelectedColor={theme.fgColorLighter}
          showRating={false}
          count={5}
          defaultRating={rating}
          size={30}
          onFinishRating={manageRating}
        />

        {/* WebView for playing music */}
        <View>
          <WebView
            ref={(ref) => (webViewRef.current = ref)}
            originWhitelist={['*']}
            source={{
              uri: 'https://comp2140.uqcloud.net/static/samples/index.html',
            }}
            pullToRefreshEnabled={true}
            onLoad={webViewLoaded}
            style={stylesSidePage.webView}
          />
        </View>
      </View>

      {/* Currently at this location section */}
      <View>
        <Text
          style={[
            stylesSidePage.currentText,
            {
              color: theme.fgColor,
            },
          ]}
        >
          Currently At This Location:
        </Text>
        <View style={stylesSidePage.container6}>
          <Image
            resizeMode="contain"
            source={{ uri: selectedImage }}
            style={[
              stylesSidePage.imageStyle,
              {
                borderColor: theme.fgColor,
              },
            ]}
          />
          <View style={stylesSidePage.container5}>
            <Text
              style={{
                color: theme.fgColor,
              }}
            >
              {name}
            </Text>
          </View>
        </View>
        <View
          style={[
            stylesSidePage.container6,
            {
              marginBottom: verticalScale(50),
            },
          ]}
        >
          <Image
            resizeMode="contain"
            source={
              colorScheme === 'light'
                ? imagePath.smileyDark
                : imagePath.smileyLight
            }
            style={[
              stylesSidePage.imageStyle,
              {
                borderColor: theme.fgColor,
              },
            ]}
          />
          <View style={stylesSidePage.container5}>
            <Text
              style={{
                color: theme.fgColor,
              }}
            >
              Add Others...
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};


const stylesSidePage = StyleSheet.create({
  container: {
    flex: 1,
  },
  iconSize: {
    width: moderateScale(35),
    height: moderateScale(105),
    resizeMode: "contain",
  },
  container2: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: scale(20),
    marginHorizontal: scale(80),
  },
  uqText: {
    fontSize: textScale(20),
    fontWeight: "bold",
  },
  songContainer: {
    marginHorizontal: scale(20),
    marginVertical: scale(10),
    borderBottomWidth: 1,
    paddingVertical: scale(10),
    borderBottomColor: colors.blackColorTranslucentLess,
  },
  textSong: {
    color: colors.blackColorTranslucentLess,
    fontSize: textScale(12),
  },
  nameOfStyle: {
    fontSize: textScale(20),
    fontWeight: "bold",
  },
  container3: {
    marginHorizontal: scale(20),
    flex: 1,
  },
  container4: {
    padding: 10,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: verticalScale(20),
  },
  playText: {
    fontWeight: "bold",
  },
  currentText: {
    fontSize: textScale(16),
    fontWeight: "bold",
    marginHorizontal: scale(20),
    marginTop: verticalScale(20),
  },
  imageStyle: {
    height: moderateScale(50),
    width: moderateScale(50),
    borderRadius: moderateScale(25),
    borderWidth: 1,
    marginLeft: scale(20),
    marginTop: verticalScale(20),
  },
  container5: {
    flex: 1,
    marginTop: verticalScale(20),
    marginLeft: scale(10),
  },
  container6: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  webViewContainer: {
    borderWidth: 3,
    marginBottom: verticalScale(20),
    height: moderateScale(100),
    marginTop: verticalScale(20),
  },
});
export default SongDetails;

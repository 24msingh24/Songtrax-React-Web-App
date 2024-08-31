import React, { useEffect, useState } from "react";
import {View,Text, useColorScheme,SafeAreaView,TouchableOpacity,TextInput,Image,StyleSheet,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import {height,moderateScale, scale,textScale,verticalScale,
} from "../dimensionsflexible";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Entypo } from "@expo/vector-icons";
import { darkTheme , lightTheme} from "../styless";

/**
 * PicturePage is a React Native component for editing a user's profile picture and name.
 *
 * @component
 * @example
 * // Usage within a React Native component
 * <PicturePage />
 */
const PicturePage = () => {
  /**
   * @param {string} colorScheme - The color scheme of the app, either 'light' or 'dark'.
   * @param {object} theme - The theme object containing background and foreground colors.
   */
  const colorScheme = useColorScheme(); 
  const theme = colorScheme === 'light' ? lightTheme : darkTheme;

  /**
   * @param {string|null} selectedImage - The URI of the selected image.
   * @param {function} setSelectedImage - A function to update the selected image state.
   */
  const [selectedImage, setSelectedImage] = useState(null); // State to store the selected image URI

  /**
   * @param {string} name - The user's name.
   * @param {function} setName - A function to update the user's name state.
   */
  const [name, setName] = useState(''); // State to store the user's name

  useEffect(() => {
    // Use an effect to request media library permissions and load data when the component mounts
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions');
      }
    })();

    // Load 'name' and 'selectedImage' from AsyncStorage when the component mounts
    AsyncStorage.getItem('name')
      .then((storedName) => {
        if (storedName) {
          setName(storedName);
        }
      })
      .catch((error) => {
        console.error('Error loading name', error);
      });

    AsyncStorage.getItem('selectedImage')
      .then((imageURI) => {
        if (imageURI) {
          setSelectedImage(imageURI);
        }
      })
      .catch((error) => {
        console.error('Error loading selectedImage', error);
      });
  }, []);

  useEffect(() => {
    // Use an effect to save the 'name' to AsyncStorage when it changes
    if (name) {
      AsyncStorage.setItem('name', name)
        .then(() => {
          console.log('Name saved', name);
        })
        .catch((error) => {
          console.error('Error saving name', error);
        });
    }
  }, [name]);

  /**
   * Function to pick an image from the device's media library.
   */
  const snapphoto = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      await AsyncStorage.setItem('selectedImage', result.assets[0].uri);
    }
  };

  /**
   * Function to take a photo using the device's camera.
   */
  const snappic = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== 'granted') {
      alert('Access to the camera is not granted');
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      if (!result.cancelled) {
        const selectedImage = result.assets[0].uri;
        setSelectedImage(selectedImage);
        await AsyncStorage.setItem('selectedImage', selectedImage);
      }
    } catch (error) {
      console.error('Error while taking a photo:', error);
    }
  };

  return (
    <SafeAreaView
      style={[
        stylesPicturePage.container,
        {
          backgroundColor: theme.bgColor,
        },
      ]}
    >
      <Text
        style={[
          stylesPicturePage.heading,
          {
            color: theme.fgColor,
          },
        ]}
      >
        Edit Profile
      </Text>
      <Text
        style={[
          stylesPicturePage.subHeading,
          {
            color: theme.fgColor,
          },
        ]}
      >
        Mirror, Mirror on the wall...
      </Text>
      <View
        style={[
          stylesPicturePage.emptyBox,
          {
            borderColor: theme.fgColorLighter,
          },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={snapphoto}
          style={[
            stylesPicturePage.addPhotoButton,
            {
              backgroundColor: theme.fgColor,
            },
          ]}
        >
          <Text
            style={{
              color: theme.bgColor,
            }}
          >
            Add Photo
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={snappic}
          style={[
            stylesPicturePage.addPhotoButton,
            {
              backgroundColor: theme.fgColor,
              marginTop: verticalScale(20),
            },
          ]}
        >
          <Text
            style={{
              color: theme.bgColor,
            }}
          >
            Take Photo
          </Text>
        </TouchableOpacity>
      </View>
      {selectedImage && (
        <View style={stylesPicturePage.photoBox}>
          <Image
            source={{ uri: selectedImage }}
            style={stylesPicturePage.photoStyle}
          />
          <TouchableOpacity
            onPress={() => {
              setSelectedImage(null), AsyncStorage.removeItem('selectedImage');
            }}
            style={{
              position: 'absolute',
              top: verticalScale(10),
              right: verticalScale(10),
            }}
          >
            <Entypo name="squared-cross" size={30} color="black" />
          </TouchableOpacity>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '90%',
              alignSelf: 'center',
            }}
          >
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={snapphoto}
              style={[
                stylesPicturePage.addPhotoButton,
                {
                  backgroundColor: theme.fgColor,
                  position: 'absolute',
                  bottom: verticalScale(20),
                  alignSelf: 'center',
                },
              ]}
            >
              <Text
                style={{
                  color: theme.bgColor,
                }}
              >
                Select Photo
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={snappic}
              style={[
                stylesPicturePage.addPhotoButton,
                {
                  backgroundColor: theme.fgColor,
                  position: 'absolute',
                  bottom: verticalScale(20),
                  right: verticalScale(0),
                  alignSelf: 'center',
                },
              ]}
            >
              <Text
                style={{
                  color: theme.bgColor,
                }}
              >
                Take Photo
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      <View
        style={[
          stylesPicturePage.enterFullNameCont,
          {
            backgroundColor: theme.fgColorLighter,
          },
        ]}
      >
        <TextInput
          style={[
            stylesPicturePage.input,
            {
              color: theme.fgColor,
            },
          ]}
          value={name}
          onChangeText={(text) => setName(text)}
          placeholder="Enter Your name"
          placeholderTextColor={theme.fgColor}
        />
      </View>
    </SafeAreaView>
  );
};


const stylesPicturePage = StyleSheet.create({
  container: {
    flex: 1,
  },
  heading: {
    fontSize: textScale(30),
    fontWeight: "bold",
    paddingBottom: 0,
    marginHorizontal: scale(20),
  },
  subHeading: {
    fontSize: textScale(14),
    fontWeight: "bold",
    paddingBottom: 0,
    marginHorizontal: scale(20),
  },
  emptyBox: {
    borderWidth: 2,
    borderRadius: moderateScale(10),
    borderStyle: "dashed",
    height: height / 1.625,
    marginTop: verticalScale(20),
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: scale(20),
  },
  addPhotoButton: {
    fontWeight: "bold",
    padding: moderateScale(10),
    borderRadius: moderateScale(10),
    textAlign: "center",
    width: "48%",
    justifyContent: "center",
    alignItems: "center",
  },
  enterFullNameCont: {
    marginTop: verticalScale(20),
    borderRadius: moderateScale(5),
    height: moderateScale(40),
    marginHorizontal: scale(20),
  },
  input: {
    flex: 1,
    fontSize: textScale(14),
    textAlign: "center",
  },
  photoBox: {
    height: height / 1.625,
    marginTop: verticalScale(20),
    marginHorizontal: scale(20),
  },
  photoStyle: {
    height: height / 1.625,
    width: "100%",
    borderRadius: moderateScale(10),
  },
});
export default PicturePage;

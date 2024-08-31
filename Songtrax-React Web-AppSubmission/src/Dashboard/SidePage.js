import React, { useEffect, useState } from "react";
import {View,Text,SafeAreaView,useColorScheme,Image,FlatList,TouchableOpacity,ActivityIndicator,StyleSheet,} from "react-native";
import { AirbnbRating } from "react-native-ratings";
import SongDetails from "./music";
import colors, { darkTheme, lightTheme } from "../styless";
import imagePath from "../SourcePic";
import axios from "axios";
import {moderateScale,scale,textScale,verticalScale,} from "../dimensionsflexible";
const BASE_URL = "https://comp2140.uqcloud.net/api/";
const API_KEY = "IZZgpTrtQR";
 


/**
 * Represents a side page with sample information and ratings.
 * @param {Object} props - The component props.
 * @param {string} props.sampleId - The ID of the sample.
 * @param {string} props.locationName - The name of the location.
 * @returns {JSX.Element} React component for the SidePage.
 */
  const SidePage = ({ sampleId, locationName }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [songDetails, setSongDetails] = useState({});
  const [sampleData, setSampleData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [setErrorMsg] = useState(null);
  const [loadingRatings, setLoadingRatings] = useState(false);
  const [ratingsData, setRatingsData] = useState({});
  const colorScheme = useColorScheme();
  const theme = colorScheme === "light" ? lightTheme : darkTheme;

  useEffect(() => {
    fetchData();
    fetchSampleRatings();
  }, []);

   /**
   * Fetch sample ratings for the specified sample IDs.
   */
  const fetchSampleRatings = async () => {
    setLoadingRatings(true);
    const apiEndpoint = `${BASE_URL}/samplerating/?api_key=${API_KEY}`;
  
    try {
      const ratingPromises = sampleIds.map(async (id) => {
        const response = axios.get(`${apiEndpoint}&sample_id=${id}`);
        return response;
      });
  
      const responses = await axios.all(ratingPromises);
  
      const averageRatingsData = {};
      for (let i = 0; i < sampleIds.length; i++) {
        const id = sampleIds[i];
        const response = responses[i];
        if (response.status === 200) {
          const data = response.data;
          const rating = data.filter((item) => item.sample_id === id);
          if (rating.length > 0) {
            const ratings = rating.map((item) => item.rating);
            const averageRating = calculate(ratings);
            averageRatingsData[id] = averageRating;
          } else {
            averageRatingsData[id] = 0;
          }
        } else {
          console.log(`Error fetching ratings for sample ID ${id}`);
          averageRatingsData[id] = 0;
        }
      }
  
      setRatingsData(averageRatingsData);
      setLoadingRatings(false);
    } catch (error) {
      console.log('Error fetching ratings:', error);
      setLoadingRatings(false);
    }
  };
  
  
/**
   * Fetch sample data for the specified sample ID.
   */
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${BASE_URL}/sample/?api_key=${API_KEY}`
      );

      if (response.status === 200) {
        const data = response.data;
        const filteredSampleData = data.filter((item) =>
          sampleId.includes(item.id)
        );
        setSampleData(filteredSampleData);
        setLoading(false);
      } else {
        setErrorMsg("Failed to fetch data");
      }
    } catch (error) {
      setErrorMsg("Error");
    }
  };


   /**
   * Calculate the average of an array of numbers.
   * @param {number[]} arr - The array of numbers.
   * @returns {number} The average of the numbers in the array.
   */
  function calculate(arr) {
    if (arr.length === 0) return 0;
  
    let sum = 0;
    for (let i = 0; i < arr.length; i++) {
      sum += arr[i];
    }
  
    return sum / arr.length;
  }


   /**
   * Format a datetime string to a display-friendly date format.
   * @param {string} datetime - The datetime string to format.
   * @returns {string} The formatted date.
   */
  
function formatDateToDisplay(datetime) {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  const formattedDate = new Date(datetime).toLocaleDateString(undefined, options);
  return formattedDate.replace(/\//g, '-');
}
  if (loading && loadingRatings) {
    return (
      <View
        style={[
          styles.container,
          {
            justifyContent: "center",
            alignItems: "center",
          },
        ]}
      >
        <ActivityIndicator size="small" color={theme.fgColor} />
      </View>
    );
  }

  return (
    <>
      {isPlaying ? (
        <SongDetails
          onPress={() => setIsPlaying(false)}
          item={songDetails}
          locationName={locationName}
        />
      ) : (
        <SafeAreaView
          style={[
            styles.container,
            {
              backgroundColor: theme.bgColor,
            },
          ]}
        >
          <View style={styles.container2}>
            <Image
              source={
                colorScheme === "light"
                  ? imagePath.pinDark
                  : imagePath.pinLig
              }
              style={styles.iconSize}
            />
            <Text
              style={[
                styles.uqText,
                {
                  color: theme.fgColor,
                },
              ]}
            >
              {locationName}
            </Text>
          </View>

          {sampleData.length === 0 ? (
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                flex: 1,
              }}
            >
              <Text style={styles.noDataText}>No songs near your location</Text>
            </View>
          ) : (
            <FlatList
              data={sampleData}
              keyExtractor={(item) => `${item.id}`}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    setIsPlaying(true), setSongDetails(item);
                  }}
                  style={styles.songContainer}
                >
                  <Text
                    style={[
                      styles.textSong,
                      {
                        color: theme.fgColorLighter,
                      },
                    ]}
                  >
                    {item.name}
                  </Text>
                  <Text
                    style={[
                      styles.textSong,
                      {
                        color: theme.fgColorLighter,
                      },
                    ]}
                  >
                    {formatDateToDisplay(item.datetime)}
                  </Text>
                  <AirbnbRating
                    unSelectedColor={theme.fgColorLighter}
                    isDisabled
                    showRating={false}
                    count={5}
                    defaultRating={ratingsData[item.id]}
                    size={20}
                  />
                </TouchableOpacity>
              )}
            />
          )}
        </SafeAreaView>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  container2: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    margin: scale(20),
    paddingHorizontal: scale(80),
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
  container5: {
    marginTop: verticalScale(20),
    marginLeft: scale(10),
    flex: 1,
  },
  container6: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  webViewContainer: {
    borderWidth: 3,
    marginTop: verticalScale(20),
    marginBottom: verticalScale(20),
    height: moderateScale(100),
  },
  iconSize: {
    width: moderateScale(35),
    height: moderateScale(105),
    resizeMode: "contain",
  },
  uqText: {
    fontSize: textScale(20),
    fontWeight: "bold",
  },
  songContainer: {
    borderBottomWidth: 1,
    borderBottomColor: colors.blackColorTranslucentLess,
    marginVertical: scale(10),
    paddingVertical: scale(10),
    marginHorizontal: scale(20),
  },
  textSong: {
    fontSize: textScale(12),
    color: colors.blackColorTranslucentLess,
  },
  nameOfStyle: {
    fontSize: textScale(20),
    fontWeight: "bold",
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
});


export default SidePage;

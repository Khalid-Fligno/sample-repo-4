import React, { Component } from "react";
import { ImageBackground } from "react-native";
import { TouchableOpacity } from "react-native";
import { StyleSheet } from "react-native";
import { ScrollView, FlatList } from "react-native";
import { View, Text } from "react-native";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { FileSystem } from "react-native-unimodules";
import DoubleRightArrow from "../../../assets/icons/DoubleRightArrow";
import colors from "../../styles/colors";
import fonts from "../../styles/fonts";
import { containerPadding } from "../../styles/globalStyles";
// import Icon from "../Shared/Icon";
import Icon from "react-native-vector-icons/AntDesign";
import FeatherIcon from "react-native-vector-icons/Feather";
class TodayMealsList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  sample = ({ }) => (

    <TouchableOpacity
      style={styles.cardContainer1}
      onPress={() => this.props.filterPress()}
    >
      <View style={styles.opacityLayer1}>
        {/*<Icon name="add-circle" size={15} style={{ left: 50 }}/>*/}
        <Icon name="pluscircleo" size={20} style={{ left: 50 }} />
        <Text style={styles.cardTitle1}>Choose a recipe</Text>
      </View>
    </TouchableOpacity>

  )

  mealCard = ({ item: recipe }) => (
    <TouchableOpacity
      style={styles.cardContainer}
      // key={i}
      onPress={() => this.props.onPress(recipe)}
    >
      <ImageBackground
        // source={{uri: `${FileSystem.cacheDirectory}recipe-${recipe.id}.jpg` }}
        source={{ uri: recipe.coverImage, cache: "force-cache" }}
        style={styles.image}
        resizeMode="cover"
      >
        <View style={styles.opacityLayer}>
          <Text style={styles.cardTitle}>{recipe.title}</Text>
        </View>
      </ImageBackground>
      <View
          style={{
            position: 'absolute',
            backgroundColor: 'rgba(0,0,0,0.5)',
            height: wp("33%"),
            width: wp("65%"),
            borderRadius: 10
          }}
      >
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <FeatherIcon name="edit" size={25} color={'#ffffff'}/>
          <Text style={{color: '#ffffff'}}>Build your own recipe</Text>
        </View>
      </View>
    </TouchableOpacity>
  )

  carousel = (data, title) => (
    <View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: containerPadding,
        }}
      >
        <Text style={styles.label}>{title} </Text>
        {title === "Breakfast" && (
          <TouchableOpacity
            style={{ flexDirection: "row", alignItems: "center" }}
            activeOpacity={1}
          >
            <Text style={styles.rLabel}>Scroll for more </Text>
            <DoubleRightArrow height={wp("4%")} />
          </TouchableOpacity>
        )}
      </View>
      <FlatList
        horizontal
        // pagingEnabled={true}
        showsHorizontalScrollIndicator={false}
        legacyImplementation={false}
        data={data}
        renderItem={(item) => this.mealCard(item)}
        ListFooterComponent={this.sample}
        keyExtractor={(res) => res.id}
        style={{
          paddingHorizontal: containerPadding,
          paddingVertical: wp("3%"),
        }}
      />
    </View>
  )

  render() {
    const { data } = this.props;

    return (
      <View style={styles.container}>
        {data.breakfast.length > 0 &&
          this.carousel(data.breakfast, "Breakfast")}
        {/* {
            data.snack.length >0 &&
            this.carousel(data.snack,'Morning snack')
        } */}
        {data.lunch.length > 0 && this.carousel(data.lunch, "Lunch")}
        {/* {
            data.snack.length >0 &&
            this.carousel(data.snack,'Afternoon snack')
        } */}
        {data.dinner.length > 0 && this.carousel(data.dinner, "Dinner")}
        {data.snack.length > 0 && this.carousel(data.snack, "Snack")}
        {data.drink.length > 0 && this.carousel(data.drink, "Post Workout")}
      </View>
    );
  }
}

export default TodayMealsList;

const styles = StyleSheet.create({
  container: {
    width: wp("100%"),
  },
  footerComponet: {
    paddingHorizontal: 20,
  },
  label: {
    fontFamily: fonts.bold,
    fontSize: wp("4%"),
    color: colors.black,
  },
  rLabel: {
    fontFamily: fonts.GothamMedium,
    fontSize: wp("3%"),
    color: colors.grey.dark,
  },
  image: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    backgroundColor: colors.grey.light,
    // borderRadius: 3,
    borderRadius: 10,
  },
  cardContainer: {
    height: wp("33%"),
    width: wp("65%"),
    marginRight: wp("3.5%"),
    // paddingRight: 100
  },
  cardContainer1: {
    height: wp("33%"),
    width: wp("65%"),
    marginRight: wp("3.5%"),
    // backgroundColor: '#ececec',
    borderStyle: "dashed",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#000000",
    borderTopColor: "#000000"
  },
  opacityLayer: {
    flex: 1,
    width: "100%",
    justifyContent: "flex-end",
    backgroundColor: colors.transparentBlackLightest,
    padding: wp("5%"),
  },
  opacityLayer1: {
    flexDirection: 'column',
    width: "100%",
    justifyContent: "center",
    padding: 50,
    left: 15
  },
  cardTitle: {
    fontFamily: fonts.bold,
    color: colors.offWhite,
    shadowColor: colors.grey.dark,
    shadowOpacity: 1,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 5,
    width: "80%",
    fontSize: wp("3.5%"),
    textTransform: "capitalize",
  },
  cardTitle1: {
    fontFamily: fonts.bold,
    color: colors.black,
    // shadowColor: colors.grey.dark,
    // shadowOpacity: 1,
    // shadowOffset: { width: 0, height: 0 },
    // shadowRadius: 5,
    width: "90%",
    fontSize: wp("3.5%"),
  },
});
  
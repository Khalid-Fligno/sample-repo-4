import React, { useState } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  View,
  FlatList,
  Text,
  ScrollView,
} from "react-native";
import colors from "../../../../styles/colors";
import fonts from '../../../../styles/fonts';
import Icon from "../../../../components/Shared/Icon";
import globalStyle from "../../../../styles/globalStyles";
import BigHeadingWithBackButton from "../../../../components/Shared/BigHeadingWithBackButton";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import RecipeTileSkeleton from "../../../../components/Nutrition/RecipeTileSkeleton";

export const FavoriteScreen = ({ navigation }) => {
  const [title, setTitle] = useState();
  const [tags, setTags] = useState();
  const [defaultLevelTags, setDefaultLevelTags] = useState();
  const [phaseDefaultTags, setPhaseDefaultTags] = useState();
  const [nameCat, setNameCat] = useState();
  const [categoryName, setCategoryName] = useState();
  const [loading, setLoading] = useState();
  const [todayRecommendedRecipe, setTodayRecommendedRecipe] = useState();
  const [isFilterVisible, setIsFilterVisible] = useState();
  const [isClickVisible, setIsClickVisible] = useState();
  
  const handleBack = () => {
    navigation.pop();
  };

  const onClickFilter = () => {
    this.setState({
      isFilterVisible: !this.state.isFilterVisible,
      phase1: false,
      phase2: false,
      phase3: false,
      veganChecked: false,
      vegetarianChecked: false,
      glutenFree: false,
      dairyFree: false,
      gutHealth: false,
      levelText: "",
      phaseText: "",
    });
  }

  const skeleton = (
    <View>
      <RecipeTileSkeleton />
      <RecipeTileSkeleton />
      <RecipeTileSkeleton />
    </View>
  );

  const filterModal = (challengeRecipe, data) => {
    console.log("challengeRecipe: ", challengeRecipe)
    console.log("data: ", data)
  }

  const clickModal = (data, challengeRecipe) =>{
    console.log("challengeRecipe: ", challengeRecipe)
    console.log("data: ", data)
  }

  return (
    <View style={globalStyle.container}>
      <View
        style={styles.customContainerStyle}
      >
        {/* BigHeadText */}
        <View>
          <BigHeadingWithBackButton
            isBigTitle={true}
            isBackButton={true}
            onPress={handleBack}
            backButtonText="Back to Challenge"
            customContainerStyle={{ bottom: 25 }}
          />
          <Text style={{ bottom: 60, fontSize: 30, fontFamily: fonts.bold }}>{title}</Text>
        </View>

        {/* Filter Button */}
        <View style={{ marginTop: 10, width: 100 }}>
          <TouchableOpacity
            onPress={onClickFilter}
            style={styles.oblongBtnStyle}
          >
            <Text
              style={{
                marginTop: 10,
                fontSize: 12,
                fontFamily: fonts.bold,
                textTransform: 'uppercase',
              }}
            >
              Filter
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
      >
        <View
          style={{ flexDirection: 'row', marginVertical: 10, marginBottom: 20, top: 0, height: 20 }}
        >
          {
            tags.length ?
              tags.map((item, index) => (
                <View
                  key={index}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: '#e3e3e3',
                    borderRadius: 50,
                    marginRight: 7,
                  }}
                >
                  <Text style={{ marginHorizontal: 10, marginVertical: 5, fontSize: 9, }}>{item.level} - {item.phase.map((el) => el.phaseTag + ' ')}</Text>
                  <TouchableOpacity
                    onPress={() => {
                      const tag = tags.filter((item) => item.level !== item.level)
                      setTags(tag)
                    }}
                  >
                    <Icon name='cross' size={8} color={colors.black} style={{ marginRight: 10 }} />
                  </TouchableOpacity>
                </View>
              ))
              :
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: '#e3e3e3',
                  borderRadius: 50,
                  marginRight: 7,
                }}
              >
                <Text style={{ marginHorizontal: 10, marginVertical: 5, fontSize: 9, }}>
                  {defaultLevelTags}{defaultLevelTags === 'L1' ? ' - ' + phaseDefaultTags : null}
                </Text>
              </View>
          }
          {
            nameCat.length ?
              nameCat.map((cat, index) => (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: '#e3e3e3',
                    borderRadius: 50,
                    marginRight: 7,
                  }}
                  key={index}
                >
                  <Text style={{ marginHorizontal: 10, marginVertical: 5, fontSize: 9, }}>{cat.name}</Text>
                  <TouchableOpacity
                    onPress={() => {
                      const tag = nameCat.filter((item) => item.name !== cat.name)
                      setNameCat(tag)
                    }}
                  >
                    <Icon name='cross' size={8} color={colors.black} style={{ marginRight: 10 }} />
                  </TouchableOpacity>
                </View>
              ))
              :
              categoryName.map((cat, index) => (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: '#e3e3e3',
                    borderRadius: 50,
                    marginRight: 7,
                  }}
                  key={index}
                >
                  <Text style={{ marginHorizontal: 10, marginVertical: 5, fontSize: 9, }}>{cat.name}</Text>
                </View>
              ))
          }
        </View>
      </ScrollView>
      {
        loading ?
          skeleton
          :
          todayRecommendedRecipe.length > 0
            ?
            <FlatList
              contentContainerStyle={styles.scrollView}
              data={todayRecommendedRecipe}
              keyExtractor={(res) => res.id}
              renderItem={(item) => this.renderItem(item)}
              showsVerticalScrollIndicator={false}
              removeClippedSubviews={false}
            />
            :
            <View
              style={{
                height: hp('65%'),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 15,
                  fontFamily: fonts.bold,
                  textTransform: 'uppercase',
                }}
              >
                no recipes are available
              </Text>
            </View>
      }
      {
        isFilterVisible && (
          filterModal(challengeRecipe, data)
        )
      }
      {
        isClickVisible && (
          clickModal(data, challengeRecipe)
        )
      }
    </View>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    paddingBottom: 15,
  },
  rLabel: {
    fontFamily: fonts.GothamMedium,
    fontSize: 8,
    color: colors.grey.dark,
  },
  icon: {
    marginTop: 2,
  },
  icon2: {
    marginTop: 2,
  },
  customContainerStyle: {
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'space-between',
    height: 50,
    marginVertical: hp("2%"),
    marginTop: 10,
    marginBottom: hp("2.5%"),
    paddingTop: 10,
  },
  bigTitleStyle: {
    fontSize: hp("4%"),
    fontWeight: '700',
    fontFamily: 'monospace',
    color: colors.black,
    letterSpacing: 0.5,
  },
  oblongBtnStyle: {
    alignItems: 'center',
    borderRadius: 45,
    borderWidth: 0,
    backgroundColor: colors.white,
    color: colors.black,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.48,
    shadowRadius: 11.95,
    elevation: 18,
    height: 38,
  },
  closeContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'grey',
    marginHorizontal: wp('45%'),
    marginTop: 10,
    borderRadius: 50,
    height: 5,
  },
  tagContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  tagContainer1: {
    flexDirection: 'row',
  },
  cardContainer: {
    margin: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: width - 50,
    borderRadius: 3,
    overflow: 'hidden',
    borderWidth: 0,
    elevation: 0,
  },
  button: {
    alignItems: "center",
    backgroundColor: '#4d4c4c',
    padding: 10,
  }
})
import React from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity } from 'react-native';
import Tile from '../../../components/Tile';
import colors from '../../../styles/colors';
import Icon from '../../../components/Icon';

export default class HomeScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  render() {
    return (
      <View
        style={styles.container}
      >
        <View
          style={{
            flex: 1,
            alignItems: 'flex-start',
          }}
        >
          <Text
            style={{
              fontFamily: 'GothamBold',
              fontSize: 24,
            }}
          >
            Workouts
          </Text>
          <ScrollView
            contentContainerStyle={{
              height: 160,
              padding: 10,
            }}
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            <Tile
              imageSrc={require('../../../../assets/images/yazzy.png')}
              title="FitYaz Core"
            />
            <Tile
              imageSrc={require('../../../../assets/images/yazzy2.png')}
              title="FitYaz Core"
            />
            <Tile
              imageSrc={require('../../../../assets/images/yazzy3.png')}
              title="FitYaz Core"
            />
          </ScrollView>
        </View>
        <TouchableOpacity
          onPress={() => console.log('yee')}
          activeOpacity={0.7}
          style={{
            shadowColor: colors.coral.dark,
            shadowOpacity: 1,
            shadowOffset: { width: 0, height: 2 },
            shadowRadius: 1,
          }}
        >
          <Icon
            name="pause"
            size={100}
            color={colors.coral.standard}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => console.log('yee')}
          activeOpacity={0.7}
          style={{
            shadowColor: colors.coral.dark,
            shadowOpacity: 1,
            shadowOffset: { width: 0, height: 2 },
            shadowRadius: 1,
          }}
        >
          <Icon
            name="stop"
            size={100}
            color={colors.coral.standard}
          />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.offWhite,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

import React from 'react';
import { StyleSheet, View, ScrollView, Text } from 'react-native';
import Tile from '../../components/Tile';

export default class HomeScreen extends React.PureComponent {
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
          horizontal
          contentContainerStyle={{
            height: 160,
            padding: 10,
          }}
        >
          <Tile
            imageSrc={require('../../../assets/images/yazzy-colour-mask.png')}
            title="FitYaz Core"
          />
          <Tile
            imageSrc={require('../../../assets/images/yazzy-colour-mask.png')}
            title="FitYaz Core"
          />
          <Tile
            imageSrc={require('../../../assets/images/yazzy-colour-mask.png')}
            title="FitYaz Core"
          />
        </ScrollView>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

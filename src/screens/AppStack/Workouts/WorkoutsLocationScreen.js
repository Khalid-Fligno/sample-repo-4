import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import Tile from '../../../components/Tile';
import colors from '../../../styles/colors';
import fonts from '../../../styles/fonts';

const { width } = Dimensions.get('window');

export default class WorkoutsLocationScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  render() {
    const { navigate, getParam } = this.props.navigation;
    const workoutType = getParam('workoutType', null);
    return (
      <View style={styles.container}>
        <Tile
          title1="GYM"
          image={require('../../../../assets/images/workouts-full.jpg')}
          onPress={() => navigate('WorkoutsSelection', {
            workoutType,
            workoutLocation: 'gym',
          })}
        />
        <Tile
          title1="HOME"
          image={require('../../../../assets/images/workouts-upper.jpg')}
          onPress={() => navigate('WorkoutsSelection', {
            workoutType,
            workoutLocation: 'home',
          })}
        />
        <Tile
          title1="PARK"
          image={require('../../../../assets/images/workouts-lower.jpg')}
          onPress={() => navigate('WorkoutsSelection', {
            workoutType,
            workoutLocation: 'park',
          })}
        />
        <View style={styles.spacer} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: 'center',
    paddingTop: 5,
    paddingBottom: 5,
  },
  buttonContainer: {
    marginTop: 5,
    marginBottom: 5,
  },
  workoutButton: {
    opacity: 0.9,
    flex: 1,
    justifyContent: 'flex-end',
    width: width - 30,
    marginTop: 7.5,
    marginBottom: 7.5,
    paddingLeft: 20,
    paddingBottom: 5,
    borderRadius: 4,
    backgroundColor: colors.coral.standard,
    shadowColor: colors.black,
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  workoutButtonText: {
    fontFamily: fonts.boldItalic,
    fontSize: 34,
    color: colors.white,
  },
  spacer: {
    flex: 1 / 4,
    margin: 5,
  },
});

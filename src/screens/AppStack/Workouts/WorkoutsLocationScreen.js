import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import Tile from '../../../components/Shared/Tile';
import colors from '../../../styles/colors';

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
          image={require('../../../../assets/images/workouts-gym.jpg')}
          onPress={() => navigate('WorkoutsSelection', {
            workoutType,
            workoutLocation: 'gym',
          })}
        />
        <Tile
          title1="HOME"
          image={require('../../../../assets/images/workouts-home.jpg')}
          onPress={() => navigate('WorkoutsSelection', {
            workoutType,
            workoutLocation: 'home',
          })}
        />
        <Tile
          title1="PARK"
          image={require('../../../../assets/images/workouts-park.jpg')}
          onPress={() => navigate('WorkoutsSelection', {
            workoutType,
            workoutLocation: 'park',
          })}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width,
    backgroundColor: colors.white,
    alignItems: 'center',
    paddingTop: 5,
    paddingBottom: 5,
  },
});

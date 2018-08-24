import React from 'react';
import { StyleSheet, View } from 'react-native';
import Tile from '../../../components/Tile';
import colors from '../../../styles/colors';

export default class WorkoutsHomeScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        <Tile
          title1="FULL"
          title2="BODY"
          image={require('../../../../assets/images/workouts-full.jpg')}
          onPress={() => navigate('WorkoutsLocation', { workoutType: 'fullBody' })}
        />
        <Tile
          title1="UPPER"
          title2="BODY"
          image={require('../../../../assets/images/workouts-upper.jpg')}
          onPress={() => navigate('WorkoutsLocation', { workoutType: 'upperBody' })}
        />
        <Tile
          title1="LOWER"
          title2="BODY"
          image={require('../../../../assets/images/workouts-lower.jpg')}
          onPress={() => navigate('WorkoutsLocation', { workoutType: 'lowerBody' })}
        />
        <Tile
          title1="CORE"
          image={require('../../../../assets/images/workouts-core.jpg')}
          onPress={() => navigate('WorkoutsLocation', { workoutType: 'core' })}
        />
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
    paddingTop: 5,
    paddingBottom: 5,
  },
});

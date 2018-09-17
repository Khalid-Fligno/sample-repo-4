import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { FileSystem } from 'expo';
import colors from '../../../../styles/colors';

export default class HiitWorkoutCompleteScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  componentWillMount = async () => {
    // const exerciseList = this.props.navigation.getParam('exerciseList', null);
    try {
      FileSystem.deleteAsync(`${FileSystem.cacheDirectory}exercise-1.mp4`, { idempotent: true });
      FileSystem.deleteAsync(`${FileSystem.cacheDirectory}exercise-2.mp4`, { idempotent: true });
    } catch (err) {
      console.log(err);
    }
    // try {
    //   await Promise.all(exerciseList.map(async (exercise, index) => {
    //     await FileSystem.deleteAsync(`${FileSystem.cacheDirectory}exercise-${index + 1}.mp4`);
    //   }));
    // } catch (err) {
    //   console.log(`Filesystem delete error: ${err}`);
    // }
  }
  render() {
    return (
      <View style={styles.container}>
        <Text>
          Hiit Workout Complete
        </Text>
        <Text
          onPress={() => this.props.navigation.navigate('WorkoutsHome')}
        >
          Done
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { FileSystem } from 'expo';
import { db } from '../../../../config/firebase';
import colors from '../../../styles/colors';

export default class WorkoutInfoScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      exerciseList: [],
    };
  }
  componentWillMount = async () => {
    const exercises = this.props.navigation.getParam('exercises', null);
    try {
      const exerciseList = [];
      await exercises.map(async (exercise, index) => {
        await db.collection('exercises')
          .doc(exercise.id)
          .onSnapshot(async (doc) => {
            const exerciseObject = await doc.data();
            exerciseList.push(exerciseObject);
            await FileSystem.downloadAsync(
              exerciseObject.videoURL,
              `${FileSystem.documentDirectory}exercise-${index + 1}.mp4`,
            );
          });
      });
      this.setState({ exerciseList });
    } catch (err) {
      console.log(err);
    }
    // await exercises.forEach((exercise, index) => {
    //   db.collection('exercises')
    //     .doc(exercise)
    //     .onSnapshot(async (doc) => {
    //       const { videoURL, name } = doc.data();
    //       exerciseNames.push(name);
    //       await FileSystem.downloadAsync(
    //         videoURL,
    //         `${FileSystem.documentDirectory}exercise-${index + 1}.mp4`,
    //       )
    //         .catch((error) => {
    //           console.error(error);
    //         });
    //     });
    // });
  }
  render() {
    const { exerciseList } = this.state;
    const exerciseDisplay = exerciseList.map((exercise) => {
      return (
        <Text key={exercise.id}>
          {exercise.name}
        </Text>
      );
    });
    return (
      <View style={styles.container}>
        <Text>
          Workout Info Screen
        </Text>
        {exerciseDisplay}
        <Text
          onPress={() => this.props.navigation.navigate('Exercise1', {
            exerciseList,
          })}
        >
          Start
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

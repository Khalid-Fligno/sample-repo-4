import React from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import { Video, FileSystem } from 'expo';
import colors from '../../../styles/colors';

const { width } = Dimensions.get('window');

export default class Exercise3Screen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      exerciseList: [],
      currentExercise: {},
    };
  }
  componentWillMount() {
    const exerciseList = this.props.navigation.getParam('exerciseList', null);
    this.setState({ exerciseList, currentExercise: exerciseList[2] });
  }
  render() {
    const { currentExercise, exerciseList } = this.state;
    return (
      <View style={styles.container}>
        <Text>
          Exercise 3
        </Text>
        <Text>
          {currentExercise.name}
        </Text>
        <Video
          source={{ uri: `${FileSystem.documentDirectory}exercise-3.mp4` }}
          rate={1.0}
          volume={1.0}
          isMuted={false}
          resizeMode="contain"
          shouldPlay
          isLooping
          style={{ width, height: width }}
        />
        <Text
          onPress={() => this.props.navigation.navigate('Exercise4', {
            exerciseList,
          })}
        >
          Next
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

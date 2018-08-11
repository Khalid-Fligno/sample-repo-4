import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

const WorkoutProgress = () => (
  <View style={styles.container}>
    <View style={styles.exercise}>
      <Text>1</Text>
    </View>
    <View style={styles.exercise}>
      <Text>2</Text>
    </View>
    <View style={styles.exercise}>
      <Text>3</Text>
    </View>
    <View style={styles.exercise}>
      <Text>4</Text>
    </View>
    <View style={styles.exercise}>
      <Text>5</Text>
    </View>
    <View style={styles.exercise}>
      <Text>6</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 50,
  },
  exercise: {
    flex: 1,
    borderColor: 'black',
    borderWidth: 1,
  },
});

export default WorkoutProgress;

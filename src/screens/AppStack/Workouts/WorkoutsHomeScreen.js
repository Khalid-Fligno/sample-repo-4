import React from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import { Button } from 'react-native-elements';
import colors from '../../../styles/colors';
import fonts from '../../../styles/fonts';

const { width } = Dimensions.get('window');

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
        <Text>
          WorkoutsHomeScreen
        </Text>
        <Button
          title="Full Body"
          onPress={() => navigate('WorkoutsLocation', { workoutType: 'fullBody' })}
          containerViewStyle={styles.buttonContainer}
          buttonStyle={styles.button}
          textStyle={styles.buttonText}
        />
        <Button
          title="Upper Body"
          onPress={() => navigate('WorkoutsLocation', { workoutType: 'upperBody' })}
          containerViewStyle={styles.buttonContainer}
          buttonStyle={styles.button}
          textStyle={styles.buttonText}
        />
        <Button
          title="Lower Body"
          onPress={() => navigate('WorkoutsLocation', { workoutType: 'lowerBody' })}
          containerViewStyle={styles.buttonContainer}
          buttonStyle={styles.button}
          textStyle={styles.buttonText}
        />
        <Button
          title="Core"
          onPress={() => navigate('WorkoutsLocation', { workoutType: 'core' })}
          containerViewStyle={styles.buttonContainer}
          buttonStyle={styles.button}
          textStyle={styles.buttonText}
        />
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
  buttonContainer: {
    marginTop: 5,
    marginBottom: 5,
  },
  button: {
    width: width - 30,
    backgroundColor: colors.coral.standard,
    borderRadius: 4,
  },
  buttonText: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: colors.white,
    marginTop: 3,
  },
});

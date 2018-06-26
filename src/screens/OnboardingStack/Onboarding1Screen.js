import React from 'react';
import { View, Text, StyleSheet, Picker } from 'react-native';
import { Button } from 'react-native-elements';
import { SafeAreaView } from 'react-navigation';
import colors from '../../styles/colors';
import fonts from '../../styles/fonts';

export default class OnboardingScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      weight: null,
    };
  }
  render() {
    return (
      <SafeAreaView style={styles.safeAreaContainer}>
        <View style={styles.container}>
          <Text style={styles.headerText}>
            Welcome to the FitazFK Fam!
          </Text>
          <Text style={styles.bodyText}>
            To help us get you #FitazFK, we need some information from you.
          </Text>
          <Text>Weight</Text>
          <Picker
            selectedValue={this.state.weight}
            style={{ height: 50, width: 100 }}
            onValueChange={(itemValue) => this.setState({ weight: itemValue })}
          >
            <Picker.Item label="40" value={40} />
            <Picker.Item label="41" value={41} />
            <Picker.Item label="42" value={42} />
          </Picker>
          <Text>Waist</Text>
          <Text>Hip</Text>
          <Button
            title="Next Step"
            onPress={() => this.props.navigation.navigate('Onboarding2')}
          />
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: colors.black,
  },
  container: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: 'center',
  },
  headerText: {
    fontFamily: fonts.bold,
    fontSize: 24,
  },
  bodyText: {
    fontFamily: fonts.standard,
    fontSize: 14,
  },
});

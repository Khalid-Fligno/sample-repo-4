import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Alert } from 'react-native';
import CustomButton from '../../components/CustomButton';
import colors from '../../styles/colors';
import fonts from '../../styles/fonts';

export default class Onboarding3Screen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  componentWillMount = () => {
    this.props.navigation.setParams({ handleSkip: this.handleSkip });
  }
  handleSkip = () => {
    Alert.alert(
      'Warning',
      'You will need to do this before your first workout',
      [
        {
          text: 'Cancel', style: 'cancel',
        },
        {
          text: 'Ok, got it!', onPress: () => this.props.navigation.navigate('App'),
        },
      ],
      { cancelable: false },
    );
  }
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View>
          <Text style={styles.headerText}>
            Header Text
          </Text>
          <Text style={styles.bodyText}>
            Body Text
          </Text>
        </View>
        <View>
          <Text>Burpee Test</Text>
        </View>
        <View>
          <CustomButton
            title="Next Step"
            onPress={() => this.props.navigation.navigate('App')}
            primary
          />
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerText: {
    textAlign: 'center',
    fontFamily: fonts.bold,
    fontSize: 24,
  },
  bodyText: {
    textAlign: 'center',
    fontFamily: fonts.standard,
    fontSize: 14,
  },
});

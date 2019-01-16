import React from 'react';
import { StyleSheet, SafeAreaView, View, Text, ScrollView, Dimensions } from 'react-native';
import { Linking } from 'expo';
import Loader from '../../../components/Shared/Loader';
import CustomButton from '../../../components/Shared/CustomButton';
import colors from '../../../styles/colors';
import fonts from '../../../styles/fonts';

const { width } = Dimensions.get('window');

export default class HelpAndSupportScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }
  goToHelp = () => {
    Linking.openURL('https://fitazfk.zendesk.com/hc/en-us');
  }
  render() {
    const { loading } = this.state;
    return (
      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.container}>
          <ScrollView contentContainerStyle={styles.scrollView}>
            <View style={styles.textContainer}>
              <Text style={styles.header}>
                Help & Support
              </Text>
              <Text style={styles.paragraph}>
                Follow this link to see our frequently asked questions, or submit your own!
              </Text>
            </View>
            <View style={styles.buttonContainer}>
              <CustomButton
                title="GO TO FITAZFK HELP"
                onPress={() => this.goToHelp()}
              />
            </View>
          </ScrollView>
          <Loader
            loading={loading}
            color={colors.charcoal.standard}
          />
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: colors.black,
  },
  container: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: 'center',
  },
  scrollView: {
    width,
  },
  textContainer: {
    width,
    padding: 15,
  },
  header: {
    fontFamily: fonts.bold,
    fontSize: 24,
    marginBottom: 10,
  },
  paragraph: {
    fontFamily: fonts.standard,
    fontSize: 14,
  },
  buttonContainer: {
    width,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
});

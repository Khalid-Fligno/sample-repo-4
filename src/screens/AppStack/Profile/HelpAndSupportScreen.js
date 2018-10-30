import React from 'react';
import { StyleSheet, SafeAreaView, View, Text, ScrollView, Dimensions } from 'react-native';
import Loader from '../../../components/Shared/Loader';
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
  render() {
    const { loading } = this.state;
    return (
      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.container}>
          <ScrollView contentContainerStyle={styles.scrollView}>
            <Text style={styles.header}>
              Help & Support
            </Text>
            <Text style={styles.paragraph}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            </Text>
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
});

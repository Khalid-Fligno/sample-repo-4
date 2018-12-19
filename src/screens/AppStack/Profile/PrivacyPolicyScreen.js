import React from 'react';
import { StyleSheet, SafeAreaView, View, Text, ScrollView, Dimensions, Linking } from 'react-native';
import { Segment } from 'expo';
import { db } from '../../../../config/firebase';
import Loader from '../../../components/Shared/Loader';
import colors from '../../../styles/colors';
import fonts from '../../../styles/fonts';

const { width } = Dimensions.get('window');

export default class PrivacyPolicyScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      text: undefined,
      loading: false,
      analyticsEnabled: undefined,
    };
  }
  componentDidMount = async () => {
    this.fetchText();
    this.setState({ analyticsEnabled: await Segment.getEnabledAsync() });
  }
  fetchText = () => {
    this.setState({ loading: true });
    db.collection('legalDocuments').doc('v3h3itZL99UHIpiILeVz')
      .get()
      .then(async (doc) => {
        if (doc.exists) {
          this.setState({ text: await doc.data().text, loading: false });
        } else {
          this.setState({ loading: false });
        }
      });
  }
  openLink = (url) => {
    Linking.openURL(url);
  }
  turnOffAnalytics = async () => {
    this.setState({ loading: true });
    await Segment.setEnabledAsync(false);
    this.setState({ analyticsEnabled: false, loading: false });
  }
  turnOnAnalytics = async () => {
    this.setState({ loading: true });
    await Segment.setEnabledAsync(true);
    this.setState({ analyticsEnabled: true, loading: false });
  }
  render() {
    const { text, loading, analyticsEnabled } = this.state;
    const sortedText = text && text.sort((a, b) => {
      return a.id - b.id;
    });
    const textDisplay = sortedText && sortedText.map((paragraph) => (
      <Text
        key={paragraph.id}
        onPress={() => paragraph.url && this.openLink(paragraph.url)}
        style={[
          styles.paragraph,
          paragraph.heading && styles.paragraphHeading,
          paragraph.url && styles.link,
        ]}
      >
        {paragraph.value}
      </Text>
    ));
    return (
      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.container}>
          <ScrollView contentContainerStyle={styles.scrollView}>
            <Text style={styles.header}>
              Privacy Policy
            </Text>
            {textDisplay}
            {
              analyticsEnabled === true && (
                <Text
                  onPress={() => this.turnOffAnalytics()}
                  style={styles.link}
                >
                  Turn off analytics
                </Text>
              )
            }
            {
              analyticsEnabled === false && (
                <Text
                  onPress={() => this.turnOnAnalytics()}
                  style={styles.link}
                >
                  Turn on analytics
                </Text>
              )
            }
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
    color: colors.charcoal.standard,
    marginBottom: 10,
  },
  paragraphHeading: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.charcoal.dark,
    marginTop: 5,
    marginBottom: 8,
  },
  paragraph: {
    fontFamily: fonts.standard,
    fontSize: 14,
    color: colors.charcoal.standard,
    marginBottom: 8,
  },
  link: {
    fontFamily: fonts.standard,
    fontSize: 14,
    color: colors.blue.vivid,
    marginBottom: 8,
    textDecorationStyle: 'solid',
    textDecorationColor: colors.blue.vivid,
    textDecorationLine: 'underline',
  },
});

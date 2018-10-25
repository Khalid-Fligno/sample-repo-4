import React from 'react';
import { StyleSheet, SafeAreaView, View, Text, ScrollView, Dimensions } from 'react-native';
import { db } from '../../../../config/firebase';
import Loader from '../../../components/Shared/Loader';
import colors from '../../../styles/colors';
import fonts from '../../../styles/fonts';

const { width } = Dimensions.get('window');

export default class BillingTermsScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      text: undefined,
      loading: false,
    };
  }
  componentDidMount() {
    db.collection('legalDocuments').doc('WOTvmNeeo3NiFdw0C00N')
      .get()
      .then(async (doc) => {
        if (doc.exists) {
          this.setState({ text: await doc.data().text });
        }
      });
  }
  fetch
  render() {
    const { text, loading } = this.state;
    return (
      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.container}>
          <ScrollView contentContainerStyle={styles.scrollView}>
            <Text style={styles.header}>
              Billing Terms
            </Text>
            <Text style={styles.paragraph}>
              {text && text.replace('\\n', '\n\n')}
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

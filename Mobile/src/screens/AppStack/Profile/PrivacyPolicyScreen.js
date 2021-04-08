import React from 'react';
import { StyleSheet, SafeAreaView, View, Text, ScrollView, Dimensions, Linking, Alert } from 'react-native';
import { db } from '../../../../config/firebase';
import Loader from '../../../components/Shared/Loader';
import colors from '../../../styles/colors';
import fonts from '../../../styles/fonts';
import globalStyle from '../../../styles/globalStyles';
import ProfileStyles from './ProfileStyles';
const { width } = Dimensions.get('window');

export default class PrivacyPolicyScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      text: undefined,
      loading: false,
    };
  }
  componentDidMount = async () => {
    this.fetchText();
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
      })
      .catch(() => {
        Alert.alert('Connection error', 'Please try again later');
        this.setState({ loading: false });
      });
  }
  openLink = (url) => {
    Linking.openURL(url);
  }
  render() {
    const { text, loading } = this.state;
    const sortedText = text && text.sort((a, b) => {
      return a.id - b.id;
    });
    const textDisplay = sortedText && sortedText.map((paragraph) => (
      <Text
        key={paragraph.id}
        onPress={() => paragraph.url && this.openLink(paragraph.url)}
        style={[
          ProfileStyles.paragraph,
          paragraph.heading && ProfileStyles.paragraphHeading,
          paragraph.url && ProfileStyles.link,
        ]}
      >
        {paragraph.value}
      </Text>
    ));
    return (
      <SafeAreaView style={globalStyle.safeContainer}>
        <View style={[globalStyle.container,{paddingHorizontal:0,alignItems:'center'}]}>
          <ScrollView contentContainerStyle={ProfileStyles.scrollView}>
            <Text style={ProfileStyles.header}>
              Privacy Policy
            </Text>
            {textDisplay}
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

});

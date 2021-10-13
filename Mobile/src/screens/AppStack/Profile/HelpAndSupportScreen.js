import React from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  ScrollView,
  Dimensions,
  Platform,
} from 'react-native';
import { Linking } from 'expo';
import Loader from '../../../components/Shared/Loader';
import CustomButton from '../../../components/Shared/CustomButton';
import colors from '../../../styles/colors';
import fonts from '../../../styles/fonts';
import globalStyle from '../../../styles/globalStyles';
import ProfileStyles from './ProfileStyles';
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

  goToReport = () => {
    Linking.openURL('https://fitazfk.canny.io/fitazfk-app-feedback');
  }
  render() {
    const { loading } = this.state;
    return (
      <SafeAreaView style={globalStyle.safeContainer}>
        <View style={[globalStyle.container, { paddingHorizontal: 0, alignItems: 'center' }]}>
          <ScrollView contentContainerStyle={[ProfileStyles.scrollView, { padding: 0 }]}>
            <View style={ProfileStyles.scrollView}>
              <Text style={ProfileStyles.header}>
                Help & Support
              </Text>
              <Text style={ProfileStyles.paragraph}>
                Follow this link to see our frequently asked questions, or submit your own!
              </Text>
            </View>
            <View style={ProfileStyles.buttonContainer}>
              <View>
                <CustomButton
                  title="Go to FAQ's Page"
                  onPress={() => this.goToHelp()}
                />
              </View>
              <View style={{ marginTop: 10 }}>
                {
                  Platform.OS === 'android' ?
                    <CustomButton
                      title="Report an issue"
                      onPress={() => this.goToReport()}
                    />
                    :
                    <CustomButton
                      title="Report an issue"
                      onPress={() => this.goToReport()}
                    />
                }
              </View>
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

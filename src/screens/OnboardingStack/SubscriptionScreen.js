import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import SubscriptionTile from '../../components/Onboarding/SubscriptionTile';
import Loader from '../../components/Shared/Loader';
import CustomButton from '../../components/Shared/CustomButton';
import colors from '../../styles/colors';
import fonts from '../../styles/fonts';

const { width } = Dimensions.get('window');

const priceMap = {
  monthly: '$19.99',
  quarterly: '$49.99',
  yearly: '$99.99',
};

export default class SubscriptionScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      subscriptionSelected: '',
    };
  }
  toggleSubscriptionSelected = (subscriptionSelected) => {
    this.setState({ subscriptionSelected });
  }
  render() {
    const {
      loading,
      subscriptionSelected,
    } = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.flexContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>
              Subscription
            </Text>
            <Text style={styles.subHeadingText}>
              Subscribe now for a 7-day free trial!
            </Text>
          </View>
          <View style={styles.contentContainer}>
            <View style={styles.subscriptionTileRow}>
              <SubscriptionTile
                title="Monthly"
                price="$19.99"
                onPress={() => this.toggleSubscriptionSelected('monthly')}
                active={subscriptionSelected === 'monthly'}
              />
              <SubscriptionTile
                title="Quarterly"
                price="$49.99"
                onPress={() => this.toggleSubscriptionSelected('quarterly')}
                active={subscriptionSelected === 'quarterly'}
              />
              <SubscriptionTile
                title="Yearly"
                price="$99.99"
                onPress={() => this.toggleSubscriptionSelected('yearly')}
                active={subscriptionSelected === 'yearly'}
              />
            </View>
            <View style={styles.disclaimerTextContainer}>
              {
                subscriptionSelected !== '' && (
                  <View>
                    <Text style={styles.disclaimerText}>
                      A {priceMap[subscriptionSelected]} {subscriptionSelected} purchase will be applied to your iTunes account at the end of your 7-day free trial.
                    </Text>
                    <Text style={styles.disclaimerText}>
                      Subscriptions will automatically renew unless canceled within 24-hours before the end of the current period. You can cancel anytime with your iTunes account settings. Any unused portion of a free trial will be forfeited if you purchase a subscription.
                    </Text>
                    <Text style={styles.disclaimerText}>
                      For more information, see our [link to ToS] and [link to Privacy Policy].
                    </Text>
                  </View>
                  )
              }
            </View>
          </View>
          <CustomButton
            title="CONTINUE"
            onPress={() => console.log('next')}
            primary
          />
          <Loader
            loading={loading}
            color={colors.coral.standard}
          />
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
    alignItems: 'center',
  },
  flexContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.offWhite,
    paddingBottom: 10,
  },
  headerContainer: {
    width,
    padding: 10,
    paddingTop: 15,
  },
  headerText: {
    fontFamily: fonts.bold,
    fontSize: 28,
    color: colors.charcoal.light,
    marginBottom: 10,
  },
  subHeadingText: {
    fontFamily: fonts.standard,
    fontSize: 16,
    color: colors.charcoal.light,
    marginLeft: 3,
  },
  contentContainer: {
    width,
  },
  subscriptionTileRow: {
    flexDirection: 'row',
    paddingLeft: 5,
    paddingRight: 5,
  },
  disclaimerTextContainer: {
    height: 200,
    padding: 20,
  },
  disclaimerText: {
    fontFamily: fonts.standard,
    fontSize: 14,
    marginBottom: 15,
  },
});

import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  SectionList,
  Alert,
  Dimensions,
  Linking,
} from 'react-native';
import { Button } from 'react-native-elements';
import * as Permissions from 'expo-permissions';
import * as MailComposer from 'expo-mail-composer';
import * as SMS from 'expo-sms';
import * as Contacts from 'expo-contacts';
import * as Haptics from 'expo-haptics';
import groupBy from 'lodash.groupby';
// import appsFlyer from 'react-native-appsflyer';
import ContactRow from './ContactRow';
import Loader from '../../components/Shared/Loader';
import CustomButton from '../../components/Shared/CustomButton';
import fonts from '../../styles/fonts';
import colors from '../../styles/colors';

const { width } = Dimensions.get('window');

function useContacts() {
  const [contacts, setContacts] = React.useState({
    loading: true,
    error: null,
    data: [],
  });
  React.useEffect(() => {
    const fetchContacts = async () => {
      try {
        const { status } = await Permissions.getAsync(Permissions.CONTACTS);
        if (status !== Permissions.PermissionStatus.GRANTED) {
          // TODO: Handle permissions denied.
          await Permissions.askAsync(Permissions.CONTACTS);
        }
        const data = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.Emails, Contacts.Fields.PhoneNumbers],
        });
        setContacts((state) => ({
          loading: false,
          error: null,
          data: state.data.concat(data.data),
        }));
      } catch (ex) {
        setContacts({
          loading: false,
          error: ex,
          data: [],
        });
      }
    };
    fetchContacts();
  }, []);
  return contacts;
}

export default function InviteFriends({ recordInvites }) {
  const contacts = useContacts();

  const [selectedContacts, setSelectedContacts] = React.useState([]);
  const sections = React.useMemo(() => {
    return Object.entries(groupBy(
      // Create one contact per phone number and email.
      contacts.data.reduce(
        (res, cur) => {
          if (cur.phoneNumbers != null) {
            cur.phoneNumbers.forEach((p) => {
              res.push({
                id: cur.id + p.number,
                name: cur.name || '',
                phoneNumber: p.number,
              });
            });
          }
          if (cur.emails != null) {
            cur.emails.forEach((e) => {
              res.push({
                id: cur.id + e.email,
                name: cur.name || '',
                email: e.email,
              });
            });
          }
          return res;
        },
        [],
      ),
      (c) => {
        const firstChar = (c.name.charAt(0) || '#').toLowerCase();
        return firstChar.match(/[a-z]/) ? firstChar : '#';
      },
    ))
      .map(([key, value]) => ({
        key,
        data: value.sort((a, b) => ((a.name || a.name || '') < (b.name || b.name || '') ? -1 : 1)),
      }))
      .sort((a, b) => (a.key < b.key ? -1 : 1));
  }, [contacts.data]);

  const onInvitePress = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    let didShare = false;
    let inviteCount = 0;
    const appStoreLink = 'https://apps.apple.com/au/app/fitazfk-fitness-nutrition/id1438373600';
    appStoreLink.link('https://apps.apple.com/au/app/fitazfk-fitness-nutrition/id1438373600');
    const message = `I thought you might like this app, take a look!\n\n${appStoreLink}`;
    const emails = selectedContacts
      .filter((c) => c.email != null)
      .map((c) => c.email);
    const phoneNumbers = selectedContacts
      .filter((c) => c.phoneNumber != null)
      .map((c) => c.phoneNumber);
    if (emails.length > 0) {
      try {
        const result = await MailComposer.composeAsync({
          recipients: emails,
          subject: 'FitazFK Fitness & Nutrition on the App Store',
          body: message,
          isHtml: false,
        });
        didShare = didShare || result.status === 'sent';
        if (result.status === 'sent') {
          inviteCount = emails.length;
        }
      } catch (ex) {
        Alert.alert(ex.message);
      }
    }
    if (phoneNumbers.length > 0 && (await SMS.isAvailableAsync())) {
      try {
        const result = await SMS.sendSMSAsync(phoneNumbers, message);
        didShare = didShare || result.result === 'sent';
        if (result.result === 'sent') {
          inviteCount += phoneNumbers.length;
        }
      } catch (ex) {
        Alert.alert(ex.message);
      }
    }
    if (didShare) {
      Alert.alert('', 'Thanks for sharing!');
      recordInvites(inviteCount);
      // appsFlyer.trackEvent('invite_friends', { invite_count: inviteCount });
    }
  };

  if (contacts.error != null) {
    if (contacts.error.code === 'E_MISSING_PERMISSION') {
      return (
        <View style={styles.permissionsContainer}>
          <Text style={styles.permissionsText}>To continue, FitazFK needs permission to access your contacts</Text>
          <Button
            title="OPEN SETTINGS"
            buttonStyle={styles.settingsButton}
            titleStyle={styles.settingsButtonTitle}
            onPress={() => Linking.openURL('app-settings:')}
          />
        </View>
      );
    }
    return <Text>Could not load contacts: {contacts.error.message}</Text>;
  }
  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.screenContainer}>
        <SectionList
          ref={(s) => this.sectionList = s}
          keyExtractor={(item, index) => item + index}
          sections={sections}
          renderSectionHeader={({ section }) => (
            <Text style={styles.sectionHeaderText}>
              {section.key.toUpperCase()}
            </Text>
          )}
          renderItem={({ item }) => {
            const selectedIndex = selectedContacts.findIndex((i) => i.id === item.id);
            const onPress = () => {
              Haptics.selectionAsync();
              const newContacts = [...selectedContacts];
              if (selectedIndex >= 0) {
                newContacts.splice(selectedIndex, 1);
              } else {
                newContacts.push(item);
              }
              setSelectedContacts(newContacts);
            };
            return (
              <ContactRow
                name={item.name}
                emailOrNumber={(item.email || item.phoneNumber)}
                selected={selectedIndex >= 0}
                onPress={onPress}
              />
            );
          }}
          extraData={selectedContacts}
          contentContainerStyle={styles.sectionList}
        />
        <View style={styles.buttonContainer}>
          <CustomButton
            title={`INVITE (${selectedContacts.length})`}
            onPress={onInvitePress}
            disabled={selectedContacts.length === 0}
            green
          />
        </View>
        <Loader
          loading={contacts.loading}
          color={colors.charcoal.standard}
        />
      </View>
    </SafeAreaView>
  );
}

InviteFriends.propTypes = {
  recordInvites: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: colors.black,
  },
  screenContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  sectionList: {
    paddingBottom: 104,
  },
  sectionHeaderText: {
    fontFamily: fonts.standardNarrow,
    backgroundColor: colors.grey.light,
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 3,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 10,
    alignItems: 'center',
    width,
  },
  permissionsContainer: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  permissionsText: {
    fontFamily: fonts.standardNarrow,
    padding: 20,
    textAlign: 'center',
  },
  settingsButton: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 45,
    borderRadius: 4,
    shadowOpacity: 0.8,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 2,
    backgroundColor: colors.green.forest,
  },
  settingsButtonTitle: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.white,
    marginTop: 3,
    marginLeft: 10,
    marginRight: 10,
  },
});

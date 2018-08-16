import React from 'react';
import { StyleSheet, View, Text, AsyncStorage, Dimensions, Button } from 'react-native';
import { FormInput } from 'react-native-elements';
import { db } from '../../../../config/firebase';
import Loader from '../../../components/Loader';
import colors from '../../../styles/colors';
import fonts from '../../../styles/fonts';

const { width } = Dimensions.get('window');

export default class EditProfileScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      firstName: '',
      lastName: '',
      email: '',
      dob: '',
    };
  }
  componentDidMount() {
    this.fetchProfile();
  }
  updateProfile = async () => {
    const uid = await AsyncStorage.getItem('uid');
    const {
      firstName,
      lastName,
      email,
      dob,
    } = this.state;
    db.collection('users').doc(uid)
      .set({
        firstName,
        lastName,
        email,
        dob,
      }, { merge: true });
  }
  fetchProfile = async () => {
    this.setState({ loading: true });
    const uid = await AsyncStorage.getItem('uid');
    db.collection('users').doc(uid)
      .onSnapshot(async (doc) => {
        if (doc.exists) {
          this.setState({
            firstName: await doc.data().firstName,
            lastName: await doc.data().lastName,
            email: await doc.data().email,
            dob: await doc.data().dob,
            loading: false,
          });
        } else {
          this.setState({ loading: false });
        }
      });
  }
  render() {
    const {
      loading,
      firstName,
      lastName,
      email,
      dob,
    } = this.state;
    if (loading) {
      return (
        <Loader
          loading={loading}
          color={colors.blue.standard}
        />
      );
    }
    return (
      <View style={styles.container}>
        <View style={styles.fieldRow}>
          <View style={styles.fieldNameContainer}>
            <Text style={styles.fieldNameText}>
              First Name
            </Text>
          </View>
          <View>
            <FormInput
              inputStyle={styles.input}
              onChangeText={(text) => this.setState({ firstName: text })}
              value={firstName}
            />
          </View>
        </View>
        <View style={styles.fieldRow}>
          <View style={styles.fieldNameContainer}>
            <Text style={styles.fieldNameText}>
              Last Name
            </Text>
          </View>
          <View>
            <FormInput
              inputStyle={styles.input}
              onChangeText={(text) => this.setState({ lastName: text })}
              value={lastName}
            />
          </View>
        </View>
        <View style={styles.fieldRow}>
          <View style={styles.fieldNameContainer}>
            <Text style={styles.fieldNameText}>
              Email
            </Text>
          </View>
          <View>
            <FormInput
              inputStyle={styles.input}
              onChangeText={(text) => this.setState({ email: text })}
              value={email}
            />
          </View>
        </View>
        <View style={styles.fieldRow}>
          <View style={styles.fieldNameContainer}>
            <Text style={styles.fieldNameText}>
              DOB
            </Text>
          </View>
          <View>
            <FormInput
              inputStyle={styles.input}
              onChangeText={(text) => this.setState({ dob: text })}
              value={dob}
            />
          </View>
        </View>
        <Button
          title="Save"
          onPress={() => this.updateProfile()}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fieldRow: {
    flexDirection: 'row',
    width,
  },
  fieldNameContainer: {
    marginLeft: 15,
    justifyContent: 'center',
    width: 80,
  },
  fieldNameText: {
    fontSize: 14,
    fontFamily: fonts.standard,
  },
  input: {
    width: width - 80,
    paddingTop: 10,
    paddingBottom: 12,
    fontSize: 14,
    fontFamily: fonts.standard,
    color: colors.charcoal.standard,
  },
});

import React from 'react';
import { View, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import FastImage from 'react-native-fast-image';
import Icon from '../Shared/Icon';
import { db } from '../../../config/firebase';
import colors from '../../styles/colors';

export default class ProfileButton extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      avatar: undefined,
    };
  }
  componentDidMount = async () => {
    const uid = await AsyncStorage.getItem('uid');
    this.unsubscribe = await db.collection('users').doc(uid)
      .onSnapshot(async (doc) => {
        this.setState({ avatar: await doc.data().avatar || undefined });
      });
  }
  componentWillUnmount = () => {
    this.unsubscribe();
  }
  render() {
    const { avatar } = this.state;
    return (
      <View>
        {
          avatar !== undefined ? (
            <View style={styles.avatarOutline}>
              <View style={styles.avatarBackdrop}>
                <FastImage
                  style={styles.image}
                  source={{ uri: avatar }}
                />
              </View>
            </View>
          ) : (
            <Icon
              name="profile-solid"
              size={30}
              color={colors.white}
            />
          )
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  avatarOutline: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.white,
  },
  avatarBackdrop: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.grey.standard,
  },
  image: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
});

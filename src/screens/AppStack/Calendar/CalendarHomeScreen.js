import React from 'react';
import { StyleSheet, View, AsyncStorage, ActivityIndicator } from 'react-native';
import CalendarStrip from 'react-native-calendar-strip';
import { db } from '../../../../config/firebase';
import CalendarTile from '../../../components/CalendarTile';
import Icon from '../../../components/Icon';
import colors from '../../../styles/colors';
import fonts from '../../../styles/fonts';

export default class CalendarHomeScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      workout: undefined,
      breakfast: undefined,
      lunch: undefined,
      dinner: undefined,
      snack: undefined,
      loading: false,
    };
    this.calendarStrip = React.createRef();
  }
  componentDidMount = async () => {
    this.setState({ loading: true });
    const uid = await AsyncStorage.getItem('uid');
    const stringDate = this.calendarStrip.current.getSelectedDate().format('YYYY-MM-DD').toString();
    await db.collection('users').doc(uid)
      .collection('calendarEntries').doc(stringDate)
      .get()
      .then(async (doc) => {
        if (doc.exists) {
          this.setState({
            workout: await doc.data().workout,
            breakfast: await doc.data().breakfast,
            lunch: await doc.data().lunch,
            dinner: await doc.data().dinner,
            snack: await doc.data().snack,
            loading: false,
          });
        } else {
          this.setState({ loading: false });
        }
      });
  }
  handleDateSelected = async (date) => {
    this.setState({ loading: true });
    const uid = await AsyncStorage.getItem('uid');
    const stringDate = date.format('YYYY-MM-DD').toString();
    await db.collection('users').doc(uid)
      .collection('calendarEntries').doc(stringDate)
      .get()
      .then(async (doc) => {
        if (doc.exists) {
          this.setState({
            workout: await doc.data().workout,
            breakfast: await doc.data().breakfast,
            lunch: await doc.data().lunch,
            dinner: await doc.data().dinner,
            snack: await doc.data().snack,
            loading: false,
          });
        } else {
          this.setState({
            workout: undefined,
            breakfast: undefined,
            lunch: undefined,
            dinner: undefined,
            snack: undefined,
            loading: false,
          });
        }
      });
  }
  render() {
    const { loading } = this.state;
    return (
      <View style={styles.container}>
        <CalendarStrip
          ref={this.calendarStrip}
          onDateSelected={(date) => this.handleDateSelected(date)}
          calendarAnimation={{
            type: 'parallel',
            duration: 500,
          }}
          daySelectionAnimation={{
            type: 'background',
            duration: 400,
            highlightColor: colors.green.standard,
          }}
          style={{
            height: 90,
            paddingTop: 10,
            paddingBottom: 20,
          }}
          calendarHeaderStyle={{
            fontFamily: fonts.bold,
            color: colors.white,
            marginTop: 0,
            marginBottom: 15,
          }}
          calendarColor={colors.green.dark}
          dateNumberStyle={{
            fontFamily: fonts.bold,
            color: colors.white,
          }}
          dateNameStyle={{
            fontFamily: fonts.bold,
            color: colors.white,
          }}
          highlightDateNumberStyle={{
            fontFamily: fonts.bold,
            color: colors.charcoal.dark,
          }}
          highlightDateNameStyle={{
            fontFamily: fonts.bold,
            color: colors.charcoal.dark,
          }}
          weekendDateNameStyle={{
            fontFamily: fonts.bold,
            color: colors.grey.standard,
          }}
          weekendDateNumberStyle={{
            fontFamily: fonts.bold,
            color: colors.grey.standard,
          }}
          iconContainer={{
            flex: 0.15,
          }}
          leftSelector={<Icon name="chevron-left" size={20} color={colors.charcoal.standard} />}
          rightSelector={<Icon name="chevron-right" size={20} color={colors.charcoal.standard} />}
        />
        {
          loading ?
            (
              <View
                style={{
                  flexGrow: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ActivityIndicator
                  size="large"
                />
              </View>
            ) : (
              <View
                style={{
                  flexGrow: 1,
                }}
              >
                <CalendarTile entry={this.state.workout} />
                <CalendarTile entry={this.state.breakfast} />
                <CalendarTile entry={this.state.lunch} />
                <CalendarTile entry={this.state.dinner} />
                <CalendarTile entry={this.state.snack} />
              </View>
            )
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
});

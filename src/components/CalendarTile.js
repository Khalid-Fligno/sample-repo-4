import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import PropTypes from 'prop-types';
// import colors from '../styles/colors';

const CalendarTile = ({
  entry,
}) => (
  <View style={styles.container}>
    {
      entry ?
        <Text>{entry}</Text> :
        <Text>No entries</Text>
    }
  </View>
);

CalendarTile.propTypes = {
  entry: PropTypes.string,
};

CalendarTile.defaultProps = {
  entry: PropTypes.undefined,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'grey',
    margin: 5,
  },
});

export default CalendarTile;

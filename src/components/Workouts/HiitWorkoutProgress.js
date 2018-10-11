import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import PropTypes from 'prop-types';
import { PieChart } from 'react-native-svg-charts';
import Icon from '../Icon';
import colors from '../../styles/colors';
import fonts from '../../styles/fonts';

const pieDataIncomplete = [0, 100]
  .map((value, index) => ({
    value,
    svg: {
      fill: index === 0 ? colors.coral.standard : colors.grey.light,
    },
    key: `pie-${index}`,
  }));

const pieDataSetHalf = [50, 50]
  .map((value, index) => ({
    value,
    svg: {
      fill: index === 0 ? colors.grey.light : colors.coral.standard,
    },
    key: `pie-${index}`,
  }));

const pieDataComplete = [100, 0]
  .map((value, index) => ({
    value,
    svg: {
      fill: colors.coral.standard,
    },
    key: `pie-${index}`,
  }));

class HiitWorkoutProgress extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  render() {
    const { currentRound, rest } = this.props;
    const completePieChart = (
      <PieChart
        style={styles.pieChart}
        data={pieDataComplete}
        innerRadius="80%"
      />
    );
    const tickIcon = (
      <View style={styles.invisibleView}>
        <View style={styles.tickContainer}>
          <Icon
            name="tick-heavy"
            color={colors.charcoal.dark}
            size={18}
          />
        </View>
      </View>
    );
    const currentRoundText = (text) => (
      <View style={styles.invisibleView}>
        <View style={styles.currentRoundTextContainer}>
          <Text style={styles.currentRoundText}>
            {text}
          </Text>
        </View>
      </View>
    );
    const currentRoundPieChart = (resting) => (
      <PieChart
        style={styles.pieChart}
        data={resting ? pieDataSetHalf : pieDataIncomplete}
        innerRadius="80%"
        startAngle={Math.PI * 2}
        endAngle={0}
      />
    );
    const incompletePieChart = (
      <PieChart
        style={styles.pieChart}
        data={pieDataIncomplete}
        innerRadius="80%"
      />
    );
    const inactiveRoundText = (text) => (
      <View style={styles.invisibleView}>
        <View style={styles.inactiveRoundTextContainer}>
          <Text style={styles.inactiveRoundText}>
            {text}
          </Text>
        </View>
      </View>
    );
    return (
      <View style={styles.container}>
        <View style={styles.exercise}>
          {currentRound > 1 && completePieChart}
          {currentRound > 1 && tickIcon}
          {currentRound === 1 && currentRoundPieChart(rest)}
          {currentRound === 1 && currentRoundText(currentRound)}
        </View>
        <View style={styles.exercise}>
          {currentRound > 2 && completePieChart}
          {currentRound > 2 && tickIcon}
          {currentRound === 2 && currentRoundPieChart(rest)}
          {currentRound === 2 && currentRoundText(currentRound)}
          {currentRound < 2 && incompletePieChart}
          {currentRound < 2 && inactiveRoundText(2)}
        </View>
        <View style={styles.exercise}>
          {currentRound > 3 && completePieChart}
          {currentRound > 3 && tickIcon}
          {currentRound === 3 && currentRoundPieChart(rest)}
          {currentRound === 3 && currentRoundText(currentRound)}
          {currentRound < 3 && incompletePieChart}
          {currentRound < 3 && inactiveRoundText(3)}
        </View>
        <View style={styles.exercise}>
          {currentRound > 4 && completePieChart}
          {currentRound > 4 && tickIcon}
          {currentRound === 4 && currentRoundPieChart(rest)}
          {currentRound === 4 && currentRoundText(currentRound)}
          {currentRound < 4 && incompletePieChart}
          {currentRound < 4 && inactiveRoundText(4)}
        </View>
        <View style={styles.exercise}>
          {currentRound > 5 && completePieChart}
          {currentRound > 5 && tickIcon}
          {currentRound === 5 && currentRoundPieChart(rest)}
          {currentRound === 5 && currentRoundText(currentRound)}
          {currentRound < 5 && incompletePieChart}
          {currentRound < 5 && inactiveRoundText(5)}
        </View>
        <View style={styles.exercise}>
          {currentRound > 6 && completePieChart}
          {currentRound > 6 && tickIcon}
          {currentRound === 6 && currentRoundPieChart(rest)}
          {currentRound === 6 && currentRoundText(currentRound)}
          {currentRound < 6 && incompletePieChart}
          {currentRound < 6 && inactiveRoundText(6)}
        </View>
        <View style={styles.exercise}>
          {currentRound > 7 && completePieChart}
          {currentRound > 7 && tickIcon}
          {currentRound === 7 && currentRoundPieChart(rest)}
          {currentRound === 7 && currentRoundText(currentRound)}
          {currentRound < 7 && incompletePieChart}
          {currentRound < 7 && inactiveRoundText(7)}
        </View>
        <View style={styles.exercise}>
          {currentRound > 8 && completePieChart}
          {currentRound > 8 && tickIcon}
          {currentRound === 8 && currentRoundPieChart(rest)}
          {currentRound === 8 && currentRoundText(currentRound)}
          {currentRound < 8 && incompletePieChart}
          {currentRound < 8 && inactiveRoundText(8)}
        </View>
      </View>
    );
  }
}

HiitWorkoutProgress.propTypes = {
  currentRound: PropTypes.number.isRequired,
  rest: PropTypes.bool,
};

HiitWorkoutProgress.defaultProps = {
  rest: false,
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 35,
    paddingLeft: 10,
    paddingRight: 10,
    marginTop: 10,
    marginBottom: 10,
  },
  exercise: {
    flex: 1,
    paddingLeft: 5,
    paddingRight: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pieChart: {
    height: 35,
    width: 35,
  },
  invisibleView: {
    height: 0,
  },
  tickContainer: {
    marginTop: -26,
  },
  currentRoundTextContainer: {
    marginTop: -26,
  },
  currentRoundText: {
    fontFamily: fonts.bold,
    fontSize: 18,
    color: colors.charcoal.dark,
  },
  inactiveRoundTextContainer: {
    marginTop: -26,
  },
  inactiveRoundText: {
    fontFamily: fonts.bold,
    fontSize: 18,
    color: colors.grey.light,
  },
});

export default HiitWorkoutProgress;

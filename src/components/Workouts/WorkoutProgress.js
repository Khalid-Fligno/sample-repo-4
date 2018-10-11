import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import PropTypes from 'prop-types';
import { PieChart } from 'react-native-svg-charts';
import Icon from '../Shared/Icon';
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

const pieDataSet1 = [33, 67]
  .map((value, index) => ({
    value,
    svg: {
      fill: index === 0 ? colors.coral.standard : colors.grey.light,
    },
    key: `pie-${index}`,
  }));

const pieDataSet2 = [33, 34, 33]
  .map((value, index) => ({
    value,
    svg: {
      fill: index === 1 ? colors.grey.light : colors.coral.standard,
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

const pieDataMap = {
  1: pieDataIncomplete,
  2: pieDataSet1,
  3: pieDataSet2,
};

class WorkoutProgress extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  render() {
    const { currentExercise, currentSet } = this.props;
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
            size={22}
          />
        </View>
      </View>
    );
    const currentPieChart = (set) => (
      <PieChart
        style={styles.pieChart}
        data={pieDataMap[set]}
        innerRadius="80%"
        startAngle={Math.PI * 2}
        endAngle={0}
      />
    );
    const currentSetText = (text) => (
      <View style={styles.invisibleView}>
        <View style={styles.currentSetTextContainer}>
          <Text style={styles.currentSetText}>
            {text}
          </Text>
        </View>
      </View>
    );
    const incompletePieChart = (
      <PieChart
        style={styles.pieChart}
        data={pieDataIncomplete}
        innerRadius="80%"
      />
    );
    return (
      <View style={styles.container}>
        <View style={styles.exercise}>
          {currentExercise > 1 && completePieChart}
          {currentExercise > 1 && tickIcon}
          {currentExercise === 1 && currentPieChart(currentSet)}
          {currentExercise === 1 && currentSetText(currentSet)}
        </View>
        <View style={styles.exercise}>
          {currentExercise > 2 && completePieChart}
          {currentExercise > 2 && tickIcon}
          {currentExercise === 2 && currentPieChart(currentSet)}
          {currentExercise === 2 && currentSetText(currentSet)}
          {currentExercise < 2 && incompletePieChart}
        </View>
        <View style={styles.exercise}>
          {currentExercise > 3 && completePieChart}
          {currentExercise > 3 && tickIcon}
          {currentExercise === 3 && currentPieChart(currentSet)}
          {currentExercise === 3 && currentSetText(currentSet)}
          {currentExercise < 3 && incompletePieChart}
        </View>
        <View style={styles.exercise}>
          {currentExercise > 4 && completePieChart}
          {currentExercise > 4 && tickIcon}
          {currentExercise === 4 && currentPieChart(currentSet)}
          {currentExercise === 4 && currentSetText(currentSet)}
          {currentExercise < 4 && incompletePieChart}
        </View>
        <View style={styles.exercise}>
          {currentExercise > 5 && completePieChart}
          {currentExercise > 5 && tickIcon}
          {currentExercise === 5 && currentPieChart(currentSet)}
          {currentExercise === 5 && currentSetText(currentSet)}
          {currentExercise < 5 && incompletePieChart}
        </View>
        <View style={styles.exercise}>
          {currentExercise > 6 && completePieChart}
          {currentExercise > 6 && tickIcon}
          {currentExercise === 6 && currentPieChart(currentSet)}
          {currentExercise === 6 && currentSetText(currentSet)}
          {currentExercise < 6 && incompletePieChart}
        </View>
      </View>
    );
  }
}

WorkoutProgress.propTypes = {
  currentExercise: PropTypes.number.isRequired,
  currentSet: PropTypes.number.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 48,
    paddingLeft: 10,
    paddingRight: 10,
  },
  exercise: {
    flex: 1,
    paddingLeft: 5,
    paddingRight: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pieChart: {
    height: 48,
    width: 48,
  },
  invisibleView: {
    height: 0,
  },
  tickContainer: {
    marginTop: -36,
  },
  currentSetTextContainer: {
    marginTop: -36,
  },
  currentSetText: {
    fontFamily: fonts.bold,
    fontSize: 24,
    color: colors.charcoal.dark,
  },
});

export default WorkoutProgress;

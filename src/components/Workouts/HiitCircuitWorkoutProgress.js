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
  1: pieDataSet1,
  2: pieDataSet2,
  3: pieDataComplete,
};

const nonCurrentPieDataSet1 = [33, 67]
  .map((value, index) => ({
    value,
    svg: {
      fill: index === 0 ? colors.grey.standard : colors.grey.light,
    },
    key: `pie-${index}`,
  }));

const nonCurrentPieDataSet2 = [33, 34, 33]
  .map((value, index) => ({
    value,
    svg: {
      fill: index === 1 ? colors.grey.light : colors.grey.standard,
    },
    key: `pie-${index}`,
  }));

const nonCurrentPieDataMap = {
  1: nonCurrentPieDataSet1,
  2: nonCurrentPieDataSet2,
};

class HiitCircuitWorkoutProgress extends React.PureComponent {
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
    const nonCurrentPieChart = (set) => (
      <PieChart
        style={styles.pieChart}
        data={nonCurrentPieDataMap[set]}
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
    const nonCurrentSetText = (text) => (
      <View style={styles.invisibleView}>
        <View style={styles.currentSetTextContainer}>
          <Text style={styles.nonCurrentSetText}>
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
          {currentSet === 1 && currentExercise === 1 && currentPieChart(1)}
          {currentSet === 1 && currentExercise === 1 && currentSetText(1)}
          {currentSet === 1 && currentExercise > 1 && nonCurrentPieChart(1)}
          {currentSet === 1 && currentExercise > 1 && nonCurrentSetText(1)}

          {currentSet === 2 && currentExercise === 1 && currentPieChart(2)}
          {currentSet === 2 && currentExercise === 1 && currentSetText(2)}
          {currentSet === 2 && currentExercise > 1 && nonCurrentPieChart(2)}
          {currentSet === 2 && currentExercise > 1 && nonCurrentSetText(2)}

          {currentSet === 3 && currentExercise === 1 && currentPieChart(3)}
          {currentSet === 3 && currentExercise === 1 && currentSetText(3)}
          {currentSet === 3 && currentExercise > 1 && completePieChart}
          {currentSet === 3 && currentExercise > 1 && tickIcon}
        </View>
        <View style={styles.exercise}>
          {currentSet === 1 && currentExercise < 2 && incompletePieChart}
          {currentSet === 1 && currentExercise === 2 && currentPieChart(1)}
          {currentSet === 1 && currentExercise === 2 && currentSetText(1)}
          {currentSet === 1 && currentExercise > 2 && nonCurrentPieChart(1)}
          {currentSet === 1 && currentExercise > 2 && nonCurrentSetText(1)}

          {currentSet === 2 && currentExercise < 2 && nonCurrentPieChart(1)}
          {currentSet === 2 && currentExercise < 2 && nonCurrentSetText(1)}
          {currentSet === 2 && currentExercise === 2 && currentPieChart(2)}
          {currentSet === 2 && currentExercise === 2 && currentSetText(2)}
          {currentSet === 2 && currentExercise > 2 && nonCurrentPieChart(2)}
          {currentSet === 2 && currentExercise > 2 && nonCurrentSetText(2)}

          {currentSet === 3 && currentExercise < 2 && nonCurrentPieChart(2)}
          {currentSet === 3 && currentExercise < 2 && nonCurrentSetText(2)}
          {currentSet === 3 && currentExercise === 2 && currentPieChart(3)}
          {currentSet === 3 && currentExercise === 2 && currentSetText(3)}
          {currentSet === 3 && currentExercise > 2 && completePieChart}
          {currentSet === 3 && currentExercise > 2 && tickIcon}
        </View>
        <View style={styles.exercise}>
          {currentSet === 1 && currentExercise < 3 && incompletePieChart}
          {currentSet === 1 && currentExercise === 3 && currentPieChart(1)}
          {currentSet === 1 && currentExercise === 3 && currentSetText(1)}
          {currentSet === 1 && currentExercise > 3 && nonCurrentPieChart(1)}
          {currentSet === 1 && currentExercise > 3 && nonCurrentSetText(1)}

          {currentSet === 2 && currentExercise < 3 && nonCurrentPieChart(1)}
          {currentSet === 2 && currentExercise < 3 && nonCurrentSetText(1)}
          {currentSet === 2 && currentExercise === 3 && currentPieChart(2)}
          {currentSet === 2 && currentExercise === 3 && currentSetText(2)}
          {currentSet === 2 && currentExercise > 3 && nonCurrentPieChart(2)}
          {currentSet === 2 && currentExercise > 3 && nonCurrentSetText(2)}

          {currentSet === 3 && currentExercise < 3 && nonCurrentPieChart(2)}
          {currentSet === 3 && currentExercise < 3 && nonCurrentSetText(2)}
          {currentSet === 3 && currentExercise === 3 && currentPieChart(3)}
          {currentSet === 3 && currentExercise === 3 && currentSetText(3)}
          {currentSet === 3 && currentExercise > 3 && completePieChart}
          {currentSet === 3 && currentExercise > 3 && tickIcon}
        </View>
        <View style={styles.exercise}>
          {currentSet === 1 && currentExercise < 4 && incompletePieChart}
          {currentSet === 1 && currentExercise === 4 && currentPieChart(1)}
          {currentSet === 1 && currentExercise === 4 && currentSetText(1)}
          {currentSet === 1 && currentExercise > 4 && nonCurrentPieChart(1)}
          {currentSet === 1 && currentExercise > 4 && nonCurrentSetText(1)}

          {currentSet === 2 && currentExercise < 4 && nonCurrentPieChart(1)}
          {currentSet === 2 && currentExercise < 4 && nonCurrentSetText(1)}
          {currentSet === 2 && currentExercise === 4 && currentPieChart(2)}
          {currentSet === 2 && currentExercise === 4 && currentSetText(2)}
          {currentSet === 2 && currentExercise > 4 && nonCurrentPieChart(2)}
          {currentSet === 2 && currentExercise > 4 && nonCurrentSetText(2)}

          {currentSet === 3 && currentExercise < 4 && nonCurrentPieChart(2)}
          {currentSet === 3 && currentExercise < 4 && nonCurrentSetText(2)}
          {currentSet === 3 && currentExercise === 4 && currentPieChart(3)}
          {currentSet === 3 && currentExercise === 4 && currentSetText(3)}
          {currentSet === 3 && currentExercise > 4 && completePieChart}
          {currentSet === 3 && currentExercise > 4 && tickIcon}
        </View>
        <View style={styles.exercise}>
          {currentSet === 1 && currentExercise < 5 && incompletePieChart}
          {currentSet === 1 && currentExercise === 5 && currentPieChart(1)}
          {currentSet === 1 && currentExercise === 5 && currentSetText(1)}
          {currentSet === 1 && currentExercise > 5 && nonCurrentPieChart(1)}
          {currentSet === 1 && currentExercise > 5 && nonCurrentSetText(1)}

          {currentSet === 2 && currentExercise < 5 && nonCurrentPieChart(1)}
          {currentSet === 2 && currentExercise < 5 && nonCurrentSetText(1)}
          {currentSet === 2 && currentExercise === 5 && currentPieChart(2)}
          {currentSet === 2 && currentExercise === 5 && currentSetText(2)}
          {currentSet === 2 && currentExercise > 5 && nonCurrentPieChart(2)}
          {currentSet === 2 && currentExercise > 5 && nonCurrentSetText(2)}

          {currentSet === 3 && currentExercise < 5 && nonCurrentPieChart(2)}
          {currentSet === 3 && currentExercise < 5 && nonCurrentSetText(2)}
          {currentSet === 3 && currentExercise === 5 && currentPieChart(3)}
          {currentSet === 3 && currentExercise === 5 && currentSetText(3)}
          {currentSet === 3 && currentExercise > 5 && completePieChart}
          {currentSet === 3 && currentExercise > 5 && tickIcon}
        </View>
        <View style={styles.exercise}>
          {currentSet === 1 && currentExercise < 6 && incompletePieChart}
          {currentSet === 1 && currentExercise === 6 && currentPieChart(1)}
          {currentSet === 1 && currentExercise === 6 && currentSetText(1)}
          {currentSet === 1 && currentExercise > 6 && nonCurrentPieChart(1)}
          {currentSet === 1 && currentExercise > 6 && nonCurrentSetText(1)}

          {currentSet === 2 && currentExercise < 6 && nonCurrentPieChart(1)}
          {currentSet === 2 && currentExercise < 6 && nonCurrentSetText(1)}
          {currentSet === 2 && currentExercise === 6 && currentPieChart(2)}
          {currentSet === 2 && currentExercise === 6 && currentSetText(2)}
          {currentSet === 2 && currentExercise > 6 && nonCurrentPieChart(2)}
          {currentSet === 2 && currentExercise > 6 && nonCurrentSetText(2)}

          {currentSet === 3 && currentExercise < 6 && nonCurrentPieChart(2)}
          {currentSet === 3 && currentExercise < 6 && nonCurrentSetText(2)}
          {currentSet === 3 && currentExercise === 6 && currentPieChart(3)}
          {currentSet === 3 && currentExercise === 6 && currentSetText(3)}
        </View>
      </View>
    );
  }
}

HiitCircuitWorkoutProgress.propTypes = {
  currentExercise: PropTypes.number.isRequired,
  currentSet: PropTypes.number.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 48,
    paddingLeft: 5,
    paddingRight: 5,
    backgroundColor: colors.white,
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
  nonCurrentSetText: {
    fontFamily: fonts.bold,
    fontSize: 24,
    color: colors.grey.standard,
  },
});

export default HiitCircuitWorkoutProgress;

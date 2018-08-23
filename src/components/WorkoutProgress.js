import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import PropTypes from 'prop-types';
import { PieChart } from 'react-native-svg-charts';
import Icon from '../components/Icon';
import colors from '../styles/colors';
import fonts from '../styles/fonts';

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

const WorkoutProgress = ({
  currentExercise,
  currentSet,
}) => (
  <View style={styles.container}>
    <View style={styles.exercise}>
      {
        currentExercise > 1 && (
          <PieChart
            style={styles.pieChart}
            data={pieDataComplete}
            innerRadius="80%"
          />
        )
      }
      {
        currentExercise > 1 && (
          <View style={styles.invisibleView}>
            <View style={styles.tickContainer}>
              <Icon
                name="tick-heavy"
                color={colors.charcoal.dark}
                size={24}
              />
            </View>
          </View>
        )
      }
      {
        currentExercise === 1 && (
          <PieChart
            style={styles.pieChart}
            data={pieDataMap[currentSet]}
            innerRadius="80%"
            startAngle={Math.PI * 2}
            endAngle={0}
          />
        )
      }
      {
        currentExercise === 1 && (
          <View style={styles.invisibleView}>
            <View style={styles.currentSetTextContainer}>
              <Text style={styles.currentSetText}>
                {currentSet}
              </Text>
            </View>
          </View>
        )
      }
    </View>
    <View style={styles.exercise}>
      {
        currentExercise > 2 && (
          <PieChart
            style={styles.pieChart}
            data={pieDataComplete}
            innerRadius="80%"
          />
        )
      }
      {
        currentExercise > 2 && (
          <View style={styles.invisibleView}>
            <View style={styles.tickContainer}>
              <Icon
                name="tick-heavy"
                color={colors.charcoal.dark}
                size={24}
              />
            </View>
          </View>
        )
      }
      {
        currentExercise === 2 && (
          <PieChart
            style={styles.pieChart}
            data={pieDataMap[currentSet]}
            innerRadius="80%"
            startAngle={Math.PI * 2}
            endAngle={0}
          />
        )
      }
      {
        currentExercise === 2 && (
          <View style={styles.invisibleView}>
            <View style={styles.currentSetTextContainer}>
              <Text style={styles.currentSetText}>
                {currentSet}
              </Text>
            </View>
          </View>
        )
      }
      {
        currentExercise < 2 && (
          <PieChart
            style={styles.pieChart}
            data={pieDataIncomplete}
            innerRadius="80%"
          />
        )
      }
    </View>
    <View style={styles.exercise}>
      {
        currentExercise > 3 && (
          <PieChart
            style={styles.pieChart}
            data={pieDataComplete}
            innerRadius="80%"
          />
        )
      }
      {
        currentExercise > 3 && (
          <View style={styles.invisibleView}>
            <View style={styles.tickContainer}>
              <Icon
                name="tick-heavy"
                color={colors.charcoal.dark}
                size={24}
              />
            </View>
          </View>
        )
      }
      {
        currentExercise === 3 && (
          <PieChart
            style={styles.pieChart}
            data={pieDataMap[currentSet]}
            innerRadius="80%"
            startAngle={Math.PI * 2}
            endAngle={0}
          />
        )
      }
      {
        currentExercise === 3 && (
          <View style={styles.invisibleView}>
            <View style={styles.currentSetTextContainer}>
              <Text style={styles.currentSetText}>
                {currentSet}
              </Text>
            </View>
          </View>
        )
      }
      {
        currentExercise < 3 && (
          <PieChart
            style={styles.pieChart}
            data={pieDataIncomplete}
            innerRadius="80%"
          />
        )
      }
    </View>
    <View style={styles.exercise}>
      {
        currentExercise > 4 && (
          <PieChart
            style={styles.pieChart}
            data={pieDataComplete}
            innerRadius="80%"
          />
        )
      }
      {
        currentExercise > 4 && (
          <View style={styles.invisibleView}>
            <View style={styles.tickContainer}>
              <Icon
                name="tick-heavy"
                color={colors.charcoal.dark}
                size={24}
              />
            </View>
          </View>
        )
      }
      {
        currentExercise === 4 && (
          <PieChart
            style={styles.pieChart}
            data={pieDataMap[currentSet]}
            innerRadius="80%"
            startAngle={Math.PI * 2}
            endAngle={0}
          />
        )
      }
      {
        currentExercise === 4 && (
          <View style={styles.invisibleView}>
            <View style={styles.currentSetTextContainer}>
              <Text style={styles.currentSetText}>
                {currentSet}
              </Text>
            </View>
          </View>
        )
      }
      {
        currentExercise < 4 && (
          <PieChart
            style={styles.pieChart}
            data={pieDataIncomplete}
            innerRadius="80%"
          />
        )
      }
    </View>
    <View style={styles.exercise}>
      {
        currentExercise > 5 && (
          <PieChart
            style={styles.pieChart}
            data={pieDataComplete}
            innerRadius="80%"
          />
        )
      }
      {
        currentExercise > 5 && (
          <View style={styles.invisibleView}>
            <View style={styles.tickContainer}>
              <Icon
                name="tick-heavy"
                color={colors.charcoal.dark}
                size={24}
              />
            </View>
          </View>
        )
      }
      {
        currentExercise === 5 && (
          <PieChart
            style={styles.pieChart}
            data={pieDataMap[currentSet]}
            innerRadius="80%"
            startAngle={Math.PI * 2}
            endAngle={0}
          />
        )
      }
      {
        currentExercise === 5 && (
          <View style={styles.invisibleView}>
            <View style={styles.currentSetTextContainer}>
              <Text style={styles.currentSetText}>
                {currentSet}
              </Text>
            </View>
          </View>
        )
      }
      {
        currentExercise < 5 && (
          <PieChart
            style={styles.pieChart}
            data={pieDataIncomplete}
            innerRadius="80%"
          />
        )
      }
    </View>
    <View style={styles.exercise}>
      {
        currentExercise > 6 && (
          <PieChart
            style={styles.pieChart}
            data={pieDataComplete}
            innerRadius="80%"
          />
        )
      }
      {
        currentExercise > 6 && (
          <View style={styles.invisibleView}>
            <View style={styles.tickContainer}>
              <Icon
                name="tick-heavy"
                color={colors.charcoal.dark}
                size={24}
              />
            </View>
          </View>
        )
      }
      {
        currentExercise === 6 && (
          <PieChart
            style={styles.pieChart}
            data={pieDataMap[currentSet]}
            innerRadius="80%"
            startAngle={Math.PI * 2}
            endAngle={0}
          />
        )
      }
      {
        currentExercise === 6 && (
          <View style={styles.invisibleView}>
            <View style={styles.currentSetTextContainer}>
              <Text style={styles.currentSetText}>
                {currentSet}
              </Text>
            </View>
          </View>
        )
      }
      {
        currentExercise < 6 && (
          <PieChart
            style={styles.pieChart}
            data={pieDataIncomplete}
            innerRadius="80%"
          />
        )
      }
    </View>
  </View>
);

WorkoutProgress.propTypes = {
  currentExercise: PropTypes.number.isRequired,
  currentSet: PropTypes.number.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 50,
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
    height: 50,
    width: 50,
  },
  invisibleView: {
    height: 0,
  },
  tickContainer: {
    marginTop: -36,
  },
  currentSetTextContainer: {
    marginTop: -40,
  },
  currentSetText: {
    fontFamily: fonts.bold,
    fontSize: 24,
    marginTop: 4,
    color: colors.charcoal.dark,
  },
});

export default WorkoutProgress;

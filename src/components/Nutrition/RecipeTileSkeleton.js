import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Card } from 'react-native-elements';
import colors from '../../styles/colors';

const { width } = Dimensions.get('window');

export default class RecipeTileSkeleton extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  render() {
    return (
      <View
        style={styles.cardContainer}
      >
        <Card
          image={require('../../../assets/images/recipe-tile-skeleton.png')}
          containerStyle={styles.card}
        >
          <View style={styles.skeletonTextContainer}>
            <View style={styles.skeletonTitle} />
            <View style={styles.skeletonSubtitle} />
            <View style={styles.skeletonTags} />
          </View>
        </Card>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  cardContainer: {
    margin: 0,
    width,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.charcoal.standard,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  card: {
    width: width - 20,
    borderRadius: 3,
    overflow: 'hidden',
    borderWidth: 0,
  },
  skeletonTextContainer: {
    height: 65,
    backgroundColor: colors.white,
  },
  skeletonTitle: {
    height: 16,
    width: width - 40,
    backgroundColor: colors.grey.light,
    marginBottom: 4,
    borderRadius: 2,
  },
  skeletonSubtitle: {
    height: 11,
    width: width - 40,
    backgroundColor: colors.grey.light,
    marginBottom: 4,
    borderRadius: 2,
  },
  skeletonTags: {
    height: 28,
    width: width - 40,
    backgroundColor: colors.grey.light,
    borderRadius: 2,
  },
});

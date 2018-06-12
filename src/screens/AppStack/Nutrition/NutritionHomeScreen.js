import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import colors from '../../../styles/colors';
import firebase from '../../../../config/firebase';
import CustomButton from '../../../components/CustomButton';

export default class NutritionHomeScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  render() {
    return (
      <View style={styles.container}>
        <Text>
          NutritionHomeScreen
        </Text>
        <CustomButton
          primary
          title="Breakfast"
          onPress={() => this.props.navigation.navigate('RecipeSelection')}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.offWhite,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

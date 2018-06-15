import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import colors from '../../../styles/colors';
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
        <View
          style={{
            marginTop: 10,
            marginBottom: 10,
          }}
        >
          <CustomButton
            secondary
            outline
            title="BREAKFAST"
            onPress={() => this.props.navigation.navigate('RecipeSelection', { meal: 'breakfast' })}
          />
        </View>
        <View
          style={{
            marginTop: 10,
            marginBottom: 10,
          }}
        >
          <CustomButton
            secondary
            outline
            title="LUNCH"
            onPress={() => this.props.navigation.navigate('RecipeSelection', { meal: 'lunch' })}
          />
        </View>
        <View
          style={{
            marginTop: 10,
            marginBottom: 10,
          }}
        >
          <CustomButton
            secondary
            outline
            title="DINNER"
            onPress={() => this.props.navigation.navigate('RecipeSelection', { meal: 'dinner' })}
          />
        </View>
        <View
          style={{
            marginTop: 10,
            marginBottom: 10,
          }}
        >
          <CustomButton
            secondary
            outline
            title="SNACK"
            onPress={() => this.props.navigation.navigate('RecipeSelection', { meal: 'snack' })}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: 'center',
  },
});

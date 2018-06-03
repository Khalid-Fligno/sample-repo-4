import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import CustomButton from '../../../components/CustomButton';
import colors from '../../../styles/colors';

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
        <ScrollView>
          <View
            style={{
              paddingTop: 10,
              paddingBottom: 10,
            }}
          >
            <CustomButton
              title="Default Button"
              onPress={() => console.log('Pressed')}
            />
          </View>

          <View
            style={{
              paddingTop: 10,
              paddingBottom: 10,
            }}
          >
            <CustomButton
              title="Default Button Disabled"
              onPress={() => console.log('Pressed')}
              disabled
            />
          </View>

          <View
            style={{
              paddingTop: 10,
              paddingBottom: 10,
            }}
          >
            <CustomButton
              outline
              title="Default Button Outline"
              onPress={() => console.log('Pressed')}
            />
          </View>

          <View
            style={{
              paddingTop: 10,
              paddingBottom: 10,
            }}
          >
            <CustomButton
              outline
              disabled
              title="Default Button Outline Disabled"
              onPress={() => console.log('Pressed')}
            />
          </View>

          <View
            style={{
              paddingTop: 10,
              paddingBottom: 10,
            }}
          >
            <CustomButton
              title="Primary Button"
              onPress={() => console.log('Pressed')}
              primary
            />
          </View>

          <View
            style={{
              paddingTop: 10,
              paddingBottom: 10,
            }}
          >
            <CustomButton
              title="Primary Button Disabled"
              onPress={() => console.log('Pressed')}
              primary
              disabled
            />
          </View>

          <View
            style={{
              paddingTop: 10,
              paddingBottom: 10,
            }}
          >
            <CustomButton
              title="Primary Button Outline"
              onPress={() => console.log('Pressed')}
              primary
              outline
            />
          </View>

          <View
            style={{
              paddingTop: 10,
              paddingBottom: 10,
            }}
          >
            <CustomButton
              title="Primary Button Outline Disabled"
              onPress={() => console.log('Pressed')}
              primary
              outline
              disabled
            />
          </View>

          <View
            style={{
              paddingTop: 10,
              paddingBottom: 10,
            }}
          >
            <CustomButton
              title="Secondary Button"
              onPress={() => console.log('Pressed')}
              secondary
            />
          </View>

          <View
            style={{
              paddingTop: 10,
              paddingBottom: 10,
            }}
          >
            <CustomButton
              title="Secondary Button Disabled"
              onPress={() => console.log('Pressed')}
              secondary
              disabled
            />
          </View>

          <View
            style={{
              paddingTop: 10,
              paddingBottom: 10,
            }}
          >
            <CustomButton
              title="Secondary Button Outline"
              onPress={() => console.log('Pressed')}
              secondary
              outline
            />
          </View>

          <View
            style={{
              paddingTop: 10,
              paddingBottom: 10,
            }}
          >
            <CustomButton
              title="Secondary Button Disabled"
              onPress={() => console.log('Pressed')}
              secondary
              outline
              disabled
            />
          </View>
        </ScrollView>
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

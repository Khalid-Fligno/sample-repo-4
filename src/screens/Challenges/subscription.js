import React, { Component } from 'react';
import { View, Text ,ScrollView,FlatList} from 'react-native';
import { ListItem, Button,  } from 'react-native-elements'
import colors from '../../styles/colors';
import globalStyle from '../../styles/globalStyles';


const mylist = [
  {
    name: '28 Days Challenge',
    subtitle: 'Vice President',
    status:true
  },
  {
    name: 'Lose a KG',
    subtitle: 'Vice Chairman',
    status:false
  },
]
const newlist = [
  {
    name: 'New Year Challenge',
  },
  {
    name: 'Beach Body',
  },
  {
    name: 'New Year Challenge',
  },
  {
    name: 'Beach Body',
  },

]
class ChallengeSubscriptionScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: 2
    }
  }
  updateIndex (selectedIndex) {
    // this.setState({selectedIndex})
    console.log(selectedIndex)
  }

  renderItem = ({ item }) => (
        <ListItem
        title={item.name}
        bottomDivider
        rightElement={
          <Button
              title="Buy"
              type="solid"
              // onPress={()=>console.log('hello')}
              buttonStyle={{width:150,}}
              titleStyle={{fontSize:15}}
              onPress={()=>this.props.navigation.navigate('ChallengeOnBoarding1')}
              />
        }
      />
  )
  renderItem1 = ({item}) =>(
    <ListItem
              title={item.name}
              bottomDivider
              rightElement={
                <Button
                    title={item.status?'Active':'Restart'}
                    type="solid"
                    onPress={()=>console.log('hello')}
                    // loading={true}
                    buttonStyle={{width:150,}}
                    titleStyle={{fontSize:15}}
                    disabled={item.status?true:false}
                    // disabledStyle={{backgroundColor:colors.green.dark}}
                    // disabledTitleStyle={{color:colors.white}}
                    />
              }
            />
  )
  render() {
    const buttons = ['Hello', 'World', 'Buttons']
    const { selectedIndex } = this.state
    return (
      <View style={{flex:1}}>
        <View>
        <FlatList
          keyExtractor={(item,index)=>index.toString()}
          data={mylist}
          renderItem={this.renderItem1}
        />
     
      </View>
      <Text style={{padding:20,fontSize:25,paddingLeft:10}}>Take a new challenge</Text>
        <FlatList
          keyExtractor={(item,index)=>index.toString()}
          data={newlist}
          renderItem={this.renderItem}
        />
      
    </View>
    );
  }
}

export default ChallengeSubscriptionScreen

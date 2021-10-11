import React from 'react'
import { View, Text, StyleSheet, FlatList } from "react-native";
import globalStyle from '../../../styles/globalStyles';
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import colors from '../../../styles/colors';
import CustomBtn from '../../../components/Shared/CustomBtn';
import EqualizerIcon from '../../../../assets/icons/EqualizerIcon';
import fonts from '../../../styles/fonts';
import { sortBy } from 'lodash';

export default class FilterRecipeScreen extends React.PureComponent {

    // constructor(props){
    //     super(props);
    //     this.state = {

    //     }
    // }

    render() {

        const filterButtons = [
            {
                id: 1,
                data: ["Vegetarian", "Vegan", "Gluten-Free", "Level 1", "Level 2", "Phase 1", "Phase 2", "Phase 3"]
            },
        ]

        const filterTags = sortBy(filterButtons).filter((tags) => {

            console.log(tags.data)
            if (tags.data[0] === 'Vegetarian') {
                console.log(tags.data[0])
                return tags.data[0]
            }
            if (tags.data[1] === 'Vegan') {
                console.log(tags.data[1])
                return tags.data[1]
            }
            if (tags.data[3] === 'Level 1') {
                console.log(tags.data[3])
                return tags.data[3]
            }

        })

        const renderItem = ({item}) => (
            <View>
                <Text>{item.data[0]}</Text>
                <Text>{item.data[1]}</Text>
                <Text>{item.data[3]}</Text>
            </View>
        )
        return (
            <View style={globalStyle.container}>
                <View
                    style={styles.customContainerStyle}
                >
                    {/* BigHeadText */}
                    <Text
                        style={styles.bigTitleStyle}
                    >
                        Breakfast
                    </Text>

                    {/* Filter Button */}
                    <View
                    // style={styles.oblongContainer}
                    >
                        <CustomBtn
                            titleCapitalise={true}
                            Title='Filter'
                            style={styles.oblongBtnStyle}
                            isRightIcon={true}
                            filterBtnStyle={{}}
                        />
                    </View>
                </View>
                <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={filterTags}
                    keyExtractor={(item) => item.id}
                    renderItem={(item) => renderItem(item)}
                    style={{
                        paddingVertical: wp("4%"),
                        marginTop: 5,
                    }}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    customContainerStyle: {
        flexDirection: 'row',
        alignContent: 'center',
        justifyContent: 'space-between',
        height: 50,
        marginVertical: hp("2%"),
        marginTop: 10,
        marginBottom: hp("2.5%"),
        paddingTop: 10,
    },
    bigTitleStyle: {
        fontSize: hp("4%"),
        fontWeight: '700',
        fontFamily: 'monospace',
        color: colors.black,
        letterSpacing: 0.5,
    },
    oblongBtnStyle: {
        borderRadius: 45,
        borderWidth: 0,
        backgroundColor: colors.white,
        color: colors.black,
        shadowColor: colors.black,
        shadowOffset: {
            width: 0,
            height: 9,
        },
        shadowOpacity: 0.48,
        shadowRadius: 11.95,
        elevation: 18,
    }
});
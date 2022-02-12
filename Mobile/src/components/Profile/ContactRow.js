import React from "react";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { Icon } from "react-native-elements";
import fonts from "../../styles/fonts";
import colors from "../../styles/colors";

const ContactRow = React.memo(({ onPress, name, emailOrNumber, selected }) => {
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
      <View style={styles.contactRowContainer}>
        <View style={styles.iconContainer}>
          <Icon
            name={selected ? "check-circle" : "circle-o"}
            type="font-awesome"
            color={selected ? colors.green.forest : colors.grey.light}
          />
        </View>
        <View style={styles.contactInformationContainer}>
          <Text style={styles.contactName}>{name || emailOrNumber}</Text>
          {name.length > 0 && (
            <Text style={styles.contactInformation}>{emailOrNumber}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  contactRowContainer: {
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
  },
  iconContainer: {
    paddingRight: 16,
  },
  contactInformationContainer: {
    flex: 1,
  },
  contactName: {
    fontFamily: fonts.standardNarrow,
  },
  contactInformation: {
    marginTop: 4,
    color: colors.grey.standard,
    fontFamily: fonts.standardNarrow,
  },
});

export default ContactRow;

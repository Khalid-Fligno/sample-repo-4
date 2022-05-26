import { StyleSheet } from "react-native";
import colors from "../../../styles/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
    justifyContent: "space-between",
  },
  contentContainerStyle: {
    flexGrow: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    paddingTop: 0,
    paddingBottom: 15,
  },
  customContainerStyle: {
    marginTop: 15, 
    marginBottom: 0
  }
});
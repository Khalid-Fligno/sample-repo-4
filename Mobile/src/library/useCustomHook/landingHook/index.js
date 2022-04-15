import { getVersion } from "react-native-device-info";
import { checkVersion } from "react-native-check-version";
import { Platform } from "react-native";
import { db } from "../../../config/firebase";
import { useStorage } from "../../../hook/storage";

export const checkAppVersion = async () => {
  const uid = await useStorage.getItem('uid');
  if (uid) {
    const version = await checkVersion();
    console.log('version: ', version)
    await db
      .collection("users")
      .doc(uid)
      .set({
        AppVersionUse:
          Platform.OS === "ios"
            ? String(version.version)
            : String(getVersion()),
      },
        { merge: true }
      );
  }
}
import { timerSound } from '../../config/audio';
import { Audio } from "expo-av";

export const soundAsset = async () => {
    const cacheSound = [require("../../assets/sounds/ding.mp3")]

    await Audio.setIsEnabledAsync(true);
    return cacheSound.map(async (sound) => {
      const status = await timerSound.getStatusAsync();
      if (status.isLoaded === false) {
        timerSound.loadAsync(sound);
      }
    });
}
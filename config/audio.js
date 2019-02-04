import { Audio } from 'expo';

Audio.setIsEnabledAsync(true);
export const soundObject = new Audio.Sound();
soundObject.loadAsync(require('../assets/sounds/ding.mp3'));

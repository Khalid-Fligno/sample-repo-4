import * as firebase from "firebase";

// Live configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyBayQ5iob9mqDvVMNQtytsmyRF6YRmFPYQ",
//   authDomain: "fitazfk-app.firebaseapp.com",
//   databaseURL: "https://fitazfk-app.firebaseio.com",
//   projectId: "fitazfk-app",
//   storageBucket: "fitazfk-app.appspot.com",
//   messagingSenderId: "100949764253",
// };

// Staging configuration
const firebaseConfig = {
  apiKey: "AIzaSyCNhs6I_Im0s57HgowFzI9KO_meK9T341Y",
  authDomain: "staging-fitazfk-app.firebaseapp.com",
  databaseURL: "https://staging-fitazfk-app.firebaseio.com",
  projectId: "staging-fitazfk-app",
  storageBucket: "staging-fitazfk-app.appspot.com",
  messagingSenderId: "148679785242",
};

firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore();
export const auth = firebase.auth();
export const storage = firebase.storage()
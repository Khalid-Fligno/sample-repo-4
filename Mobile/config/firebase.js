import * as firebase from "firebase";
import "firebase/firestore";

// let firebaseConfig = {
//    apiKey: 'AIzaSyAxS1IQqle6bXkO018qwJdaUXAfj845G-s',
//    authDomain: 'quickstart-1588594831516.firebaseapp.com',
//    databaseURL: 'https://quickstart-1588594831516.firebaseio.com',
//    projectId: 'quickstart-1588594831516',
//    storageBucket: 'quickstart-1588594831516.appspot.com',
//    messagingSenderId: '213071860801'
// };

// Live configuration
const firebaseConfig = {
  apiKey: "AIzaSyBayQ5iob9mqDvVMNgQtytsmyRF6YRmFPYQ",
  authDomain: "fitazfk-app.firebaseapp.com",
  databaseURL: "https://fitazfk-app.firebaseio.com",
  projectId: "fitazfk-app",
  storageBucket: "fitazfk-app.appspot.com",
  messagingSenderId: "100949764253",
};

// Staging configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyCNhs6I_Im0s57HgowFzI9KO_meK9T341Y",
//   authDomain: "staging-fitazfk-app.firebaseapp.com",
//   databaseURL: "https://fitazfk-app.firebaseio.com",
//   projectId: "staging-fitazfk-app",
//   storageBucket: "staging-fitazfk-app.appspot.com",
//   messagingSenderId: "148679785242",
// };

firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore();
export const auth = firebase.auth();

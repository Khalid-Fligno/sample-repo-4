const firebase = require('firebase');
require('firebase/firestore');
let firebaseConfig = {
    apiKey: 'AIzaSyAxS1IQqle6bXkO018qwJdaUXAfj845G-s',
    authDomain: 'quickstart-1588594831516.firebaseapp.com',
    databaseURL: 'https://quickstart-1588594831516.firebaseio.com',
    projectId: 'quickstart-1588594831516',
    storageBucket: 'quickstart-1588594831516.appspot.com',
    messagingSenderId: '213071860801'
};

// var firebaseConfig = {
//     apiKey: "AIzaSyDTwQ2csz41d8Bo60H-wH_NWlQglKC7NDM",
//     authDomain: "fitazfk-app.firebaseapp.com",
//     databaseURL: "https://fitazfk-app.firebaseio.com",
//     projectId: "fitazfk-app",
//     storageBucket: "fitazfk-app.appspot.com",
//     messagingSenderId: "100949764253",
//     appId: "1:100949764253:web:4d5655ad78eff477930c74"
// };

firebase.initializeApp(firebaseConfig);

exports.db = firebase.firestore();

exports.auth = firebase.auth();
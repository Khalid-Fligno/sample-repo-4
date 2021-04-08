import * as firebase from 'firebase';
import 'firebase/firestore';


// let firebaseConfig = {
//    apiKey: 'AIzaSyAxS1IQqle6bXkO018qwJdaUXAfj845G-s',
//    authDomain: 'quickstart-1588594831516.firebaseapp.com',
//    databaseURL: 'https://quickstart-1588594831516.firebaseio.com',
//    projectId: 'quickstart-1588594831516',
//    storageBucket: 'quickstart-1588594831516.appspot.com',
//    messagingSenderId: '213071860801'
// };
// let firebaseConfig = {
//    apiKey: 'AIzaSyAxS1IQqle6bXkO018qwJdaUXAfj845G-s',
//    authDomain: 'quickstart-1588594831516.firebaseapp.com',
//    databaseURL: 'https://quickstart-1588594831516.firebaseio.com',
//    projectId: 'quickstart-1588594831516',
//    storageBucket: 'quickstart-1588594831516.appspot.com',
//    messagingSenderId: '213071860801'
// };
const firebaseConfig = {
 apiKey: 'AIzaSyBayQ5iob9mqDvVMNQtytsmyRF6YRmFPYQ',
 authDomain: 'fitazfk-app.firebaseapp.com',
 databaseURL: 'https://fitazfk-app.firebaseio.com',
 projectId: 'fitazfk-app',
 storageBucket: 'fitazfk-app.appspot.com',
 messagingSenderId: '100949764253',
};

firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore();
export const auth = firebase.auth();
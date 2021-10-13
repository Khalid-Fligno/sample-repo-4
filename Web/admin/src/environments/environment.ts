// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyDTwQ2csz41d8Bo60H-wH_NWlQglKC7NDM",
    authDomain: "fitazfk-app.firebaseapp.com",
    databaseURL: "https://fitazfk-app.firebaseio.com",
    projectId: "fitazfk-app",
    storageBucket: "fitazfk-app.appspot.com",
    messagingSenderId: "100949764253",
  },
  httpUrl: "https://34.87.240.165/admin" // status: 200
  // httpUrl: "http://localhost:8100/admin" // status: 0
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.

import React from "react";
import Setup from "./src/setup/Setup";
import {Provider} from 'react-redux';
import store from './src/store';

const App = () => {

  return (
    <Provider store={store}>
      <Setup />
    </Provider>
  );
};

export default App;
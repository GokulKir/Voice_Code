/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import Main from './Main';
import AM from './AM';
import 'react-native-gesture-handler';

AppRegistry.registerComponent(appName, () => AM);

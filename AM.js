import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import App from './App';
import { createStackNavigator } from '@react-navigation/stack';
import { AlanView } from '@alan-ai/alan-sdk-react-native';





function MyStack() {
    return (
      <Stack.Navigator>
        <Stack.Screen name="App" component={App} options={{headerShown : false}} />
      </Stack.Navigator>
    );
  }

const Stack = createStackNavigator();

export default function AM() {
  return (
    <NavigationContainer>
     <MyStack/>
    </NavigationContainer>
  );
}
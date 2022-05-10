import React from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {HomeScreen, DetailScreen} from './screens';
import io from 'socket.io-client';

const Stack = createNativeStackNavigator();

//if you are using windows, then add your ipv4 address replacing http://127.0.0.1
export const socket = io('http://127.0.0.1:3000');

socket.on('connect', () => {
  console.log('socket is connected');
});

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Detail" component={DetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

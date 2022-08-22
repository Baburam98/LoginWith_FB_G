import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
const Stack = createStackNavigator();

const AppStack = ({navigation}) => (
  <Stack.Navigator>
    <Stack.Screen
      name="home"
      component={HomeScreen}
      options={{
        headerTitleAlign: 'center',
        headerTitleStyle: {
          color: '#2e64e5',
          fontFamily: 'Kufam-SemiBoldItalic',
          fontSize: 18,
        },
        headerStyle: {
          shadowColor: '#fff',
          elevation: 0,
        },
       
      }}
    />
   
  </Stack.Navigator>
);

export default AppStack;

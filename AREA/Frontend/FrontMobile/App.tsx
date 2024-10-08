import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Welcom from './Welcom';
import SignUp from './SignUp';
import Login from './Login';
import Home from './Home';
import CreateYourAREA from './CreateYourAREA';
import ServiceSearchAction from './ServiceSearchAction'
import ServiceActionDetail from './ServiceActionDetail'
import ServiceReactionDetail from './ServiceReactionDetail'
import ServiceSearchReaction from './ServiceSearchReaction'

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcom">
        <Stack.Screen
          name="Welcom" component={Welcom}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUp}
          options={{ headerTitle: '', headerBackTitleVisible: false }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerTitle: '', headerBackTitleVisible: false }}
        />
        <Stack.Screen
        name="Home"
        component={Home}
        options={{ headerShown: false }}
        />
        <Stack.Screen
        name="CreateYourAREA"
        component={CreateYourAREA}
        options={{ headerShown: false }}
        />
        <Stack.Screen
        name="ServiceSearchAction"
        component={ServiceSearchAction}
        options={{ headerShown: false }}
        />
        <Stack.Screen
        name="ServiceActionDetail"
        component={ServiceActionDetail}
        options={{ headerShown: false }}
        />
        <Stack.Screen
        name="ServiceReactionDetail"
        component={ServiceReactionDetail}
        options={{ headerShown: false }}
        />
        <Stack.Screen
        name="ServiceSearchReaction"
        component={ServiceSearchReaction}
        options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

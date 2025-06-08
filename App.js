import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firbaseConfig';
import { Provider, useDispatch } from 'react-redux';
import { store } from './redux/store';
import { setUser, clearUser } from './redux/authSlice';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';


import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import PostScreen from './screens/PostScreen';
import { cleanFirebaseUser } from './utils/cleanUser';
import Toast from 'react-native-toast-message';


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();


function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: '#60B5FF',
      }}
    >
      <Tab.Screen
        name="home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Entypo name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="post"
        component={PostScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Entypo name="circle-with-plus" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome6 name="user-large" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function RootNavigator({ isLoggedIn }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isLoggedIn ? (
        <>
          <Stack.Screen name="Home" component={MyTabs} />
          <Stack.Screen name="Post" component={PostScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

function AppWithAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        const safeUser = cleanFirebaseUser(user);
        dispatch(setUser(safeUser));
        setIsLoggedIn(true);
      } else {
        dispatch(clearUser());
        setIsLoggedIn(false);
      }
    });
    return unsubscribe;
  }, []);

  if (isLoggedIn === null) {
    return null;
  }

  return (
    <NavigationContainer>
      <RootNavigator isLoggedIn={isLoggedIn} />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AppWithAuth />
      <Toast />
    </Provider>
  );
}

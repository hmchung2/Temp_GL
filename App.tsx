import React, {useCallback, useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/Ionicons'; // replaced @expo/vector-icons
import {StatusBar, View, useColorScheme} from 'react-native';
import {DefaultTheme, NavigationContainer} from '@react-navigation/native';
import {ApolloProvider, useReactiveVar} from '@apollo/client';
import client, {isLoggedInVar, tokenVar} from './apollo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ThemeProvider} from 'styled-components/native';
import {darkTheme, lightTheme} from './styles/themes';
import LoggedOutNav from './navigators/LoggedOutNav';
import LoggedInNav from './navigators/LoggedInNav';

export default function App() {
  const [ready, setReady] = useState(true); // set to true by default as we aren't waiting on assets/fonts to load
  const isLoggedIn = useReactiveVar(isLoggedInVar);

  useEffect(() => {
    async function checkToken() {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        isLoggedInVar(true);
        tokenVar(token);
      }
    }
    checkToken();
  }, []);

  const isDark = useColorScheme() === 'dark';

  const MyTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: isDark ? '#000000' : '#FFFFFF',
    },
  };

  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
        <View style={{flex: 1}}>
          <StatusBar hidden={false} />
          <NavigationContainer theme={MyTheme}>
            {isLoggedIn ? <LoggedInNav /> : <LoggedOutNav />}
          </NavigationContainer>
        </View>
      </ThemeProvider>
    </ApolloProvider>
  );
}

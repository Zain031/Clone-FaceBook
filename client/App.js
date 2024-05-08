
import { NavigationContainer } from '@react-navigation/native';
import MainStackNavigator from './Navigators/MainStackNavigator';
import { ApolloProvider } from '@apollo/client';
import client from './config/appolloConnection';




export default function App() {
  return (
    <ApolloProvider client={client}>
    <NavigationContainer>
      <MainStackNavigator/>
    </NavigationContainer>
    </ApolloProvider>
  
  );
}




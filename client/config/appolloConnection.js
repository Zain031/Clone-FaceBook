import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';

const client = new ApolloClient({
    uri: '     https://1b59-2001-448a-2082-3d0f-fc75-69f7-f4ab-8845.ngrok-free.app',
    cache: new InMemoryCache(),
  });


  export default client
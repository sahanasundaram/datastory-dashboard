'use client';

import { ReactNode } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'https://datastory-cloud-v2.stellate.sh',
  cache: new InMemoryCache(),
});

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ApolloProvider client={client}>
      <ChakraProvider>{children}</ChakraProvider>
    </ApolloProvider>
  );
} 
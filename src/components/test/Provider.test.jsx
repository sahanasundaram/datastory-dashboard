
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Providers } from '../Providers'; // Adjust the import path as needed

describe('Providers component', () => {
  it('renders children wrapped inside ApolloProvider and ChakraProvider', () => {
    render(
      <Providers>
        <div data-testid="child">Hello Providers</div>
      </Providers>
    );

    expect(screen.getByTestId('child')).toHaveTextContent('Hello Providers');
  });
});

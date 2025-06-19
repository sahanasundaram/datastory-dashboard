import React from 'react'; 
import { render, screen } from '@testing-library/react';
import RootLayout from '../layout';


describe('RootLayout', () => {
  it('renders children wrapped inside Providers and sets html lang attribute', () => {
    render(
      <RootLayout>
        <div data-testid="child">Test Child</div>
      </RootLayout>
    );

    // Check the child content is rendered
    expect(screen.getByTestId('child')).toHaveTextContent('Test Child');

    // Check the html lang attribute (using document.documentElement)
    expect(document.documentElement.lang).toBe('en');

    // Check the body contains the Providers wrapper with the children
    expect(document.body).toContainElement(screen.getByTestId('child'));
  });
});

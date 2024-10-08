import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import App from './App';

describe('App Component', () => {
  it('should show the login form when Login button is pressed', async () => {
    const { findByAccessibilityLabel, getByLabelText } = render(<App />);
    const { debug, findByText } = render(<App />);
    debug();

    const loginButton = await findByText('Welcome');
    expect(loginButton).toBeTruthy();

    fireEvent.press(loginButton);

    expect(await getByLabelText('Email')).toBeTruthy();
    expect(await getByLabelText('Password')).toBeTruthy();
  });
});

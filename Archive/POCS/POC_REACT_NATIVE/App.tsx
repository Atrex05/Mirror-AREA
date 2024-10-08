import React, { useState } from "react";
import { AppBar, IconButton, Button, Avatar, TextInput, DialogContent, DialogActions } from "@react-native-material/core";
import { Dialog } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { API_URL } from "./constante";

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const success = await connected(email, password);
      if (success) {
        setLoggedIn(true);
        setShowLoginForm(false);
      } else {
        console.error("error: Failed to connect");
      }
    } catch (error) {
      console.error("error:", error);
    }
  };

  async function connected(user: string, pass: string) {
    console.log(user)
    console.log(pass)
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: user, password: pass })
    };

    console.log(requestOptions)
    try {
      const response = await fetch(API_URL, requestOptions);
      console.log(response)
      if (!response.ok) throw new Error('Failed to login');

      const data = await response.json();
      console.log(data)
      if (data.message == "Login successful") {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("API error:", error);
      return false;
    }
  }

  return (
    <>
      <SafeAreaProvider>
        <AppBar
          style={{ marginTop: 30 }}
          title="Welcome"
          leading={props => (
            <IconButton
              icon={props => <Icon name="menu" {...props} />}
              {...props}
            />
          )}
          trailing={props =>
            loggedIn ? (
              <IconButton
                icon={<Avatar label={email} size={28} />}
                onPress={() => setLoggedIn(!loggedIn)}
                {...props}
              />
            ) : (
              <Button
                variant="text"
                title="Login"
                compact
                style={{ marginEnd: 4 }}
                onPress={() => setShowLoginForm(true)}
                {...props}
              />
            )
          }
        />

        <Dialog
          visible={showLoginForm}
          onDismiss={() => setShowLoginForm(true)}
          style={{ padding: 20 }}
        >
          <Dialog.Content>
            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              style={{ marginBottom: 16 }}
            />
            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button variant="text" title="Cancel" onPress={() => setShowLoginForm(false)} />
            <Button variant="text" title="Login" onPress={handleLogin} />
          </Dialog.Actions>
        </Dialog>
      </SafeAreaProvider>
    </>
  );
};

export default App;

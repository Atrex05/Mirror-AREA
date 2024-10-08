import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { API_URL } from './constante';

const socialProviders = [
  { name: 'Google', icon: 'google', type: 'button' },
  { name: 'Facebook', icon: 'facebook', type: 'button' },
  { name: 'GitHub', icon: 'github', type: 'button' }
];

const SignUp = () => {
  const navigation = useNavigation();
  const [providers, setProviders] = useState([]);
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setPasswordVisible] = useState(false);

  useEffect(() => {
    setProviders(socialProviders);
  }, []);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!isPasswordVisible);
  };

  const handleLogin = async () => {
    try {
      const success = await connected(name, lastName, email, password);
      if (success) {
        navigation.navigate('Home');
      } else {
        console.error("error: Failed to connect");
      }
    } catch (error) {
      console.error("error:", error);
    }
  };

  async function connected(name: string, lastName: string, pass: string, email: string) {
    console.log(name)
    console.log(lastName)
    console.log(pass)
    console.log(email)
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name, lastname: lastName, password: pass, email: email })
    };

    console.log(requestOptions)
    try {
      const response = await fetch(API_URL + 'signUp', requestOptions);
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
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Sign up</Text>

        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={(text) => setName(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          value={lastName}
          onChangeText={(text) => setLastName(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Password"
            secureTextEntry={!isPasswordVisible}
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
          <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
            <Text>{isPasswordVisible ? '👁️' : '🙈'}</Text>
          </TouchableOpacity>
        </View>

        <Button 
          mode="contained" 
          onPress={() => navigation.navigate('Home')}
          style={[styles.signUpButton, !email || !password || !lastName || !name ? styles.disabledButton : null]}
          // disabled={!email || !password }
        >
          Sign up for FREE
        </Button>

        <Text style={styles.loginText}>
          Already have an account? <Text style={styles.link} onPress={() => navigation.navigate('Login')} >Click here to sign in.</Text>
        </Text>

        <View style={styles.socialContainer}>
          {providers.map((provider, index) => (
            <Button
              key={index}
              mode="outlined"
              icon={provider.icon}
              onPress={() => console.log(`${provider.name} Sign Up Pressed`)}
              style={styles.socialButton}
            >
              Sign up with {provider.name}
            </Button>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  text: {
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eyeIcon: {
    paddingHorizontal: 10,
  },
  signUpButton: {
    backgroundColor: '#6200ea',
    paddingVertical: 10,
    borderRadius: 5,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  loginText: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
  },
  link: {
    color: '#6200ea',
    textDecorationLine: 'underline',
  },
  socialContainer: {
    marginTop: 20,
  },
  socialButton: {
    marginVertical: 5,
    borderRadius: 5,
  },
});

export default SignUp;

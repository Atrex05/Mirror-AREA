import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { API_URL } from './constante';

const socialProviders = [
    { name: 'Google', icon: 'google' },
    { name: 'Facebook', icon: 'facebook' },
    { name: 'GitHub', icon: 'github' },
    { name: 'SSO', icon: 'key' },
    { name: 'coucou', icon: 'door' }
];

const Login = () => {
    const navigation = useNavigation();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setPasswordVisible] = useState(false);
    const [providers, setProviders] = useState([]);

    useEffect(() => {
        setProviders(socialProviders);
    }, []);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!isPasswordVisible);
    };

    const handleLogin = async () => {
        try {
            const success = await connected(email, password);
            if (success) {
                navigation.navigate('Home', { userEmail: email });
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
            const response = await fetch(API_URL + 'login', requestOptions);
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
                <Text style={styles.title}>Login</Text>

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
                    style={[styles.signInButton, !email || !password ? styles.disabledButton : null]}
                    onPress={handleLogin}
                    disabled={!email || !password}
                >
                    Login for FREE
                </Button>

                <TouchableOpacity>
                    <Text
                        style={styles.createAccountText}
                        onPress={() => navigation.navigate('SignUp')}
                    > Create an account</Text>
                </TouchableOpacity>

                <View style={styles.socialContainer}>
                    {providers.map((provider, index) => (
                        <Button
                            key={index}
                            mode="outlined"
                            icon={provider.icon}
                            onPress={() => console.log(`Sign in with ${provider.name}`)}
                            style={styles.socialButton}
                        >
                            Sign in with {provider.name}
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
    signInButton: {
        backgroundColor: '#6200ea',
        paddingVertical: 10,
        borderRadius: 5,
        marginTop: 10,
    },
    disabledButton: {
        backgroundColor: '#ccc',
    },
    createAccountText: {
        textAlign: 'center',
        color: '#6200ea',
        marginTop: 15,
        textDecorationLine: 'underline',
    },
    socialContainer: {
        marginVertical: 20,
        marginTop: 10,
    },
    socialButton: {
        marginVertical: 5,
    }
});

export default Login;

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, Image } from 'react-native';
import { Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const logos = [
    { id: 1, source: require('./assets/facebook-logo.png') },
    { id: 2, source: require('./assets/insta-logo.png') },
    { id: 3, source: require('./assets/google-logo.png') },
    { id: 4, source: require('./assets/X-logo.png') },
    { id: 5, source: require('./assets/riot-games-logo.png') },
    { id: 6, source: require('./assets/linkedin-logo.png') },
    { id: 7, source: require('./assets/discord-logo.png') },
    { id: 8, source: require('./assets/spotify-logo.png') },
    { id: 9, source: require('./assets/time-logo.png') },
];

const Bubble = ({ logo }) => {
    const position = useRef(new Animated.ValueXY({ x: Math.random() * width, y: Math.random() * height })).current;
    const size = Math.random() * 30 + 50;

    useEffect(() => {
        const moveBubble = () => {
            Animated.timing(position, {
                toValue: { x: Math.random() * width, y: Math.random() * height },
                duration: Math.random() * 5000 + 4000,
                useNativeDriver: true,
            }).start(() => {
                moveBubble();
            });
        };

        moveBubble();
    }, [position]);

    return (
        <Animated.View
            style={[
                styles.bubble,
                { width: size, height: size, transform: position.getTranslateTransform() },
            ]}
        >
            <Image source={logo.source} style={styles.logo} />
        </Animated.View>
    );
};

const Welcom = () => {
    const navigation = useNavigation();
    const opacity = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, [opacity]);

    return (
        <LinearGradient
            colors={['#87CEEB', '#00008B']}
            style={styles.container}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
        >
            {logos.map((logo, index) => (
                <Bubble key={logo.id} logo={logo} />
            ))}

            <View style={styles.header}>
                <Text style={styles.title}>AREA</Text>
            </View>

            <Animated.Text style={[styles.cloningText, { opacity }]}>
                #CREATEYOURAREA
            </Animated.Text>

            <View style={styles.content}>
                <Text style={styles.infoText}>
                    Transform your tasks and processes into powerful applications and systems. Create and automate everything on an innovative visual platform. | Free forever
                </Text>

                <Button mode="contained" onPress={() => navigation.navigate('Login')}>
                    Login
                </Button>
                <Button style={styles.sign_up} mode="contained" onPress={() => navigation.navigate('SignUp')}>
                    Sign up
                </Button>
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
    },
    header: {
        paddingTop: 50,
        justifyContent: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        color: '#fff',
        fontWeight: 'bold',
        letterSpacing: 1.2,
    },
    cloningText: {
        fontSize: 48,
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 60,
        marginBottom: 15,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoText: {
        color: '#fff',
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 15,
        lineHeight: 24,
    },
    sign_up: {
        marginTop: 20,
    },
    bubble: {
        position: 'absolute',
        borderRadius: 50,
        overflow: 'hidden',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    logo: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
});


export default Welcom;

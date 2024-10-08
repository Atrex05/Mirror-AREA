import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Button, Menu, Divider, Provider } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useRoute, useNavigation } from '@react-navigation/native';

const CreateAreaPage = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const [visible, setVisible] = useState(false);
    const [isConfirmEnabled, setIsConfirmEnabled] = useState(false);

    const button1Data = route.params?.button1Data;
    const button2Data = route.params?.button2Data;

    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);

    useEffect(() => {
        if (button1Data && button2Data) {
            setIsConfirmEnabled(true);
        } else {
            setIsConfirmEnabled(false);
        }
    }, [button1Data, button2Data]);

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <Provider>
                <LinearGradient
                    colors={['#87CEEB', '#00008B']}
                    style={styles.container}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                >
                    <View style={styles.header}>
                        <Text
                            style={styles.headerTitle}
                            onPress={() => navigation.navigate('Home')}
                        >
                            AREA
                        </Text>

                        <Menu
                            visible={visible}
                            onDismiss={closeMenu}
                            anchor={
                                <Button onPress={openMenu} style={styles.accountButton}>
                                    Account
                                </Button>
                            }
                            style={{ marginTop: 75 }}
                        >
                            <Text style={styles.menuEmail}>example@example.com</Text>
                            <Divider />
                            <Menu.Item
                                onPress={() => navigation.navigate('Welcom')}
                                title="Logout"
                            />
                        </Menu>
                    </View>

                    <View style={styles.buttonContainer}>
                        <Text style={styles.labelText}>Your Action</Text>
                        <TouchableOpacity
                        style={styles.bigButton}
                        onPress={() => navigation.navigate('ServiceSearchAction', {button1Data: button1Data, button2Data: button2Data})}
                        >
                            {button1Data ? (
                                <>
                                    <Image source={button1Data.logo} style={styles.logo} />
                                    <Text style={styles.serviceName}>{button1Data.name}</Text>
                                    <Text style={styles.serviceDescription}>
                                        {button1Data.description}
                                    </Text>
                                </>
                            ) : (
                                <Text style={styles.buttonText}>+</Text>
                            )}
                        </TouchableOpacity>

                        <Text style={styles.labelText}>Your Reaction</Text>
                        <TouchableOpacity
                        style={styles.bigButton}
                        onPress={() => navigation.navigate('ServiceSearchReaction', {button1Data: button1Data, button2Data: button2Data}) }
                        >
                            {button2Data ? (
                                <>
                                    <Image source={button2Data.logo} style={styles.logo} />
                                    <Text style={styles.serviceName}>{button2Data.name}</Text>
                                    <Text style={styles.serviceDescription}>
                                        {button2Data.description}
                                    </Text>
                                </>
                            ) : (
                                <Text style={styles.buttonText}>+</Text>
                            )}
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={[
                            styles.confirmButton,
                            { backgroundColor: isConfirmEnabled ? '#6200ea' : '#ccc' },
                        ]}
                        onPress={() => navigation.navigate('Home')}
                        disabled={!isConfirmEnabled}
                    >
                        <Text style={styles.confirmButtonText}>
                            Confirmer
                        </Text>
                    </TouchableOpacity>
                </LinearGradient>
            </Provider>
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
    },
    header: {
        marginTop: 30,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 20,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
    },
    accountButton: {
        backgroundColor: '#fff',
        borderRadius: 5,
    },
    menuEmail: {
        fontSize: 16,
        padding: 10,
        textAlign: 'center',
    },
    buttonContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 20,
        paddingVertical: 40,
    },
    bigButton: {
        width: '80%',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 40,
    },
    labelText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
        textAlign: 'center',
    },
    buttonText: {
        fontSize: 24,
        color: '#6200ea',
        fontWeight: 'bold',
    },
    logo: {
        width: 60,
        height: 60,
        marginBottom: 10,
    },
    serviceName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#6200ea',
        marginBottom: 10,
    },
    serviceDescription: {
        fontSize: 16,
        textAlign: 'center',
        color: '#333',
    },
    confirmButton: {
        width: '80%',
        padding: 15,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        alignSelf: 'center',
    },
    confirmButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
});

export default CreateAreaPage;

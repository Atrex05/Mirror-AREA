import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native';
import { Button, Menu, Divider, Provider } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useRoute, useNavigation } from '@react-navigation/native';

const ServiceReactionDetail = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { ServiceInfo } = route.params;
    const { logo, name } = ServiceInfo;
    const [visible, setVisible] = useState(false);
    const button1Data = route.params?.button1Data;

    const [reactions] = useState([
        { id: 1, reaction: 'Send a message' },
        { id: 2, reaction: 'Post an update' },
        { id: 3, reaction: 'Check status' },
        { id: 4, reaction: 'Play a song' },
        { id: 5, reaction: 'Fetch data' },
        { id: 6, reaction: 'Notify user' },
    ]);

    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);

    const handleReactionPress = (reaction) => {
        navigation.navigate('CreateYourAREA', {
            button1Data: button1Data
            ? {
                logo: button1Data.logo,
                name: button1Data.name,
                description: button1Data.description,
            }
            : null,
            button2Data: {
                logo: logo,
                name: name,
                description: `This is the ${reaction} reaction.`,
            }
        });
    };

    return (
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

                <View style={styles.logoSection}>
                    <Image source={logo} style={styles.logo} />
                    <Text style={styles.logoName}>{name}</Text>
                </View>

                <Divider style={styles.divider} />

                <View style={styles.triggerSection}>
                    <Text style={styles.triggerTitle}>Choose a Reaction</Text>

                    <FlatList
                        data={reactions}
                        keyExtractor={(item) => item.id.toString()}
                        numColumns={2}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.actionItem}
                                onPress={() => handleReactionPress(item.reaction)}
                            >
                                <Text style={styles.actionText}>{item.reaction}</Text>
                            </TouchableOpacity>
                        )}
                        contentContainerStyle={styles.reactionsGrid}
                    />
                </View>
            </LinearGradient>
        </Provider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 40,
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

    logoSection: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 100,
        height: 100,
        marginBottom: 20,
    },
    logoName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },

    divider: {
        height: 2,
        backgroundColor: '#fff',
        marginVertical: 20,
    },

    triggerSection: {
        flex: 2,
        paddingHorizontal: 20,
    },
    triggerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
        textAlign: 'center',
    },
    reactionsGrid: {
        paddingHorizontal: 10,
    },
    actionItem: {
        flex: 1,
        margin: 10,
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        flexBasis: '45%',
    },
    actionText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#6200ea',
    },
});

export default ServiceReactionDetail;

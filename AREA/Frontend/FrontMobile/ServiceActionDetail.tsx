import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native';
import { Button, Menu, Divider, Provider } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useRoute, useNavigation } from '@react-navigation/native';

const ServiceActionDetail = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { ServiceInfo } = route.params;
    const { logo, name } = ServiceInfo;
    const [visible, setVisible] = useState(false);
    const button2Data = route.params?.button2Data;

    const [actions] = useState([
        { id: 1, action: 'Send a message' },
        { id: 2, action: 'Post an update' },
        { id: 3, action: 'Check status' },
        { id: 4, action: 'Play a song' },
        { id: 5, action: 'Fetch data' },
        { id: 6, action: 'Notify user' },
    ]);

    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);

    const handleActionPress = (action) => {
        navigation.navigate('CreateYourAREA', {
            button1Data: {
                logo: logo,
                name: name,
                description: `This is the ${action} action.`,
            },
            button2Data: button2Data
            ? {
                logo: button2Data.logo,
                name: button2Data.name,
                description: button2Data.description,
            }
            : null
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
                    <Text style={styles.triggerTitle}>Choose Your Trigger</Text>

                    <FlatList
                        data={actions}
                        keyExtractor={(item) => item.id.toString()}
                        numColumns={2}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.actionItem}
                                onPress={() => handleActionPress(item.action)}
                            >
                                <Text style={styles.actionText}>{item.action}</Text>
                            </TouchableOpacity>
                        )}
                        contentContainerStyle={styles.actionsGrid}
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
    actionsGrid: {
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

export default ServiceActionDetail;

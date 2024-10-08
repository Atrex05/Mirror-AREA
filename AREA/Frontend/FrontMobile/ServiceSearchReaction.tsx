import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, Image } from 'react-native';
import { Button, Menu, Divider, Provider } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useRoute, useNavigation } from '@react-navigation/native';

const ServiceSearchReaction = () => {
    const navigation = useNavigation();
    const [searchQuery, setSearchQuery] = useState('');
    const [visible, setVisible] = useState(false);
    const route = useRoute();
    const [items] = useState([
        { id: 1, name: 'Discord', logo: require('./assets/discord-logo.png') },
        { id: 2, name: 'Spotify', logo: require('./assets/spotify-logo.png') },
        { id: 3, name: 'Facebook', logo: require('./assets/facebook-logo.png') },
        { id: 4, name: 'Riot', logo: require('./assets/riot-games-logo.png') },
        { id: 5, name: 'Linkedin', logo: require('./assets/linkedin-logo.png') },
        { id: 6, name: 'Instagram', logo: require('./assets/insta-logo.png') },
        { id: 7, name: 'Time', logo: require('./assets/time-logo.png') },
        { id: 8, name: 'X', logo: require('./assets/X-logo.png') },
        { id: 9, name: 'Google', logo: require('./assets/google-logo.png') },
    ]);
    const button1Data = route.params?.button1Data;

    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);

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

                <TextInput
                    style={styles.searchBar}
                    placeholder="Search your service..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />

                <FlatList
                    data={filteredItems}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={2}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.itemContainer}
                            onPress={() => navigation.navigate('ServiceReactionDetail', { ServiceInfo: item, button1Data: button1Data})}
                        >
                            <Image source={item.logo} style={styles.itemLogo} />
                            <Text style={styles.itemText}>{item.name}</Text>
                        </TouchableOpacity>
                    )}
                    contentContainerStyle={styles.itemsGrid}
                />
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
    searchBar: {
        backgroundColor: '#fff',
        padding: 10,
        marginHorizontal: 15,
        marginVertical: 10,
        borderRadius: 8,
    },
    itemsGrid: {
        paddingHorizontal: 10,
    },
    itemContainer: {
        flex: 1,
        margin: 10,
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemLogo: {
        width: 40,
        height: 40,
        marginBottom: 10,
    },
    itemText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#6200ea',
    },
});

export default ServiceSearchReaction;

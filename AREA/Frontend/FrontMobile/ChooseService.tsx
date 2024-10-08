import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, Animated, Image } from 'react-native';
import { Button, Menu, Divider, Provider } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';

const ChooseService = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const [visible, setVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [userEmail] = useState(route.params?.userEmail || 'example@example.com');

    const [items] = useState([
        { id: 1, name: 'Facebook', source: require('./assets/facebook-logo.png') },
        { id: 2, name: 'Instagram', source: require('./assets/insta-logo.png') },
        { id: 3, name: 'Google', source: require('./assets/google-logo.png') },
        { id: 4, name: 'X', source: require('./assets/X-logo.png') },
        { id: 5, name: 'Riot Games', source: require('./assets/riot-games-logo.png') },
        { id: 6, name: 'LinkedIn', source: require('./assets/linkedin-logo.png') },
        { id: 7, name: 'Discord', source: require('./assets/discord-logo.png') },
        { id: 8, name: 'Spotify', source: require('./assets/spotify-logo.png') },
        { id: 9, name: 'Time', source: require('./assets/time-logo.png') },
    ]);

    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);

    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

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

    const handleItemPress = (item) => {
        navigation.navigate('CreateYourAREA', {
            button1Data: {
                logo: item.source,
                name: item.name,
            },
            button2Data: {
                logo: item.source,
                name: item.name,
            },
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

                    <TouchableOpacity
                        style={styles.createAreaButton}
                        onPress={() => navigation.navigate('CreateYourAREA')}
                    >
                        <Text style={styles.createAreaButtonText}>Create your AREA</Text>
                    </TouchableOpacity>

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
                        <Text style={styles.menuEmail}>{userEmail}</Text>
                        <Divider />
                        <Menu.Item
                            onPress={() => navigation.navigate('Welcom')}
                            title="Logout"
                        />
                    </Menu>
                </View>

                <View style={styles.YourActionReactionContainer}>
                    <Animated.Text style={[styles.blinkText, { opacity }]}>
                        Choose a service
                    </Animated.Text>
                </View>

                <TextInput
                    style={styles.searchBar}
                    placeholder="Search your Service"
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
                            onPress={() => handleItemPress(item)}
                        >
                            <Image source={item.source} style={styles.icon} />
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
        marginTop: 30,
        flex: 1,
    },
    header: {
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
    createAreaButton: {
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    createAreaButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#6200ea',
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
        flexDirection: 'row',
    },
    icon: {
        width: 30,
        height: 30,
        marginRight: 10,
    },
    itemText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#6200ea',
    },
    YourActionReactionContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    YourActionReaction: {
        textAlign: 'center',
        fontSize: 20,
        color: '#fff',
    },
    blinkText: {
        textAlign: 'center',
        fontSize: 20,
        marginVertical: 10,
        color: 'red',
        marginLeft: 15,
    },
});

export default ChooseService;

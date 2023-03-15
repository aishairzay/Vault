import { View, Text, StyleSheet, TextInput, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../root';
import { RouteProp } from '@react-navigation/native';
import VaultButton from '../../components/VaultButton';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        alignItems: 'center', // Add alignItems center
    },
    centerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginTop: 36
    },
    text: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 36
    },
    imageText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: "center",
        marginTop: 10,
        alignSelf: "center"
    },
    selectedOption: {
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 4,
        padding: 4,
    },
    input: {
        backgroundColor: 'white',
        borderRadius: 5,
        paddingHorizontal: 10,
        height: 50,
        width: '75%',
        textAlign: 'left',
        textAlignVertical: 'center',
        marginTop: 10
    },
    headerText: {
        color: 'white',
        marginHorizontal: 5,
        marginBottom: 5,
        marginTop: 48,
        fontSize: 16
    },
    square: {
        backgroundColor: 'white',
        borderRadius: 10,
        width: 100,
        height: 100,
    }
});

type CreateVaultScreenNavigationProp = StackNavigationProp<RootStackParamList, 'CreateVault'>;
type CreateVaultScreenRouteProp = RouteProp<RootStackParamList, 'CreateVault'>;


type Props = {
    navigation: CreateVaultScreenNavigationProp;
    route: CreateVaultScreenRouteProp;
};

export default function CreateVault({ navigation }: Props) {

    return (
        <View style={styles.container}>
            <View style={styles.centerContainer}>
                <TouchableOpacity style={{ marginLeft: 20 }} onPress={() => navigation.goBack()}>
                    <Text style={styles.text}>X</Text>
                </TouchableOpacity>
                <Text style={{ marginRight: 125, ...styles.text }}>Create Vault</Text>

            </View>
            <Text style={styles.headerText}>How can the vault be opened?</Text>
            <View style={{ flexDirection: 'row' }}>
                <View style={styles.selectedOption}>
                    <Image source={require('../../assets/images/riddle.png')} />
                    <Text style={styles.imageText}>Solve a Riddle</Text>
                </View>
                <View>
                    <Image source={require('../../assets/images/play.png')} />
                    <Text style={styles.imageText}>Play a game</Text>
                </View>
            </View>
            <TextInput
                style={styles.input}
                placeholder="Enter the riddle description/hint"
            />
            <TextInput
                style={styles.input}
                placeholder="Enter the riddle answer"
            />
            <Text style={styles.headerText}>What's in the vault?</Text>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <View style={{ marginRight: 10 }}>
                    <View style={styles.square} />
                    <Text style={styles.imageText}>A Secret Message</Text>
                </View>
                <View style={{ marginRight: 10 }}>
                    <Image source={require('../../assets/images/kitty.png')} style={{ width: 100, height: 100 }} />
                    <Text style={styles.imageText}>An NFT</Text>
                </View>
                <View>
                    <View style={styles.square} />
                    <Text style={styles.imageText}>
                        Custon on- {"\n"}
                        chain Action
                    </Text>
                </View>
            </View>
            <VaultButton text="Create Vault" />
        </View>
    );
}

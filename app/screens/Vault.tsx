import { View, Text, StyleSheet, Image, StatusBar, KeyboardAvoidingView } from 'react-native';
import React, { useEffect } from 'react';
import LockedContent from '../../components/LockedContent';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../root';
import { RouteProp } from '@react-navigation/native';
import UnlockedContent from '../../components/UnlockedContent';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getVaultByVaultID } from '../../fcl';
import { createHash } from '../crypto/utils';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center', // Add alignItems center
        backgroundColor: 'black',
    },
    grayBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        height: '35%',
        backgroundColor: 'gray',
    },
    centerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 32
    },
    text: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold'
        
    },
    lockedText: {
        color: 'red',
        fontSize: 24,
        fontWeight: 'bold',
        textShadowColor: 'black',
        textShadowRadius: 5,
    },
    unlockedText: {
        color: '#00FF00',
        fontSize: 24,
        fontWeight: 'bold',
        textShadowColor: 'black',
        textShadowRadius: 5,
    },
    paragraph: {
        color: 'white',
        fontSize: 12,
        marginTop: 32,
        textAlign: "center",
        marginHorizontal: 32
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 5,
        marginBottom: 20,
        backgroundColor: 'white',
        borderRadius: 5,
        marginTop: 32
    },
    input: {
        flex: 1,
        height: 40,
        paddingHorizontal: 10,
        color: 'black',
        textAlign: 'left',
        textAlignVertical: 'center',
    },
});

type VaultScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Vault'>;
type VaultScreenRouteProp = RouteProp<RootStackParamList, 'Vault'>;


type Props = {
    navigation: VaultScreenNavigationProp;
    route: VaultScreenRouteProp;
};


export default function Vault({ route }: Props) {
    const [vault, setVault] = React.useState<any|null>(null);
    const [password, setPassword] = React.useState<string>('');
    const [isLocked, setIsLocked] = React.useState<boolean>(true);
    const vaultID = route.params.vaultID;

    useEffect(() => {
        const getVault = async () => {
            const vault = await getVaultByVaultID(vaultID);
            setVault(vault);
        }
        getVault()
    }, []);

    useEffect(() => {
        if (password.length === 0) {
            return
        }
        const run = async () => {
            const passwordKey = `${vault.passwordSalt}:${password}`
            const passwordHash = await createHash(passwordKey, vault.hashAlgorithm)
            if (passwordHash === vault.hashControl) {
                setIsLocked(false)
            }
        }
        run()
    }, [password])

    const insets = useSafeAreaInsets();

    return (
        <View
            style={[
                {
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'black',
                    paddingTop: insets.top,
                    paddingBottom: insets.bottom,
                    paddingLeft: insets.left,
                    paddingRight: insets.right,
                },
            ]}
        >
            <StatusBar barStyle="dark-content" backgroundColor="#ecf0f1" />
            <View style={styles.grayBackground} />
            <View style={styles.centerContainer}>
                <Text style={styles.text}>Vault #{vaultID}</Text>
                {isLocked === true ? <Text style={styles.lockedText}>LOCKED</Text> : <Text style={styles.unlockedText}>UNLOCKED</Text>}
            </View>
            <Image source={require('../../assets/images/vault.png')} style={{ alignSelf: 'center', marginTop: 30 }} />
            {vault === null ?? <Text style={styles.paragraph}>Loading...</Text>}
            <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={120}>
                {vault !== null && isLocked ? <LockedContent vault={vault} submitPassword={setPassword} /> : <UnlockedContent answer={password} vault={vault} />}
            </KeyboardAvoidingView>
        </View>
    );
}

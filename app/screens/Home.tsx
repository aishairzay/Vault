import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, StatusBar } from 'react-native';
import React, { useState } from 'react';
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
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32
  },
  text: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 36
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 5,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: 'white',
    borderRadius: 5,
    paddingHorizontal: 10,
    color: 'black',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  dividerText: {
    color: 'black',
    fontWeight: 'bold',
    textShadowColor: 'white',
    textShadowRadius: 5,
    fontSize: 32,
    borderWidth: 1
  },
  headerText: {
    color: 'green',
    fontWeight: 'bold',
    fontSize: 24,
    paddingHorizontal: 5
  },
});

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;
type HomeScreenRouteProp = RouteProp<RootStackParamList, 'Home'>;


type Props = {
  navigation: HomeScreenNavigationProp;
  route: HomeScreenRouteProp;
};

export default function Home({ navigation }: Props) {
  const [vaultId, setVaultId] = useState('');

  const handleGoToVault = () => {
    navigation.navigate('Vault', { isLocked: false }); // TODO: replace isLocked with the VaultID
  };

  const handleGoToCreate = () => {
    navigation.navigate('CreateVault');
  };

  return (
    <View style={styles.container}>
      <View style={styles.centerContainer}>
        <Text style={styles.text}>Mohar's Vault</Text>
      </View>
      <Text style={{ color: 'white', marginHorizontal: 5, marginBottom: 5, marginTop: 48, alignSelf: 'flex-start', fontSize: 16 }}>Enter a Vault ID</Text>
      <View style={[styles.inputContainer, { backgroundColor: 'white' }]}>
        <TextInput
          style={styles.input}
          placeholder="Vault ID"
          placeholderTextColor="gray"
          value={vaultId}
          onChangeText={setVaultId}
        />
      </View>
      <TouchableOpacity style={{ marginTop: 20, alignSelf: 'flex-start' }} onPress={handleGoToVault}>
        <Text style={styles.headerText}>Go to Vault</Text>
      </TouchableOpacity>
      <View style={styles.dividerContainer}>
        <Text style={styles.dividerText}>OR</Text>
      </View>
      <Image source={require('../../assets/images/lock.png')} style={{ alignSelf: 'center', marginTop: 30 }} />
      <VaultButton onPress={handleGoToCreate} text="Create a new vault" />
    </View>
  );
}

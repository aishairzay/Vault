import { Text, StyleSheet, TouchableOpacity, GestureResponderEvent } from 'react-native';
import React from 'react';

const styles = StyleSheet.create({
    newVaultButton: {
        backgroundColor: 'green',
        borderRadius: 20,
        paddingVertical: 15,
        paddingHorizontal: 100,
        marginBottom: 30,
        marginTop: 30
    },
    newVaultButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    }
});

type VaultButtonProps = {
    text: string
    onPress?: ((event: GestureResponderEvent) => void) | ((event: GestureResponderEvent) => Promise<void>) | undefined
}

export default function VaultButton({ text, onPress }: VaultButtonProps) {
    return (
        <TouchableOpacity style={styles.newVaultButton} onPress={onPress}>
            <Text style={styles.newVaultButtonText}>{text}</Text>
        </TouchableOpacity>
    )
}
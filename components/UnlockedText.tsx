import { Text, StyleSheet } from 'react-native';
import React from 'react';
import ParagraphText from './ParagraphText';

const styles = StyleSheet.create({
    text: {
        color: 'white',
        fontSize: 24,
        marginTop: 32,
        textAlign: "center",
        marginHorizontal: 32
    }
});

export default function UnlockedText() {
    return (
        <>
            <ParagraphText text="It seems there is a note with a message inside" />
            <Text style={styles.text}>Join the secret discord https://discord.gg/abc123</Text>
        </>
    )
}
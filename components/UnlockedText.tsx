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

export default function UnlockedText({ text }: { text: string }) {
    return (
        <>
            <ParagraphText text="It seems there is a note with a message inside" />
            <Text style={styles.text}>{text}</Text>
        </>
    )
}
import { View, Text, StyleSheet, TextInput } from 'react-native';
import React from 'react';
import ParagraphText from './ParagraphText';

const styles = StyleSheet.create({
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

export default function LockedContent() {
    return (
        <>
            <ParagraphText text="There's a note on the vault..." />
            <ParagraphText text="They come out at nightwithout being called,
                And are lost in the day without being stolen" />
             <ParagraphText text="And there seems to be a keypad..." />
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="gray"
                />
                <Text style={{ position: 'absolute', right: 10, top: 13, color: 'green' }}>Enter</Text>
            </View>
        </>
    )
}
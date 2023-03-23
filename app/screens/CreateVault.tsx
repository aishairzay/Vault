import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Image,
    TouchableOpacity,
    Alert,
    KeyboardAvoidingView,
} from "react-native";
import React, { useState } from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../root";
import { RouteProp } from "@react-navigation/native";
import VaultButton from "../../components/VaultButton";
import { createOrGetFlowAccount } from "../utils/getFlowAccount";
import { FlowHelper } from "../../flow/FlowHelper";
import * as Crypto from "expo-crypto";
import {
    buf2hex,
    getHashControl,
    symmetricEncryptMessage,
} from "../crypto/utils";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "black",
        alignItems: "center", // Add alignItems center
    },
    centerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        marginTop: 36,
    },
    text: {
        color: "white",
        fontSize: 24,
        fontWeight: "bold",
        marginTop: 36,
    },
    textInput: {
        color: "black",
    },
    imageText: {
        color: "white",
        fontSize: 12,
        fontWeight: "bold",
        textAlign: "center",
        marginTop: 10,
        alignSelf: "center",
    },
    selectedOption: {
        borderWidth: 1,
        borderColor: "white",
        borderRadius: 4,
        padding: 4,
        justifyContent: "center",
        alignItems: "center",
    },
    input: {
        backgroundColor: "white",
        borderRadius: 5,
        paddingHorizontal: 10,
        height: 50,
        width: "75%",
        textAlign: "left",
        textAlignVertical: "center",
        marginTop: 10,
    },
    largeInput: {
        backgroundColor: "white",
        borderRadius: 5,
        paddingHorizontal: 10,
        height: 100,
        width: 100,
        textAlign: "left",
        textAlignVertical: "center",
        marginTop: 10,
    },
    headerText: {
        color: "white",
        marginHorizontal: 5,
        marginBottom: 5,
        marginTop: 32,
        fontSize: 16,
    },
    square: {
        backgroundColor: "white",
        borderRadius: 10,
        width: 100,
        height: 100,
    },
    disabledOption: {
        opacity: 0.4,
        borderRadius: 4,
        padding: 4,
    },
    disabledText: {
        color: "lightgray",
    },
});

type CreateVaultScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    "CreateVault"
>;
type CreateVaultScreenRouteProp = RouteProp<RootStackParamList, "CreateVault">;

type Props = {
    navigation: CreateVaultScreenNavigationProp;
    route: CreateVaultScreenRouteProp;
};

export default function CreateVault({ navigation }: Props) {
    const [type, setType] = useState("riddle");
    const [input, setInput] = useState({} as any);

    const createVault = async () => {
        if (type === "riddle") {
            if (
                !input.riddleAnswer &&
                !input.riddleSecret &&
                !input.description
            ) {
                Alert.alert(
                    "Invalid Input",
                    "Please fill out all of the fields.",
                    [],
                    {
                        cancelable: true,
                    }
                );
                return;
            }
        }
        const account = await createOrGetFlowAccount();
        const flowHelper = new FlowHelper(account);
        const salt = buf2hex(await Crypto.getRandomBytesAsync(8));
        const hashControl = await getHashControl(salt, input.riddleAnswer);
        const encryptedMessage = symmetricEncryptMessage(
            input.riddleSecret,
            salt,
            "AES"
        );
        const response = await flowHelper.startTransaction(
            `
        import VaultService from 0xbbbeb7f62d6d47dd
        
        transaction(description: String, thumbnail: String, passwordSalt: String, hashControl: String, hashAlgorithm: String, encryptedMessage: String?, encryptionAlgorithm: String?, derivedPublicKey: String?) {
          let vaultCollection: &VaultService.VaultCollection
        
          prepare(signer: AuthAccount) {
            var vaultCollectionCap = signer.borrow<&VaultService.VaultCollection>(from: /storage/VaultCollection)
            if (vaultCollectionCap == nil) {
              let vaultCollection <- VaultService.createVaultCollection()
              signer.save(<-vaultCollection, to: /storage/VaultCollection)
              vaultCollectionCap = signer.borrow<&VaultService.VaultCollection>(from: /storage/VaultCollection)
              self.vaultCollection = vaultCollectionCap!
            } else {
              self.vaultCollection = vaultCollectionCap!
            }
            signer.link<&{VaultService.VaultCollectionPublic}>(/public/VaultCollection, target: /storage/VaultCollection)
          }
        
          execute {
            let vault <- VaultService.createVault(description: description, thumbnail: thumbnail, passwordSalt: passwordSalt, hashControl: hashControl, hashAlgorithm: hashAlgorithm, encryptedMessage: encryptedMessage, encryptionAlgorithm: encryptionAlgorithm, derivedPublicKey: derivedPublicKey, action: nil)
            self.vaultCollection.deposit(vault: <-vault)
          }
        }
        `,

            (arg: any, t: any) => [
                arg(input.description, t.String),
                arg("none", t.String),
                arg(salt, t.String),
                arg(hashControl, t.String),
                arg("SHA256", t.String),
                arg(encryptedMessage, t.String),
                arg("AES", t.String),
                arg("none", t.String),
            ]
        );
        const vaultEvent = response.events.find((e: any) =>
            e.type.includes("VaultCreated")
        );
        navigation.navigate("Vault", { vaultID: vaultEvent.data.id });
    };

    return (
        <View style={styles.container}>
            <View style={styles.centerContainer}>
                <TouchableOpacity
                    style={{ marginLeft: 20 }}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.text}>X</Text>
                </TouchableOpacity>
                <Text style={{ marginRight: 125, ...styles.text }}>
                    Create Vault
                </Text>
            </View>
            <Text style={styles.headerText}>How can the vault be opened?</Text>
            <View style={{ flexDirection: "row" }}>
                <View
                    style={styles.selectedOption}
                    onResponderRelease={() => setType("riddle")}
                >
                    <Image source={require("../../assets/images/riddle.png")} />
                    <Text style={styles.imageText}>Solve a Riddle</Text>
                </View>
                <View style={styles.disabledOption}>
                    <Image source={require("../../assets/images/play.png")} />
                    <Text style={[styles.imageText, styles.disabledText]}>
                        Play a game
                    </Text>
                </View>
            </View>
            {type === "riddle" && (
                <>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter the riddle description/hint"
                        placeholderTextColor="#4d4d4d"
                        onChangeText={(text) => {
                            setInput({
                                ...input,
                                description: text,
                            });
                        }}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Enter the riddle answer"
                        placeholderTextColor="#4d4d4d"
                        onChangeText={(text) => {
                            setInput({
                                ...input,
                                riddleAnswer: text,
                            });
                        }}
                    />
                    <Text style={styles.headerText}>What's in the vault?</Text>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "flex-start",
                            justifyContent: "space-between",
                        }}
                    >
                        <View
                            style={{
                                marginRight: 10,
                                ...styles.selectedOption,
                            }}
                        >
                            <Image
                                source={require("../../assets/images/secretmessage.png")}
                                style={{ width: 100, height: 100 }}
                            />
                            <Text style={styles.imageText}>
                                A Secret Message
                            </Text>
                        </View>
                        <View
                            style={{
                                marginRight: 10,
                                ...styles.disabledOption,
                            }}
                        >
                            <Image
                                source={require("../../assets/images/kitty.png")}
                                style={{ width: 100, height: 100 }}
                            />
                            <Text
                                style={[styles.imageText, styles.disabledText]}
                            >
                                An NFT
                            </Text>
                        </View>
                        <View style={styles.disabledOption}>
                            <Image
                                source={require("../../assets/images/flow.png")}
                                style={{ width: 100, height: 100 }}
                            />
                            <Text
                                style={[styles.imageText, styles.disabledText]}
                            >
                                Custom on- {"\n"}
                                chain Action
                            </Text>
                        </View>
                    </View>
                    <KeyboardAvoidingView
                        behavior="position"
                        style={{ paddingLeft: 80, width: "100%" }}
                    >
                        <TextInput
                            style={styles.input}
                            placeholder="Enter the secret message"
                            placeholderTextColor="#4d4d4d"
                            onChangeText={(text) => {
                                setInput({
                                    ...input,
                                    riddleSecret: text,
                                });
                            }}
                        />
                    </KeyboardAvoidingView>
                </>
            )}
            <VaultButton onPress={createVault} text="Create Vault" />
        </View>
    );
}

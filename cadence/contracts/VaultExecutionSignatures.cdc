pub contract VaultExecutionSignatures {
  pub fun verifySignature(signed: String, message: String, publicKey: String): Bool {
    let publicKey = PublicKey(
        publicKey: publicKey.decodeHex(),
        signatureAlgorithm: Crypto.ECDSA_secp256k1
    )

    let sig = signed.decodeHex()

    return publicKey.verify(
      signature: sig,
      signedData: message,
      domainSeparationTag: "",
      hashAlgorithm: HashAlgorithm.SHA2_256
    )
  }
}
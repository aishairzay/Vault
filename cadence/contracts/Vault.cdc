pub contract MoharsVault {

  // An action that can be run when a user opens a vault
  pub resource interface VaultAction {
    // The vault that was opened should be passed in as a reference
    // and the address that opened it is provided as well, allowing for
    // actions to be taken that affect that account.
    pub fun execute(vault: &Vault, address: Address)
  }

  // To make vaults globally accessible, we wire up the vault collection
  // resource with a global map here that can be used to access what account
  // is holding a specific vault by ID.
  pub let vaultAddresses: {UInt64: Address}

  // We keep a top-level collection of vaults that can be accessed by
  // the vault's UUID.
  pub resource VaultCollection {
    pub var vaults: @{UInt64: Vault} // Vault UUID to vault

    // allow deposits, withdraws, and transfers of a vault
    // to other accounts
    pub fun deposit(vault: @Vault) {
      let oldVault <- self.vaults[vault.uuid] <- vault
      destroy oldVault
    }

    pub fun getIDs(): [UInt64] {
      return self.vaults.keys
    }

    pub fun borrowVault(uuid: UInt64): &Vault? {
      post {
          result == nil || result!.uuid == uuid: "The returned reference's ID does not match the requested ID"
      }
      return nil
    }

    destroy() {
      destroy self.vaults
    }

    init() {
      self.vaults <- {}
    }
  }

  pub resource Vault {
    // ID for the vault, equivalent to the vault's unique UUID.
    pub let id: UInt64

    // The control string is used to verify if a user has access to a vault.
    // It is intended to be a hash of the vault's ID combined with the secret
    //  to open the vault like the following: {vaultID}:{secret}
    // The hash algorithm used to generate the control string should be
    // specified in the hashAlgorithm field.
    pub let hashControl: String

    // The hash algorithm used to generate the control string.
    pub let hashAlgorithm: String

    // The data string is used to store any secret string for the vault, and
    // should be encrypted using the same key as the control string.
    pub let encryptedData: String?

    // If there is encrypted data, this should be set to let a consumer know
    // what algorithm was used for the symmetric encryption.
    pub let encryptionAlgorithm: String?

    // Using the secret phrase for this vault, a key pair should be derived
    // and the public key should be published on-chain here if the vault
    // requiers any assymetric keys for gating access to an action.
    pub let derivedPublicKey: String?

    // The vault should be able to store an action that can be
    // performed on it. These actions should be able to be executed by
    // by a third party that has access to a derived public key.
    pub let action: Capability<&{VaultAction}>?

    pub fun getViews(): [Type] {
      return []
    }

    pub fun resolveView(_ view: Type): AnyStruct? {
      return nil
    }

    init(hashControl: String, hashAlgorithm: String, encryptedData: String?, encryptionAlgorithm: String?, derivedPublicKey: String?, action: Capability<&{VaultAction}>?) {
      self.id = self.uuid
      self.hashControl = hashControl
      self.hashAlgorithm = hashAlgorithm
      self.encryptedData = encryptedData
      self.encryptionAlgorithm = encryptionAlgorithm
      self.derivedPublicKey = derivedPublicKey
      self.action = action
    }
  }

  pub fun createVaultCollection(): @VaultCollection {
    return <- create VaultCollection()
  }

  // Public method to create a vault
  pub fun createVault(hashControl: String, hashAlgorithm: String, encryptedData: String?, encryptionAlgorithm: String?, derivedPublicKey: String?, action: Capability<&{VaultAction}>?): @Vault {
    return <- create Vault(
      hashControl: hashControl,
      hashAlgorithm: hashAlgorithm,
      encryptedData: encryptedData,
      encryptionAlgorithm: encryptionAlgorithm,
      derivedPublicKey: derivedPublicKey,
      action: action
    )
  }

  init() {
    self.vaultAddresses = {}
  }
}

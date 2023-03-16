// You can make your own vault action!
// Deploy a contract similar to this, with your own implementation details.
// Then specify the contract in the app when creating your vault to use it.
import "MetadataViews"
import "NonFungibleToken"
import "VaultService"

pub contract SomeStandardVaultActions {
  pub resource DestroyNFTAction: VaultService.VaultAction, MetadataViews.Resolver {
    pub fun getViews(): [Type] {
      return [
        Type<MetadataViews.Display>()
      ]
    }

    pub fun resolveView(_ view: Type): AnyStruct? {
      return [
        MetadataViews.Display(
          name: "Destroy NFT",
          description: "Destroy the NFT",
          thumbnail: MetadataViews.HTTPFile(url: "https://example.com/icon.png")
        )
      ]
    }

    pub let nftAccess: Capability<&{NonFungibleToken.Provider}>
    pub let nftID: UInt64

    init(nftAccess: Capability<&{NonFungibleToken.Provider}>, nftID: UInt64) {
      self.nftAccess = nftAccess
      self.nftID = nftID
    }

    pub fun execute(vault: &VaultService.Vault, address: Address) {
      let nftCollection = self.nftAccess.borrow()
        ?? panic("Could not borrow NFT collection")

      let nft <- nftCollection.withdraw(withdrawID: self.nftID)

      // destroy the NFT
      destroy nft
    }
  }
}

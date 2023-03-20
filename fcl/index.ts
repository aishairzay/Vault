import "./config.ts"
import * as fcl from '@onflow/fcl';
import { createHash } from "../app/crypto/utils";

export const getVaultByVaultID = async (vaultID: String) => {
  // use fcl to call the getVault script
  // return the vault
  // TODO: Unhardcode the testnet address here...
  const vault = await fcl.query({
    cadence: `
      import VaultService from 0xbbbeb7f62d6d47dd

      pub fun main(vaultID: UInt64):AnyStruct {
        let address = VaultService.vaultAddresses[vaultID] ?? panic("No address found")
        let vaultCollection = getAccount(address).getCapability<&{VaultService.VaultCollectionPublic}>(/public/VaultCollection).borrow()
          ?? panic("Could not borrow capability from public collection")
        let vault = vaultCollection.borrowVault(uuid: vaultID)
        return vault
      }
    `,
    args: (arg, t) => [
      arg(parseInt(vaultID.toString()).toString(), t.UInt64)
    ],
  });
  return vault;
}
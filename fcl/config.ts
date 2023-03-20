// setup FCL to point to testnet
import {config} from "@onflow/fcl"

// TODO: Support switching between testnet and mainnet.
config({
  "accessNode.api": "https://rest-testnet.onflow.org",
  "discovery.wallet": "https://fcl-discovery.onflow.org/testnet/authn",
})

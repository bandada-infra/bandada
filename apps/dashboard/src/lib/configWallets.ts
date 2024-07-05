import { connectorsForWallets } from "@rainbow-me/rainbowkit"
import { http } from "viem"
import { mintSepoliaTestnet } from "viem/chains"
import { createConfig } from 'wagmi';
import {
    coinbaseWallet,
    injectedWallet,
    metaMaskWallet,
    walletConnectWallet,
    rabbyWallet
} from "@rainbow-me/rainbowkit/wallets"

const connectors = connectorsForWallets(
  [
    {
        groupName: "Wallets",
        wallets: [coinbaseWallet, injectedWallet, metaMaskWallet, walletConnectWallet, rabbyWallet]
    }
  ],
  {
    appName: 'Bandada',
    projectId: import.meta.env.VITE_WALLETCONNECT_CLOUD_ID,
  }
)

export const configWallets = createConfig({
    chains: [mintSepoliaTestnet],
    transports: {
        [mintSepoliaTestnet.id]: http()
    },
    connectors
})

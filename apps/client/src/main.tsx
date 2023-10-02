import { ChakraProvider } from "@chakra-ui/react"
import "@fontsource-variable/unbounded"
import { Web3ReactProvider } from "@web3-react/core"
import { providers } from "ethers"
import * as ReactDOM from "react-dom/client"
import Routes from "./routes"
import theme from "./styles"
import './polyfills';
import '@rainbow-me/rainbowkit/styles.css';
import './global.css';

import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { configureChains,createConfig, WagmiConfig } from 'wagmi';
// import { InjectedConnector } from 'wagmi/connectors/injected';
// import { configureChains,createConfig } from 'wagmi';
// import { mainnet, polygon, optimism, arbitrum, base, zora } from 'wagmi/chains';
import { mainnet, polygon, optimism, arbitrum } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import React from 'react';
// import App from './App';

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)

const { chains, publicClient } = configureChains(
//   [mainnet, polygon, optimism, arbitrum, base, zora],
[mainnet, polygon, optimism, arbitrum],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: 'RainbowKit demo',
  projectId: 'YOUR_PROJECT_ID',
  chains,
});

const config = createConfig({
  autoConnect: false,
  connectors,
// connectors: [new InjectedConnector()], 
  publicClient,
});

// ReactDOM.createRoot(document.getElementById('root')!).render(
//   <React.StrictMode>
//     <WagmiConfig client={config}>
//       <RainbowKitProvider chains={chains}>
//         <Routes />
//       </RainbowKitProvider>
//     </WagmiConfig>
//   </React.StrictMode>
// );

root.render(
    <Web3ReactProvider
        getLibrary={(provider) => new providers.Web3Provider(provider)}
    >
    <WagmiConfig config={config}>
    <RainbowKitProvider chains={chains}>
        <ChakraProvider theme={theme}>
            <Routes />
        </ChakraProvider>
        </RainbowKitProvider>
        </WagmiConfig>
    </Web3ReactProvider>
)


import {
    AuthenticationStatus,
    createAuthenticationAdapter,
    lightTheme,
    RainbowKitAuthenticationProvider,
    RainbowKitProvider
  } from "@rainbow-me/rainbowkit";
  import React, { ReactNode, useEffect, useMemo, useState } from "react";
  import { WagmiProvider } from "wagmi";
  import { getNonce, logOut, signIn } from "../api/bandadaAPI";
  import useSessionData from "../hooks/use-session-data";
  import { Admin } from "../types";
  import { SiweMessage } from 'siwe';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { configWallets } from "../lib/configWallets";
  
  const appName = "Bandada";
  
  export const AuthContext = React.createContext<{ admin?: Admin | null }>({});
  
  export function AuthContextProvider({ children }: { children: ReactNode }) {
    const [authStatus, setAuthStatus] =
      useState<AuthenticationStatus>("loading");
    const { admin, saveAdmin, deleteAdmin } = useSessionData();
  
    useEffect(() => {
      setAuthStatus(admin ? "authenticated" : "unauthenticated");
    }, [admin]);
  
    const contextValue = useMemo(() => ({ admin }), [admin]);
    const authAdapter = useMemo(
      () =>
        createAuthenticationAdapter({
          async getNonce() {
            const nonce = await getNonce();
            return nonce ?? "";
          },
  
          createMessage: ({ nonce, address, chainId }) =>
            new SiweMessage({
              domain: window.location.host,
              address,
              statement:
                "You are using your Ethereum Wallet to sign in to Bandada.",
              uri: window.location.origin,
              version: "1",
              chainId,
              nonce
            }),
  
          getMessageBody: ({ message }) => message.prepareMessage(),
  
          verify: async ({ message, signature }) => {
            const admin: Admin = await signIn({
              message,
              signature
            });
  
            if (admin) {
              saveAdmin(admin);
              return true;
            }
  
            return false;
          },
  
          signOut: async () => {
            await logOut();
            deleteAdmin();
          }
        }),
      [saveAdmin, deleteAdmin]
    );
  
    const queryClient = new QueryClient()
  
    return (
        <AuthContext.Provider value={contextValue}>
          <WagmiProvider config={configWallets}>
            <QueryClientProvider client={queryClient}>
              <RainbowKitAuthenticationProvider
                adapter={authAdapter}
                status={authStatus}
              >
                <RainbowKitProvider
                  modalSize="compact"
                  theme={lightTheme()}
                  appInfo={{ appName }}
                  showRecentTransactions={false}
                >
                  {children}
                </RainbowKitProvider>
              </RainbowKitAuthenticationProvider>
            </QueryClientProvider >
          </WagmiProvider>
        </AuthContext.Provider>
    );
  }
  
import React, { useMemo } from "react";
import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
import { ConnectionProvider } from "@solana/wallet-adapter-react";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import ClientWalletProvider from "@components/contexts/ClientWalletProvider";
import { SOLANA_DEV } from "@utils/endpoints";

import "../styles/globals.css";
import "../styles/App.css";
import { Toaster } from "react-hot-toast";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { clusterApiUrl } from "@solana/web3.js";
import { Header } from "@components/layout/header";

const ReactUIWalletModalProviderDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletModalProvider,
  { ssr: false }
);

function MyApp({ Component, pageProps }: AppProps) {
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);
  const network = WalletAdapterNetwork.Devnet
  const rpcUrl = useMemo(() => clusterApiUrl(network), [network])
  return (
    <ConnectionProvider endpoint={SOLANA_DEV}>
      <ClientWalletProvider wallets={wallets}>
        <ReactUIWalletModalProviderDynamic>
          <Toaster position="bottom-right" reverseOrder={true} />
          <Header />
          <Component {...pageProps} />
        </ReactUIWalletModalProviderDynamic>
      </ClientWalletProvider>
    </ConnectionProvider>
  );
}

export default MyApp;

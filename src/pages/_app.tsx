import React, { useMemo } from "react";
import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
import { ConnectionProvider } from "@solana/wallet-adapter-react";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import ClientWalletProvider from "@components/contexts/ClientWalletProvider";
import { NETWORK } from "@utils/endpoints";

import "../styles/globals.css";
import "../styles/App.css";
import { Toaster } from "react-hot-toast";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "../../lib/theme/theme.js"
import { fonts } from '../../lib/fonts/fonts.js'

const ReactUIWalletModalProviderDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletModalProvider,
  { ssr: false }
);

function MyApp({ Component, pageProps }: AppProps) {
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  return (
    <ConnectionProvider endpoint={NETWORK}>
      <ClientWalletProvider wallets={wallets}>
        <ReactUIWalletModalProviderDynamic>
          <Toaster position="bottom-right" reverseOrder={true} />
          <style jsx global>
            {`
        :root {
          --font-lexend: ${fonts.lexend.style.fontFamily};
        }
      `}
          </style>
          <ChakraProvider theme={theme}>
            <Component {...pageProps} />
          </ChakraProvider>
        </ReactUIWalletModalProviderDynamic>
      </ClientWalletProvider>
    </ConnectionProvider>
  );
}

export default MyApp;

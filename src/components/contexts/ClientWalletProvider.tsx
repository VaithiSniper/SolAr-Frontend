import type { WalletProviderProps } from "@solana/wallet-adapter-react";
import { WalletProvider } from "@solana/wallet-adapter-react";

import { useCallback } from "react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";

import "@solana/wallet-adapter-react-ui/styles.css";
import { WalletError } from "@solana/wallet-adapter-base";
import { toast } from "react-hot-toast";

export function ClientWalletProvider({
  wallets,
  children,
}: WalletProviderProps): JSX.Element {
  const onError = useCallback((error: WalletError) => {
    console.error(error);
    toast.error(error.toString());
  }, []);

  return (
    <WalletProvider wallets={wallets} autoConnect={true} onError={onError}>
      <WalletModalProvider>{children}</WalletModalProvider>
    </WalletProvider>
  );
}

export default ClientWalletProvider;

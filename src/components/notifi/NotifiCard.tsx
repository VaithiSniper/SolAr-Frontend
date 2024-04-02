import {
  NotifiContext,
  NotifiInputFieldsText,
  NotifiInputSeparators,
  NotifiSubscriptionCard,
} from '@notifi-network/notifi-react-card';
import '@notifi-network/notifi-react-card/dist/index.css';
import { MemoProgramHardwareLoginPlugin } from '@notifi-network/notifi-solana-hw-login';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useMemo } from 'react';

// import './NotifiCard.css';

export default function NotifiCard() {
  const { connection } = useConnection();
  const { wallet, sendTransaction, signMessage } = useWallet();
  const adapter = wallet?.adapter;
  const publicKey = adapter?.publicKey?.toBase58() ?? null;

  const hwLoginPlugin = useMemo(() => {
    return new MemoProgramHardwareLoginPlugin({
      walletPublicKey: publicKey ?? '',
      connection,
      sendTransaction,
    });
  }, [publicKey, connection, sendTransaction]);

  if (publicKey === null || signMessage === undefined) {
    // publicKey is required
    return null;
  }

  const inputLabels: NotifiInputFieldsText = {
    label: {
      email: 'Email',
    },
    placeholderText: {
      email: 'Email',
    },
  };

  const inputSeparators: NotifiInputSeparators = {
  };

  return (
    <div>
      <NotifiContext
        dappAddress={process.env.NEXT_PUBLIC_NOTIFI_DAPP_ID || ""}
        walletBlockchain="SOLANA"
        env="Production"
        walletPublicKey={publicKey}
        hardwareLoginPlugin={hwLoginPlugin}
        signMessage={signMessage}
      >
        <NotifiSubscriptionCard
          darkMode
          inputLabels={inputLabels}
          inputSeparators={inputSeparators}
          cardId={process.env.NEXT_PUBLIC_NOTIFI_NOTIFICATION_CARD_ID || ""}
        />
      </NotifiContext>
    </div>
  );
};

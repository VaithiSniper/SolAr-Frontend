import { useWallet } from "@solana/wallet-adapter-react";
import React from "react";
import { Heading } from "@chakra-ui/react";

export function HomeContent() {
  const { publicKey } = useWallet();

  // If you change your wallet, then refresh
  const prevPublickKey = React.useRef<string>(publicKey?.toBase58() || "");
  // Reset the state if wallet changes or disconnects
  React.useEffect(() => {
    if (publicKey && publicKey.toBase58() !== prevPublickKey.current) {
      prevPublickKey.current === publicKey.toBase58();
    }
  }, [publicKey]);

  return (
    <div className="grid grid-cols-1 text-white m-8">
      <Heading fontFamily="Harmoneux" fontSize={100} textAlign="center">
        SOLAR
      </Heading>
      Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit enim labore culpa sint ad nisi Lorem pariatur mollit ex esse exercitation amet. Nisi anim cupidatat excepteur officia. Reprehenderit nostrud nostrud ipsum Lorem est aliquip amet voluptate voluptate dolor minim nulla est proident. Nostrud officia pariatur ut officia. Sit irure elit esse ea nulla sunt ex occaecat reprehenderit commodo officia dolor Lorem duis laboris cupidatat officia voluptate. Culpa proident adipisicing id nulla nisi laboris ex in Lorem sunt duis officia eiusmod. Aliqua reprehenderit commodo ex non excepteur duis sunt velit enim. Voluptate laboris sint cupidatat ullamco ut ea consectetur et est culpa et culpa duis.
    </div>
  );
}

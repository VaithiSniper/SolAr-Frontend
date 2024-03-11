import { useWallet } from "@solana/wallet-adapter-react";

import React, { ChangeEvent, useState } from "react";
import { Heading } from "@chakra-ui/react";
import { Button } from "./button";
import { useUser } from "src/hooks/userHooks";

export function HomeContent() {
  const { publicKey } = useWallet();

  // If you change your wallet, then refresh
  const prevPublickKey = React.useRef<string>(publicKey?.toBase58() || "");

  const [username, setUsername] = useState("");
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleInitializeUser = () => {
    initializeUser(username);
  };

  // Reset the state if wallet changes or disconnects
  React.useEffect(() => {
    if (publicKey && publicKey.toBase58() !== prevPublickKey.current) {
      prevPublickKey.current === publicKey.toBase58();
    }
  }, [publicKey]);

  const { initializeUser, isExisitingUser, loading } = useUser();

  return (
    <div className="text-white m-8 w-full justify-center">
      <Heading fontFamily="Harmoneux" fontSize={100} textAlign="center">
        SOLAR
      </Heading>
      {isExisitingUser ? (
        <div className="w-1/4 flex flex-col justify-center text-center gap-y-2">
          You look like you're new here
          <input
            name="name"
            value={username}
            onChange={handleChange}
            className="text-black rounded-lg p-2"
            placeholder="Enter your new username"
          />
          <div className="justify-center">
            <Button
              onClick={handleInitializeUser}
              state={loading ? "loading" : "initial"}
              className="bg-pink-500 rounded-lg p-4"
            >
              Initialize
            </Button>
          </div>
        </div>
      ) : (
        <p>
          Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit
          enim labore culpa sint ad nisi Lorem pariatur mollit ex esse
          exercitation amet. Nisi anim cupidatat excepteur officia.
          Reprehenderit nostrud nostrud ipsum Lorem est aliquip amet voluptate
          voluptate dolor minim nulla est proident. Nostrud officia pariatur ut
          officia. Sit irure elit esse ea nulla sunt ex occaecat reprehenderit
          commodo officia dolor Lorem duis laboris cupidatat officia voluptate.
          Culpa proident adipisicing id nulla nisi laboris ex in Lorem sunt duis
          officia eiusmod. Aliqua reprehenderit commodo ex non excepteur duis
          sunt velit enim. Voluptate laboris sint cupidatat ullamco ut ea
          consectetur et est culpa et culpa duis.
        </p>
      )}
    </div>
  );
}

import { useWallet } from "@solana/wallet-adapter-react";
import React, { ChangeEvent, useState } from "react";
import { Button } from "../general/button";
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

  const { initializeUser, isExisitingUser, loading, user } = useUser();

  return (
    <div className="text-white m-8 w-full justify-center">
      <h1 className="text-center text-banner font-heading">
        SOLAR
      </h1>
      {
        !isExisitingUser ? (
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
                className="p-2 text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm sm:w-auto px-5 py-2.5 text-center"
              >
                Initialize
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-center text-2xl">
            Welcome back, <strong>{user.username}</strong>
            {/* <table> */}
            {/*   <tr> */}
            {/*     <th>Total Cases</th> */}
            {/*     <th>Latest Case</th> */}
            {/*   </tr> */}
            {/*   <tr> */}
            {/*     <td>{user.casesCount}</td> */}
            {/*     <td>{user.latestCase}</td> */}
            {/*   </tr> */}
            {/* </table> */}
          </p>
        )}
    </div>
  );
}

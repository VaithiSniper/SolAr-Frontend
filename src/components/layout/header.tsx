import React from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useUser } from "src/hooks/userHooks";
type navLink = {
  label: string;
  link: string;
};

export function Header() {
  const route = useRouter();
  const path = route.pathname;

  const currentPathStyles = "mx-4 underline";
  const defaultStyles = "mx-4";
  const { connected, wallets } = useWallet();
  const data: navLink[] = [
    { label: "Link1", link: "/link1" },
    { label: "Link2", link: "/link2" },
  ];

  const { publicKey } = useWallet();

  const { isAdminUser, isExisitingUser, loading, setLoading, user, initializeUserProfile } =
    useUser();

  return (
    <>
      <div className="navbar bg-base-100 flex flex-row justify-between">
        <div>
          <Link className="flex flex-row" href="/">
            <Image
              alt="get eyes"
              src="/logo.png"
              width={50}
              height={50}
            ></Image>
            <span className="btn btn-ghost text-xl">SolAr</span>
          </Link>
        </div>
        <div>
          {/* links that should be accessible only after logging in */}
          {publicKey ? (
            <>
              <Link
                className={
                  path.includes("/myCases") ? currentPathStyles : defaultStyles
                }
                href="/myCases"
              >
                My Cases
              </Link>
            </>
          ) : null}
          {/* login or profile button is always displayed */}
          {publicKey && isExisitingUser ? (
            <Link href="/profile">
              <div
                tabIndex={0}
                role="button"
                className="btn m-1 bg-fuchsia-400"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                >
                  <path d="M12,2C6.477,2,2,6.477,2,12c0,5.523,4.477,10,10,10s10-4.477,10-10C22,6.477,17.523,2,12,2z M12,4.75 c1.795,0,3.25,1.455,3.25,3.25s-1.455,3.25-3.25,3.25S8.75,9.795,8.75,8S10.205,4.75,12,4.75z M12,20 c-2.77,0-5.21-1.408-6.646-3.547C6.475,14.823,10.046,14,12,14s5.525,0.823,6.646,2.453C17.21,18.592,14.77,20,12,20z"></path>
                </svg>
              </div>
            </Link>
          ) : (
            <Link href={isAdminUser ? "/admin/login" : "/login"}>
              <div
                tabIndex={0}
                role="button"
                className="btn m-1 bg-fuchsia-300 hover:bg-fuchsia-500 text-black"
              >
                Login
              </div>
            </Link>
          )}
        </div>
      </div>
    </>
  );
}

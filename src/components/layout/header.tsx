import React from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Flex, Button, HStack, chakra, Heading } from '@chakra-ui/react';
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";

type navLink = {
  label: string;
  link: string;
}

export function Header() {
  const route = useRouter()
  const path = route.pathname

  const currentPathStyles = 'mx-4 underline'
  const defaultStyles = 'mx-4'
  const { connected, wallets } = useWallet();
  const data: navLink[] = [
    { label: "Link1", link: "/link1" },
    { label: "Link2", link: "/link2" }
  ]

  return (
    <>
      <div className="navbar bg-base-100 flex flex-row justify-between">
        <div>
          <Link className="flex flex-row" href="/">
            <Image alt="get eyes" src="/logo.png" width={50} height={50}></Image><a className="btn btn-ghost text-xl">SolAr</a>
          </Link>
        </div>
        <div>
          <Link className={path.includes("/myCases") ? currentPathStyles : defaultStyles} href="/myCases" >My Cases</Link>
          <WalletMultiButton style={{ backgroundColor: "black" }}></WalletMultiButton>
        </div>

      </div>
    </>
  );
}

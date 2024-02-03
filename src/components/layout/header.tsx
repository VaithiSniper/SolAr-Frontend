import React from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Flex, Button, HStack, chakra, Heading } from '@chakra-ui/react';
import Link from "next/link";
import Image from "next/image";

type navLink = {
  label: string;
  link: string;
}

export function Header() {
  const { connected, wallets } = useWallet();
  const data: navLink[] = [
    { label: "Link1", link: "/link1" },
    { label: "Link2", link: "/link2" }
  ]

  return (
    <chakra.header id="header" color='black' backgroundColor='white'>
      <Flex
        w="100%"
        px="6"
        py="8"
        align="center"
        justify="space-between"
      >
        <Link href="/">
          <div className="flex flex-row gap-x-4">
            <Image src={"/logo.png"} height={52} width={52} alt="SolAr Logo" />
            <div className="my-auto">
              <Heading fontWeight={600}>
                SolAr
              </Heading>
            </div>
          </div>
        </Link>
        <HStack as="nav" spacing="5" className="space-x-8">
          {data.map((item, i) => (
            <Link href={item.link} key={i}>
              <Button variant="nav"> {item.label} </Button>
            </Link>
          ))}
        </HStack>

        <HStack margin="5" className="bg-gray-700 rounded-lg">
          <WalletMultiButton />
        </HStack>

      </Flex>
    </chakra.header >
  );
}

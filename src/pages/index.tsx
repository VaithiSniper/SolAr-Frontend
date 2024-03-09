import type { NextPage } from "next";
import Head from "next/head";
import React from "react";
import { Header } from "@components/layout/header";
import { HomeContent } from "@components/home/home-content";
import { ButtonState } from "@components/home/button";
import { TwitterResponse } from "@pages/api/twitter/[key]";
import { TxConfirmData } from "@pages/api/tx/confirm";
import { TxCreateData } from "@pages/api/tx/create";
import { TxSendData } from "@pages/api/tx/send";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, Transaction } from "@solana/web3.js";
import { fetcher, useDataFetch } from "@utils/use-data-fetch";
import { toast } from "react-hot-toast";
import { Footer } from "@components/layout/footer";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>SolAr: Home</title>
        <meta
          name="description"
          content="SolAr: Storage Layer for the future"
        />
      </Head>
      <Header />
      <HomeContent />
      {/* <Footer /> */}
    </>
  );
};

export default Home;

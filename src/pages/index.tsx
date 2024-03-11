import type { NextPage } from "next";
import Head from "next/head";
import React from "react";
import { Header } from "@components/layout/header";
import { HomeContent } from "@components/home/home-content";


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

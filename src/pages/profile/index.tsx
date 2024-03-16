import type { NextPage } from "next";
import Head from "next/head";
import React from "react";
import { Header } from "@components/layout/header";
import { HomeContent } from "@components/home/home-content";
import { ProfileContent } from "@components/profile/profile-content";


const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>SolAr: Profile</title>
        <meta
          name="description"
          content="SolAr: Storage Layer for the future"
        />
      </Head>
      <ProfileContent />
      {/* <Footer /> */}
    </>
  );
};

export default Home;

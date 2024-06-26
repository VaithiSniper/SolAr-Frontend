import type { NextPage } from "next";
import Head from "next/head";
import React from "react";
import { ProfileContent } from "@components/profile/profile-content";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Profile</title>
        <meta
          name="description"
          content="SolAr: Storage Layer for the future"
        />
      </Head>
      <ProfileContent />
    </>
  );
};

export default Home;

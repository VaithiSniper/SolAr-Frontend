import type { NextPage } from "next";
import Head from "next/head";
import React from "react";
import { ProfileContent } from "@components/profile/profile-content";
import { LoginContent } from "@components/login/login-content";


const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>SolAr: Login</title>
        <meta
          name="description"
          content="SolAr: Storage Layer for the future"
        />
      </Head>
      <LoginContent />
      {/* <Footer /> */}
    </>
  );
};

export default Home;

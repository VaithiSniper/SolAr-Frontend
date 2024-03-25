import type { NextPage } from "next";
import Head from "next/head";
import React from "react";
import { AdminLoginContent } from "@components/admin-login/login-content";


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
      <AdminLoginContent />
      {/* <Footer /> */}
    </>
  );
};

export default Home;

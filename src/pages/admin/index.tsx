import type { NextPage } from "next";
import Head from "next/head";
import React from "react";
import { AdminContent } from "src/components/admin/admin-content";

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
      <div className="flex justify-center">
        {" "}
        <AdminContent />
      </div>

      {/* <Footer /> */}
    </>
  );
};

export default Home;

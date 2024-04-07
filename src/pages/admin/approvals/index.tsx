import type { NextPage } from "next";
import Head from "next/head";
import React from "react";
import { AdminApprovalsContent } from "src/components/approvals/approvals-content";

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
        <AdminApprovalsContent />
      </div>
    </>
  );
};

export default Home;

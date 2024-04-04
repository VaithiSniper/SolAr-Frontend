import type { NextPage } from "next";
import Head from "next/head";
import React from "react";
import { AdminCaseCreate } from "src/components/admin-case-create/admin-case-create";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Create Case</title>
        <meta
          name="description"
          content="SolAr: Storage Layer for the future"
        />
      </Head>
      <div className="flex justify-center">
        {" "}
        <AdminCaseCreate />
      </div>
    </>
  );
};

export default Home;

import type { NextPage } from "next";
import Head from "next/head";
import React from "react";
import { AdminCaseManage } from "src/components/admin-case-manage/admin-case-manage";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Manage Case</title>
        <meta
          name="description"
          content="SolAr: Storage Layer for the future"
        />
      </Head>
      <div className="flex justify-center">
        {" "}
        <AdminCaseManage />
      </div>
    </>
  );
};

export default Home;

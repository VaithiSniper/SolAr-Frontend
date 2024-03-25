import { useRouter } from "next/router";
import { useWallet } from "@solana/wallet-adapter-react";
import { useUser } from "src/hooks/userHooks";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Keypair, PublicKey } from "@solana/web3.js";
import { ADMIN_WALLET_PUBKEY } from "src/constants/admin";

type JudgeData = {
  name: string;
  email: string;
  address: string;
};

export const AdminContent = () => {
  const router = useRouter();

  //hook for setting the judge state from the API
  const [data, setData] = useState<JudgeData>([]);

  const { publicKey } = useWallet();

  const [isAdmin, setIsAdmin] = useState<boolean>(false)

  useEffect(() => {
    if (publicKey && publicKey.toString() === ADMIN_WALLET_PUBKEY) {
      setIsAdmin(true)
      router.push("/")
    }
  }, [publicKey])

  const { verifyUser } = useUser();

  useEffect(() => {
    const fetchJudges = async () => {
      const res = await fetch("/api/appwrite/database/unverifiedJudges", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();

      console.log(data.data.documents);
      setData(data.data.documents);
    };

    fetchJudges();
  }, []);

  return (
    <>
      {
        isAdmin ?
          (
            <div className="flex flex-col  w-full h-full" >
              <div className="flex flex-row items-center justify-center w-full h-full">
                <h1 className="text-5xl font-bold text-center">Admin Dashboard</h1>
              </div>

              <div className="ml-10 mr-10">
                <h2 className="text-3xl mt-10 justify-start">Unverified Judges</h2>
                <div className="card mt-10 px-10 bg-slate-400 text-primary-content">
                  <div className="card-body">
                    <div className="overflow-x-auto">
                      <table className="table">
                        {/* head */}
                        <thead>
                          <tr>
                            <th></th>
                            <th className=" text-xl font-mono text-slate-700">
                              Address
                            </th>
                            <th className=" text-xl font-mono text-slate-700">Name</th>
                            <th className=" text-xl font-mono text-slate-700">Email</th>
                            <th className=" text-xl font-mono text-slate-700">
                              Verify
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {data &&
                            data.length > 0 &&
                            data.map((judge, index) => (
                              <tr key={index}>
                                <th></th>
                                <td>{judge.address}</td>
                                <td>{judge.name}</td>
                                <td>{judge.email}</td>
                                <td>
                                  <button
                                    className="btn btn-primary"
                                    onClick={() => {
                                      const publicKey = new PublicKey(
                                        `${judge.address}`
                                      );

                                      verifyUser(publicKey);
                                    }}
                                  >
                                    Verify
                                  </button>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div >

          )
          :
          <div>You are not authorized to access this</div>
      }
    </>
  );
};

import { useWallet } from "@solana/wallet-adapter-react";
import React, { ChangeEvent, FormEvent, useState } from "react";
import { initialDefaultUserProfile, useUser } from "src/hooks/userHooks";
import { useRouter } from "next/router";
import { UserProfile } from "src/hooks/userHooks";
import Avatar from "../general/avatar";
import { Button } from "../general/button";
import QRCode from "react-qr-code";
import Modal from "@components/general/modal";
import { addDocumentToDB } from "@pages/appwrite";
import { toast } from "react-hot-toast";
import Image from "next/image";
import type { UserType } from "src/hooks/userHooks";

export function ProfileContent() {
  // Router instance to navigate
  const router = useRouter()

  const { publicKey } = useWallet();

  // If you change your wallet, then refresh
  const prevPublickKey = React.useRef<string>(publicKey?.toBase58() || "");

  // Reset the state if wallet changes or disconnects
  React.useEffect(() => {
    if (publicKey && publicKey.toBase58() !== prevPublickKey.current) {
      prevPublickKey.current === publicKey.toBase58();
    }
  }, [publicKey]);

  const { isExisitingUser, loading, setLoading, user, initializeUserProfile } = useUser();

  // Setup state for profile page
  const [isEditing, setIsEditing] = useState(false)

  const [userProfile, setUserProfile] = useState<UserProfile>(initialDefaultUserProfile)

  const [hasSentRequest, setHasSentRequest] = useState<boolean>(false)

  React.useEffect(() => {
    const fetchJudges = async () => {
      const res = await fetch("/api/appwrite/database/unverifiedJudges", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      const status = data.data.documents.find((judge) => {
        judge.username === user.username
      })
      setHasSentRequest((status !== undefined) ? false : true)
    };

    fetchJudges();
  }, [hasSentRequest]);


  React.useEffect(() => {
    if (user || isExisitingUser) {
      setUserProfile(() => ({
        ...user
      }))
    }
    else {
      router.push("/")
    }
  }, [user, isExisitingUser]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name === 'username') {
      return
    }
    setUserProfile((prevValue) => ({
      ...prevValue,
      [name]: value
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await initializeUserProfile(userProfile.email, userProfile.firstName, userProfile.lastName, userProfile.phone)
    setIsEditing(false)
    setLoading(false)
    // Now send tx to change the fields
  }

  const handleSendVerification = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/appwrite/database/unverifiedJudges`, // TODO: Replace with caseId when available
        {
          method: "POST",
          body: JSON.stringify({
            address: publicKey,
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });
      toast.success("Sent request successfully!")
    }
    catch (err: any) {
      toast.error(err.toString())
    }
  }


  return (
    <div className="text-white m-8 w-full justify-center">
      <h1 className="text-center text-banner font-heading">
        Profile
      </h1>
      <Modal id="QRCodeModal">
        <QRCode
          size={256}
          style={{ height: "auto", maxWidth: "100%", width: "100%" }}
          value={publicKey?.toString() || ""}
          viewBox={`0 0 256 256`}
        />
      </Modal>
      <div className="justify-center flex">
        <div className="card w-96 bg-[#0B0708] border-white border shadow-md shadow-fuchsia-400">
          {
            !hasSentRequest && !user.verified && user.typeOfUser.judge ?
              (
                <div className="stats bg-primary text-white text-center w-full">
                  <div className="stat">
                    <div className="stat-title text-white">You are not verified yet!</div>
                    <div className="stat-actions">
                      <Button className="btn btn-lg btn-success" onClick={handleSendVerification} state={loading ? "loading" : "initial"}>Send request</Button>
                    </div>
                  </div>
                </div>
              )
              :
              null
          }
          <div className="card-body">
            {
              user.verified ?
                <div className="bg-primary p-1 rounded-full self-end">
                  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 48 48">
                    <path fill="#c8e6c9" d="M44,24c0,11-9,20-20,20S4,35,4,24S13,4,24,4S44,13,44,24z"></path><polyline fill="none" stroke="#4caf50" stroke-miterlimit="10" stroke-width="4" points="14,24 21,31 36,16"></polyline>
                  </svg>
                </div>
                :
                null
            }
            <Avatar imageOrChar={userProfile.username.substring(0, 1)} />
            <form className="max-w-md mx-auto" onSubmit={(e) => { e.preventDefault() }}>
              <div className="relative z-0 w-full mb-5 group">
                <input disabled type="text" name="username" id="username" value={userProfile.username} onChange={handleChange} className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                <label htmlFor="username" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Username</label>
              </div>
              <div className="relative z-0 w-full mb-5 group">
                <input disabled={!isEditing} type="email" name="email" id="email" value={userProfile.email} onChange={handleChange} className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                <label htmlFor="email" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Email</label>
              </div>
              <div className="grid md:grid-cols-2 md:gap-6">
                <div className="relative z-0 w-full mb-5 group">
                  <input disabled={!isEditing} type="text" name="firstName" id="firstName" value={userProfile.firstName} onChange={handleChange} className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                  <label htmlFor="firstName" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">First name</label>
                </div>
                <div className="relative z-0 w-full mb-5 group">
                  <input disabled={!isEditing} type="text" name="lastName" id="lastName" value={userProfile.lastName} onChange={handleChange} className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                  <label htmlFor="lastName" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Last name</label>
                </div>
              </div>
              <div className="relative z-0 w-full mb-5 group">
                <input disabled={!isEditing} type="text" name="phone" id="phone" value={userProfile.phone} onChange={handleChange} className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                <label htmlFor="phoneNumber" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">+91 Phone number (10 digits)</label>
              </div>
              <div className="flex flex-row mt-4 justify-center flex-grow gap-x-10">
                {
                  isEditing ?
                    <>
                      <Button state={loading ? "loading" : "initial"} onClick={handleSubmit} className="p-2 text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm sm:w-auto px-5 py-2.5 text-center">Submit</Button>
                      <Button state={loading ? "loading" : "initial"} onClick={() => setIsEditing(false)} className="p-2 text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm sm:w-auto px-5 py-2.5 text-center">Cancel</Button>
                    </>
                    :
                    <>
                      <Button onClick={() => { document.getElementById("QRCodeModal").showModal() }} state={publicKey ? "initial" : "loading"} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm sm:w-auto px-5 py-2.5 text-center">Show QR Code</Button>
                      <Button state={loading ? "loading" : "initial"} onClick={() => setIsEditing(true)} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm sm:w-auto px-5 py-2.5 text-center">Edit</Button>
                    </>
                }
              </div>
            </form>

          </div>
        </div>
      </div >
    </div >
  );
}

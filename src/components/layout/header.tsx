import React, { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useUser } from "src/hooks/userHooks";
import { Button } from "../general/button";

import NotificationAPIComponent from "./bell";

type navLink = {
  label: string;
  link: string;
};

export function Header() {
  const route = useRouter();
  const path = route.pathname;

  const { publicKey } = useWallet();

  const userLinks: navLink[] = [
    { label: "My Cases", link: "/myCases" },
  ];
  const adminLinks: navLink[] = [
    { label: "Approvals", link: "/admin/approvals" },
    { label: "Create Case", link: "/admin/case/create" },
    { label: "Manage Case", link: "/admin/case/manage" },
  ]

  const [currentLinks, setCurrentLinks] = useState<navLink[]>()

  useEffect(() => {
    if (isAdminUser) {
      setCurrentLinks(adminLinks)
    }
    else
      setCurrentLinks(userLinks)
  }, [publicKey])

  const currentPathStyles = "mx-4 underline underline-offset-4 text-white";
  const defaultStyles = "mx-4 text-[#777576] hover:text-white";


  const {
    isAdminUser,
    isExisitingUser,
    loading,
    setLoading,
    user,
    initializeUserProfile,
  } = useUser();

  const [showNotificationCard, setShowNotificationCard] =
    useState<boolean>(false);

  return (
    <>
      <div className="navbar bg-[#0B0708] pt-4 flex flex-row justify-between hover:text-white">
        <div>
          <Link className="flex flex-row" href="/">
            <Image
              alt="get eyes"
              src="/logo.png"
              width={50}
              height={50}
            ></Image>
            <span className="btn btn-ghost text-xl text-white">SolAr</span>
          </Link>
        </div>
        <div>
          {/* links that should be accessible only after logging in */}
          <>
            {
              isExisitingUser &&
              (
                isAdminUser ?
                  adminLinks.map((link) => (
                    <Link
                      className={
                        path.includes(link.link) ? currentPathStyles : defaultStyles
                      }
                      key={link.link}
                      href={link.link}
                    >
                      {link.label}
                    </Link>
                  ))
                  :
                  userLinks.map((link) => (
                    <Link
                      className={
                        path.includes(link.link) ? currentPathStyles : defaultStyles
                      }
                      key={link.link}
                      href={link.link}
                    >
                      {link.label}
                    </Link>
                  ))
              )
            }
          </>
          {/* login or profile button is always displayed */}
          {
            publicKey && isExisitingUser ? (
              <>
                <NotificationAPIComponent />
                <Link href="/profile">
                  <div
                    tabIndex={0}
                    role="button"
                    className="btn m-1 bg-fuchsia-400 hover:bg-white"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      x="0px"
                      y="0px"
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12,2C6.477,2,2,6.477,2,12c0,5.523,4.477,10,10,10s10-4.477,10-10C22,6.477,17.523,2,12,2z M12,4.75 c1.795,0,3.25,1.455,3.25,3.25s-1.455,3.25-3.25,3.25S8.75,9.795,8.75,8S10.205,4.75,12,4.75z M12,20 c-2.77,0-5.21-1.408-6.646-3.547C6.475,14.823,10.046,14,12,14s5.525,0.823,6.646,2.453C17.21,18.592,14.77,20,12,20z"></path>
                    </svg>
                  </div>
                </Link>
              </>
            ) : (
              <Link href={isAdminUser ? "/admin/login" : "/login"}>
                <div
                tabIndex={0}
            role="button"
                                            className="btn m-1 bg-fuchsia-300 hover:bg-fuchsia-500 text-black"
          >
                            Login
                                  </div>
        </Link>
      )}
      </div>
    </div>
    </>
  );
}

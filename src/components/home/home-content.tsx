import Link from "next/link";
import React from "react";
import Image from "next/image";
import { rubik } from "src/styles/fonts";

export function HomeContent() {

  return (
    <div className="text-white m-8 justify-center">
      <section className="w-full">
        <div className="px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className={rubik.className + " text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl xl:text-7xl"}>
                  Secure Your Legal Records with SolAr
                </h1>
                <p className="max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  SolAr is an e-vault for your legal records, built on the decentralized Arweave and Solana blockchains.
                  Keep your important documents safe and accessible with our cutting-edge technology.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link
                  className="inline-flex h-10 items-center justify-center rounded-md bg-gray-900 px-8 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
                  href="/login"
                >
                  Sign Up
                </Link>
                <Link
                  className="inline-flex h-10 items-center justify-center rounded-md border border-slate-100 bg-white px-8 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:border-slate-200 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300"
                  href="#"
                >
                  Learn More
                </Link>
              </div>
            </div>
            <Image
              alt="SolAr Illustration"
              className="aspect-square overflow-hidden rounded-xl object-contain sm:w-full lg:order-last self-end items-end place-self-end"
              height="550"
              src="/solar-banner.svg"
              width="550"
            />
          </div>
        </div>
      </section >
      {/* <h1 className="text-center text-banner font-heading"> */}
      {/*   SOLAR */}
      {/* </h1> */}
      {/* <p> */}
      {/*   Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit enim labore culpa sint ad nisi Lorem pariatur mollit ex esse exercitation amet. Nisi anim cupidatat excepteur officia. Reprehenderit nostrud nostrud ipsum Lorem est aliquip amet voluptate voluptate dolor minim nulla est proident. Nostrud officia pariatur ut officia. Sit irure elit esse ea nulla sunt ex occaecat reprehenderit commodo officia dolor Lorem duis laboris cupidatat officia voluptate. Culpa proident adipisicing id nulla nisi laboris ex in Lorem sunt duis officia eiusmod. Aliqua reprehenderit commodo ex non excepteur duis sunt velit enim. Voluptate laboris sint cupidatat ullamco ut ea consectetur et est culpa et culpa duis. */}
      {/* </p> */}
    </div >
  );
}

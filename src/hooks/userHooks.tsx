import * as anchor from '@project-serum/anchor'
import { useEffect, useMemo, useState } from 'react'
import solarIDL from '../constants/idl.json'
import toast from 'react-hot-toast'
import { PublicKey, SystemProgram } from '@solana/web3.js'
import { utf8 } from '@project-serum/anchor/dist/cjs/utils/bytes'
import { findProgramAddressSync } from '@project-serum/anchor/dist/cjs/utils/pubkey'
import { useAnchorWallet, useConnection, useWallet } from '@solana/wallet-adapter-react'
import { Solar } from 'src/constants/solar'
import { ADMIN_WALLET_PUBKEY } from 'src/constants/admin'
import { defaultCaseAddress, defaultCaseAddressPubkey } from 'src/constants/case-constants'

export type UserType = anchor.IdlTypes<Solar>["UserType"];

export type UserProfile = {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  typeOfUser: UserType;
  verified: boolean;
  listOfCases: [PublicKey, PublicKey, PublicKey, PublicKey, PublicKey];
  totalParticipatingCases: number;
}
export interface UserProfileAccount extends UserProfile {
  authority?: PublicKey;
}

export const initialDefaultUserProfile: UserProfile = {
  username: "",
  email: "",
  firstName: "",
  lastName: "",
  phone: "",
  typeOfUser: { client: {} },
  listOfCases: [defaultCaseAddressPubkey, defaultCaseAddressPubkey, defaultCaseAddressPubkey, defaultCaseAddressPubkey, defaultCaseAddressPubkey],
  verified: false,
  totalParticipatingCases: 0
}

export function useUser() {
  const { connection } = useConnection()
  const { publicKey } = useWallet()
  const anchorWallet = useAnchorWallet()

  const [isExisitingUser, setIsExistingUser] = useState(false)
  const [isAdminUser, setIsAdminUser] = useState(false)
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<UserProfile>(initialDefaultUserProfile)

  const program = useMemo(() => {
    if (anchorWallet) {
      const provider = new anchor.AnchorProvider(connection, anchorWallet, anchor.AnchorProvider.defaultOptions())
      const programId = new PublicKey(solarIDL.metadata.address)
      const programIdl = JSON.parse(JSON.stringify(solarIDL)) // to circumvent typescript issue
      return new anchor.Program(programIdl, programId, provider)
    }
  }, [connection, anchorWallet])

  useEffect(() => {
  }, [publicKey])

  useEffect(() => {
    const checkUserExists = async () => {
      if (program && publicKey) {
        try {
          setLoading(true)
          const [userProfilePDA] = findProgramAddressSync([utf8.encode('USER_STATE'), publicKey.toBuffer()], program.programId)
          let userAccount: any = await program.account.userProfile.fetch(userProfilePDA)
          if (userAccount) {
            setIsExistingUser(true);
            delete userAccount.authority;
            const participatingCaseList: PublicKey[] = userAccount.listOfCases
              .filter((caseItem: PublicKey) => (
                caseItem.toBase58() !== defaultCaseAddress
              ))
            userAccount.listOfCases = participatingCaseList
            setUser(userAccount)
          } else {
            setIsExistingUser(false)
          }
        } catch (error: any) {
          toast.error(error.toString())
          setIsExistingUser(false)
        } finally {
          setLoading(false)
        }
      }
    }
    const checkForAdminUser = () => {
      if (publicKey && (publicKey.toString() === ADMIN_WALLET_PUBKEY))
        setIsAdminUser(true)
    }
    checkForAdminUser()
    checkUserExists()
  }, [publicKey, program])

  const initializeUser = async (username: string, usertype: UserType) => {
    if (program && publicKey) {
      try {
        const [profilePda, profileBump] = findProgramAddressSync([utf8.encode('USER_STATE'), publicKey.toBuffer()], program.programId)
        const tx = await program.methods.setupUser(username, { [`${usertype}`.toLowerCase()]: {} })
          .accounts({
            user: profilePda,
            authority: publicKey,
            systemProgram: SystemProgram.programId,
          })
          .rpc()
        setIsExistingUser(true)
        toast.success('Successfully initialized user.')
      } catch (err: any) {
        toast.error(err.toString())
      } finally {
      }
    }
  }

  const verifyUser = async (docId: string, userAddress: anchor.web3.PublicKey, userName: string, userEmail: string) => {
    if (program && publicKey) {
      try {
        // On-chain verification
        const [userPda] = findProgramAddressSync([utf8.encode('USER_STATE'), userAddress.toBuffer()], program.programId)
        const [adminPda] = findProgramAddressSync([utf8.encode('USER_STATE'), publicKey.toBuffer()], program.programId)
        const tx = await program.methods.verifyUser()
          .accounts({
            admin: adminPda,
            user: userPda,
            systemProgram: SystemProgram.programId,
          })
          .rpc()
        // Off-chain verification
        await fetch("/api/appwrite/database/unverifiedJudges", {
          method: "DELETE",
          body: JSON.stringify({
            docId: docId
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        //Off-chain addition
        await fetch("/api/appwrite/database/verifiedJudges", {
          method: "POST",
          body: JSON.stringify({
            address: userAddress,
            name: userName,
            email: userEmail,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        toast.success('Successfully verified judge.')
      } catch (err: any) {
        toast.error(err.toString())
      }
    }
  }




  const initializeUserProfile = async (email: string, firstName: string, lastName: string, phone: string) => {
    if (program && publicKey) {
      try {
        const [profilePda, profileBump] = findProgramAddressSync([utf8.encode('USER_STATE'), publicKey.toBuffer()], program.programId)
        const tx = await program.methods.setupUserProfile(email, firstName, lastName, phone)
          .accounts({
            user: profilePda,
            authority: publicKey,
            systemProgram: SystemProgram.programId,
          })
          .rpc()
        toast.success('Successfully user profile.')
      } catch (err: any) {
        toast.error(err.toString())
      }
    }
  }

  return { isExisitingUser, isAdminUser, initializeUser, initializeUserProfile, loading, setLoading, user, verifyUser }
}

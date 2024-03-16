import * as anchor from '@project-serum/anchor'
import { useEffect, useMemo, useState } from 'react'
import solarIDL from '../constants/idl.json'
import toast from 'react-hot-toast'
import { PublicKey, SystemProgram } from '@solana/web3.js'
import { utf8 } from '@project-serum/anchor/dist/cjs/utils/bytes'
import { findProgramAddressSync } from '@project-serum/anchor/dist/cjs/utils/pubkey'
import { useAnchorWallet, useConnection, useWallet } from '@solana/wallet-adapter-react'

export function useUser() {
  const { connection } = useConnection()
  const { publicKey } = useWallet()
  const anchorWallet = useAnchorWallet()

  const [isExisitingUser, setIsExistingUser] = useState(false)
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState({
    name: "VaithiSniper",
    latestCase: 0,
    casesCount: 0,
  })

  const program = useMemo(() => {
    console.log("SOLAR IDL", solarIDL)
    if (anchorWallet) {
      const provider = new anchor.AnchorProvider(connection, anchorWallet, anchor.AnchorProvider.defaultOptions())
      const programId = new PublicKey(solarIDL.metadata.address)
      const programIdl = JSON.parse(JSON.stringify(solarIDL)) // to circumvent typescript issue
      return new anchor.Program(programIdl, programId, provider)
    }
  }, [connection, anchorWallet])

  useEffect(() => {
    const checkUserExists = async () => {
      if (program && publicKey) {
        try {
          setLoading(true)
          const [userProfilePDA] = findProgramAddressSync([utf8.encode('USER_STATE'), publicKey.toBuffer()], program.programId)
          const userAccount = await program.account.userProfile.fetch(userProfilePDA)
          if (userAccount) {
            setIsExistingUser(true)
            delete userAccount.authority
            setUser(userAccount)
          } else {
            setIsExistingUser(false)
          }
        } catch (error) {
          console.log(error)
          setIsExistingUser(false)
        } finally {
          setLoading(false)
        }
      }
    }
    checkUserExists()
  }, [publicKey, program])

  const initializeUser = async (username: string) => {
    if (program && publicKey) {
      try {
        const [profilePda, profileBump] = findProgramAddressSync([utf8.encode('USER_STATE'), publicKey.toBuffer()], program.programId)
        const tx = await program.methods.setupUser(username)
          .accounts({
            user: profilePda,
            authority: publicKey,
            systemProgram: SystemProgram.programId,
          })
          .rpc()
        setIsExistingUser(true)
        toast.success('Successfully initialized user.')
      } catch (err: any) {
        console.log(err)
        toast.error(err.toString())
      } finally {
      }
    }
  }

  return { isExisitingUser, initializeUser, loading, user }
}

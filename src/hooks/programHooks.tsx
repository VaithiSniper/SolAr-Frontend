import { useMemo } from 'react'
import * as anchor from '@project-serum/anchor'
import solarIDL from '../constants/idl.json'
import { PublicKey } from '@solana/web3.js'
import { useAnchorWallet, useConnection, useWallet } from '@solana/wallet-adapter-react'

export function useProgram() {

  const { connection } = useConnection()
  const { publicKey } = useWallet()
  const anchorWallet = useAnchorWallet()

  const program = useMemo(() => {
    if (anchorWallet) {
      const provider = new anchor.AnchorProvider(connection, anchorWallet, anchor.AnchorProvider.defaultOptions())
      const programId = new PublicKey(solarIDL.metadata.address)
      const programIdl = JSON.parse(JSON.stringify(solarIDL)) // to circumvent typescript issue
      return new anchor.Program(programIdl, programId, provider)
    }
  }, [connection, anchorWallet])

  return { program, publicKey }
}

import { ArweaveAddress } from 'ardrive-core-js';
import Arweave from 'arweave';
import { arrayFlatten } from 'arweave/node/lib/merkle';
import { JWKInterface } from 'arweave/node/lib/wallet';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';
import { ArweaveFile, base64String, TxnIDAccount, useDocument } from './documentHooks';

export function useArweave() {

  const [arweaveKey, setArweaveKey] = useState<JWKInterface>()
  const [arweaveAddress, setArweaveAddress] = useState<string>()
  const [isArweaveKeySet, setIsArweaveKeySet] = useState<boolean>(false)
  const [txnId, setTxnId] = useState<string>("")
  const [fileBufferVal, setFileBufferVal] = useState<ArrayBuffer>()

  const { setArweaveFileList } = useDocument()

  const arweave = useMemo(() => (Arweave.init({
    host: '127.0.0.1',
    port: 1984,
    protocol: 'http'
  })), [])

  useEffect(() => {
    const createWalletAndAddress = async () => {
      const key = await arweave.wallets.generate()
      setArweaveKey(key);
      const address = await arweave.wallets.jwkToAddress(key)
      setArweaveAddress(address);
      setIsArweaveKeySet(true)
    }
    createWalletAndAddress()
  }, [isArweaveKeySet]);

  const addToWalletBalance = async (amount: string) => {
    try {
      const tokens = arweave.ar.arToWinston(amount)
      await arweave.api.get(`mint/${arweaveAddress}/${tokens}`)
    }
    catch (err: any) {
      console.log(err)
    }
  }

  const testBalanceAndAddTokens = async () => {
    let balanceInWinston = await arweave.wallets.getBalance(arweaveAddress as string)
    let balanceInAR = arweave.ar.winstonToAr(balanceInWinston)
    console.log(`Wallet ${arweaveAddress}'s balance is -> `, balanceInAR)
    if (Number(balanceInAR) < 5) {
      console.log("Reached adding balance")
      await addToWalletBalance("20")
    }
    balanceInWinston = await arweave.wallets.getBalance(arweaveAddress as string)
    balanceInAR = arweave.ar.winstonToAr(balanceInWinston)
    console.log(`Wallet ${arweaveAddress}'s balance is -> `, balanceInAR)
  }

  const addDocumentToArweave = async () => {
    // First, make sure current wallet has enough balance
    await testBalanceAndAddTokens()
    console.log("In addDocumentToArweave -> ", fileBufferVal)
    let data = fileBufferVal;
    let transaction = await arweave.createTransaction(
      { data: data },
      arweaveKey
    );
    transaction.addTag("Content-Type", "image/png");
    try {
      await arweave.transactions.sign(transaction, arweaveKey);
      let uploader = await arweave.transactions.getUploader(transaction);
      while (!uploader.isComplete) {
        await uploader.uploadChunk();
        console.log(
          `${uploader.pctComplete}% complete, ${uploader.uploadedChunks}/${uploader.totalChunks}`
        );
      }
      return true
    }
    catch (err: any) {
      console.log(err)
      // toast.error(err.toSring())
      return false
    }
  };

  const getAllRecordsFromArweave = async () => {
    const txnIdAccountList: TxnIDAccount[] = [
      {
        name: "arweave-upload.png",
        mimeType: "image/png",
        txnId: "WVC76ayZuTGfOMlgjaKzT72tTUeYV9tGuNF5718g13k"
      }
    ]
    const _fileList: ArweaveFile[] = []
    for (let i = 0; i < txnIdAccountList.length; i++) {
      const txnIdAccount = txnIdAccountList[i]
      const href = await retrieveFileFromArweave(txnIdAccount.txnId)
      _fileList.push({ href, name: txnIdAccount.name, mimeType: txnIdAccount.mimeType, source: "arweave" })
    }
    return _fileList
    // setArweaveFileList(_fileList)
  }

  const retrieveFileFromArweave = async (txnId: string) => {
    arweave.transactions.getStatus(txnId).then((res) => {
      console.log("txn status", res.status)
    });

    const result = await arweave.transactions.get(txnId);
    console.log("txn data", result.data);

    const base64String = btoa(
      String.fromCharCode(...new Uint8Array(result.data))
    );

    return (`${base64String}`);
  };

  const handleUploadToArweave = async () => {
    if (!fileBufferVal) {
      toast.error("Please choose a file first!")
      return
    }
    let success: boolean = false;
    success = await addDocumentToArweave()
    if (success) {
      toast.success('Successfully uploaded!')
    }
    else {
      toast.error('Error occurred while uploading!')
    }
    // Now send tx to change the fields
  }

  return { arweaveKey, addDocumentToArweave, retrieveFileFromArweave, handleUploadToArweave, setFileBufferVal, getAllRecordsFromArweave }
}

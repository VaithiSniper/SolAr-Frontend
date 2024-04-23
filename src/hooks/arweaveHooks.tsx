import { base64 } from "@project-serum/anchor/dist/cjs/utils/bytes";
import { ArweaveAddress, PublicKey } from "ardrive-core-js";
import Arweave from "arweave";
import { arrayFlatten } from "arweave/node/lib/merkle";
import { JWKInterface } from "arweave/node/lib/wallet";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { PartyType, useCase } from "./caseHooks";
import {
  ArweaveFile,
  base64String,
  TxnIDAccount,
  useDocument,
} from "./documentHooks";

export type Tag = [string, string]
export type FileTags = Tag[]
export type FileMetadata = {
  name: string;
  mimeType: string;
}

export function useArweave() {
  const [arweaveKey, setArweaveKey] = useState<JWKInterface>();
  const [arweaveAddress, setArweaveAddress] = useState<string>();
  const [isArweaveKeySet, setIsArweaveKeySet] = useState<boolean>(false);
  const [txnId, setTxnId] = useState<string>("");
  const [fileBufferVal, setFileBufferVal] = useState<ArrayBuffer>();
  const [fileMetadata, setFileMetadata] = useState<FileMetadata>();

  const { setArweaveFileList } = useDocument();
  const { addDocumentToCaseAndParty } = useCase()

  const arweave = useMemo(
    () =>
      Arweave.init({
        host: "127.0.0.1",
        port: 1984,
        protocol: "http",
      }),
    []
  );

  useEffect(() => {
    const createWalletAndAddress = async () => {
      const key = await arweave.wallets.generate();
      setArweaveKey(key);
      const address = await arweave.wallets.jwkToAddress(key);
      setArweaveAddress(address);
      setIsArweaveKeySet(true);
    };
    createWalletAndAddress();
  }, [isArweaveKeySet]);

  const addToWalletBalance = async (amount: string) => {
    try {
      const tokens = arweave.ar.arToWinston(amount);
      await arweave.api.get(`mint/${arweaveAddress}/${tokens}`);
    } catch (err: any) {
      console.log(err);
    }
  };

  const testBalanceAndAddTokens = async () => {
    let balanceInWinston = await arweave.wallets.getBalance(
      arweaveAddress as string
    );
    let balanceInAR = arweave.ar.winstonToAr(balanceInWinston);
    console.log(`Wallet ${arweaveAddress}'s balance is -> `, balanceInAR);
    if (Number(balanceInAR) < 5) {
      console.log("Reached adding balance");
      await addToWalletBalance("20");
    }
    balanceInWinston = await arweave.wallets.getBalance(
      arweaveAddress as string
    );
    balanceInAR = arweave.ar.winstonToAr(balanceInWinston);
    console.log(`Wallet ${arweaveAddress}'s balance is -> `, balanceInAR);
  };


  const addDocumentToArweave = async (caseId: PublicKey, party: PartyType) => {
    // First, make sure current wallet has enough balance
    await testBalanceAndAddTokens();
    let data = fileBufferVal;
    let transaction = await arweave.createTransaction(
      { data: data },
      arweaveKey
    );
    const tags: FileTags = [
      ["name", fileMetadata?.name as string],
      ["mimeType", fileMetadata?.mimeType as string],
    ]
    tags.forEach((tag) => {
      const [key, value] = tag;
      transaction.addTag(key, value);
    });
    try {
      await arweave.transactions.sign(transaction, arweaveKey);
      let uploader = await arweave.transactions.getUploader(transaction);
      while (!uploader.isComplete) {
        await uploader.uploadChunk();
        console.log(
          `${uploader.pctComplete}% complete, ${uploader.uploadedChunks}/${uploader.totalChunks}`
        );
      }
      const txnId = uploader.toJSON().transaction.id
      return { txnId, status: true };
    } catch (err: any) {
      console.log(err);
      // toast.error(err.toSring())
      return { txnId: "", status: false };
    }
  };

  const getAllRecordsFromArweave = async () => {
    // if (arweaveDocumentList.length === 0) {
    //   return
    // }

    const txnIdAccountList: TxnIDAccount[] = [
      {
        name: "arweave-upload.png",
        mimeType: "image/png",
        txnId: "_VroBa-6_D9Al_b-gGXvxCGB86mNIUVf-YTDHVoSPlU",
      },
    ];
    const _fileList: ArweaveFile[] = [];
    for (let i = 0; i < txnIdAccountList.length; i++) {
      const txnIdAccount = txnIdAccountList[i];
      const { href, tags } = await retrieveFileFromArweave(txnIdAccount.txnId);
      _fileList.push({
        ...tags,
        href,
        source: "arweave",
      });
    }
    return _fileList;
    // setArweaveFileList(_fileList)
  };

  function addPadding(base64String: string) {
    // Calculate the number of padding characters needed
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    return base64String + padding;
  }

  const retrieveFileFromArweave = async (txnId: string) => {
    arweave.transactions.getStatus(txnId).then((res) => {
      console.log("txn status", res.status);
    });

    const result = await arweave.transactions.get(txnId);

    const base64string = btoa(
      new Uint8Array(result.data).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        ""
      )
    );

    let tags: { [s: string]: string } = {};
    result.tags.forEach(({ name, value }) => {
      const tagKey = base64.decode(addPadding(name)).toString();
      const tagValue = base64.decode(addPadding(value)).toString();
      tags[tagKey] = tagValue
    })

    return {
      tags,
      href: `${base64string}`,
    };
  };

  const handleUploadToArweave = async (caseId: PublicKey, party: PartyType) => {
    if (!fileBufferVal) {
      toast.error("Please choose a file first!");
      return;
    }
    const { status: success, txnId } = await addDocumentToArweave(caseId, party);
    if (success) {
      await addDocumentToCaseAndParty(caseId, txnId, party)
      toast.success("Successfully uploaded!");
    } else {
      toast.error("Error occurred while uploading!");
    }
    return txnId;
    // Now send tx to change the fields
  };

  return {
    arweaveKey,
    addDocumentToArweave,
    retrieveFileFromArweave,
    handleUploadToArweave,
    setFileBufferVal,
    getAllRecordsFromArweave,
    setFileMetadata
  };
}

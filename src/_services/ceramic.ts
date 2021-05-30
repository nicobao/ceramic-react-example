import KeyDidResolver from "key-did-resolver";
import ThreeIdResolver from "@ceramicnetwork/3id-did-resolver";
import CeramicClient from "@ceramicnetwork/http-client";
import { ThreeIdConnect, EthereumAuthProvider } from "@3id/connect";
import { TileDocument } from "@ceramicnetwork/stream-tile";
import { DID } from "dids";

declare let window: any;

export const authenticate = async () => {
  if (window.ethereum) {
    const API_URL = "https://ceramic-clay.3boxlabs.com";
    const ceramic = new CeramicClient(API_URL);

    const resolver = {
      ...KeyDidResolver.getResolver(),
      ...ThreeIdResolver.getResolver(ceramic),
    };

    const did = new DID({ resolver });
    ceramic.setDID(did);

    const addresses = await window.ethereum.enable();
    const threeIdConnect = new ThreeIdConnect();
    const authProvider = new EthereumAuthProvider(
      window.ethereum,
      addresses[0]
    );
    await threeIdConnect.connect(authProvider);
    const provider = await threeIdConnect.getDidProvider();
    if (ceramic.did !== undefined && ceramic.did !== null) {
      ceramic.did.setProvider(provider);
      await ceramic.did.authenticate();
    }
    return ceramic;
  } else {
    return null;
  }
};

export const createOrGetDoc = async (
  ceramic: CeramicClient
): Promise<TileDocument<any>> => {
  if (ceramic.did === null || ceramic.did === undefined) {
    throw new Error("ceramic.did is null or undefined");
  }
  return await TileDocument.create(
    ceramic,
    null,
    {
      controllers: [ceramic.did.id],
      family: "HOPR logs",
      deterministic: true,
    },
    { anchor: false, publish: false }
  );
};

export const updateDoc = async (
  document: TileDocument<any>,
  newContent: any
) => {
  return await document.update(newContent);
};

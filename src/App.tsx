import React from "react";
import logo from "./logo.svg";
import "./App.css";
import {
  authenticate,
  createOrGetDoc,
  loadAllCommits,
  updateDoc,
} from "./_services/ceramic";
import CeramicClient from "@ceramicnetwork/http-client";
import { TileDocument } from "@ceramicnetwork/stream-tile";
import { Stream } from "@ceramicnetwork/common";

function App() {
  const [ceramic, setCeramic] = React.useState<CeramicClient | null>(null);
  const [content, setContent] = React.useState<string>("");
  const [doc, setDoc] = React.useState<TileDocument<any> | null>(null);
  const [logs, setLogs] = React.useState<string[]>([]);

  React.useEffect(() => {
    loadDoc(ceramic);
  }, [ceramic]);

  function loadDoc(ceramic: CeramicClient | null) {
    if (ceramic !== null && ceramic !== undefined) {
      createOrGetDoc(ceramic)
        .then((doc) => {
          setDoc(doc);
          console.log("Document", doc, doc.content);
        })
        .catch((e) => console.log("Error while querying the document", e));
    }
  }

  function authCeramic() {
    authenticate()
      .then((ceramic) => {
        setCeramic(ceramic);
        console.log("Ceramic authentication", ceramic);
      })
      .catch((e) => console.log("Error while authenticating", e));
  }

  function handleUpdateDocument() {
    if (doc !== null) {
      updateDoc(doc, content)
        .then(() => console.log("Document updated"))
        .catch((e) => console.log("Error while updating document", e));
    }
  }

  function loadDocument() {
    if (
      ceramic !== null &&
      ceramic !== undefined &&
      doc !== null &&
      doc !== undefined
    ) {
      loadAllCommits(ceramic, doc)
        .then((streamMap: Record<string, Stream>) => {
          const newLogs = Object.values(streamMap).map(
            (value) => value.state.content
          );
          setLogs(newLogs);
        })
        .catch((e) => console.log("Error while querying the document", e));
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <button disabled={ceramic !== null} onClick={authCeramic}>
          Authenticate
        </button>
        <label>
          New content:
          <input
            type="text"
            value={content}
            onChange={(event) => setContent(event.target.value)}
          />
        </label>
        <button disabled={ceramic === null} onClick={handleUpdateDocument}>
          Update the document
        </button>
        <button disabled={ceramic === null} onClick={loadDocument}>
          Load document
        </button>
        <textarea readOnly value={logs.join("\n")} />
      </header>
    </div>
  );
}

export default App;

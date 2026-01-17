"use client";

import { useState } from "react";
import FileUpload from "./FileUpload";
import ResultCard from "./ResultCard";
import JsonView from "./JsonView";
import { postJson, uploadFile } from "../lib/api";

type UploadResponse = {
  media_context_id: string;
  raw: unknown;
};

type WebVerifyResponse = {
  claim: string;
  verdict: string;
  sources: string[];
};

export default function TruthTracePanel() {
  const [uploadResult, setUploadResult] = useState<UploadResponse | null>(null);
  const [claim, setClaim] = useState("This image is an unedited newsroom photo.");
  const [verifyResult, setVerifyResult] = useState<WebVerifyResponse | null>(null);
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [loadingVerify, setLoadingVerify] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (file: File) => {
    setLoadingUpload(true);
    setError(null);
    try {
      const data = await uploadFile<UploadResponse>("/aligncheck/media/upload", file);
      setUploadResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to upload media.");
    } finally {
      setLoadingUpload(false);
    }
  };

  const handleVerify = async () => {
    setLoadingVerify(true);
    setError(null);
    try {
      const data = await postJson<WebVerifyResponse>("/aligncheck/tools/web_verify", { claim });
      setVerifyResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to verify claim.");
    } finally {
      setLoadingVerify(false);
    }
  };

  return (
    <div className="card panel">
      <div className="panel-head">
        <div>
          <h3 className="panel-title">Provenance and claim verification</h3>
          <div className="note">Upload media or verify a claim against public sources.</div>
        </div>
      </div>

      <FileUpload onSelect={handleUpload} accept="image/*,video/*" />
      <div className="helper">{loadingUpload ? "Uploading..." : "C2PA context generated."}</div>

      {uploadResult ? (
        <div className="result-grid">
          <ResultCard title="Media Context ID" value={uploadResult.media_context_id} />
          <JsonView data={uploadResult.raw} />
        </div>
      ) : null}

      <div className="form-grid">
        <div className="form-field">
          <label>Claim to verify</label>
          <textarea value={claim} onChange={(event) => setClaim(event.target.value)} />
        </div>
      </div>

      <div className="panel-head">
        <button className="button secondary" onClick={handleVerify} disabled={loadingVerify}>
          {loadingVerify ? "Checking..." : "Verify Claim"}
        </button>
        {error ? <div className="note">{error}</div> : null}
      </div>

      {verifyResult ? (
        <div className="result-grid">
          <ResultCard title="Verdict" value={verifyResult.verdict} />
          <JsonView data={verifyResult} />
        </div>
      ) : null}
    </div>
  );
}

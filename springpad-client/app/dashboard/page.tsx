"use client";

import React, { useState } from "react";
import axios from "axios";
// ...existing code...

const DashboardPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResponse(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("pdf", file);
    if (password) {
      formData.append("password", password);
    }

    try {
      const res = await axios.post(
        "https://springpad.onrender.com/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setResponse(JSON.stringify(res.data, null, 2));
    } catch (err: unknown) {
      let errorMessage = "Upload failed: ";
      if (axios.isAxiosError(err)) {
        errorMessage += err.response?.data?.error || err.message;
      } else if (err instanceof Error) {
        errorMessage += err.message;
      } else {
        errorMessage += "An unknown error occurred.";
      }
      setResponse(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: 400,
        margin: "40px auto",
        padding: 20,
        border: "1px solid #ccc",
        borderRadius: 8,
      }}
    >
      <h2>Upload PDF</h2>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      <div style={{ marginTop: 10 }}>
        <label htmlFor="password">Password (optional):</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            marginTop: 4,
            marginBottom: 10,
            padding: 6,
            borderRadius: 4,
            border: "1px solid #ccc",
          }}
          placeholder="Enter password if PDF is protected"
        />
      </div>
      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        style={{ marginTop: 10 }}
      >
        {uploading ? "Uploading..." : "Submit"}
      </button>
      {response && (
        <pre
          style={{
            marginTop: 20,
            background: "#f6f8fa",
            padding: 10,
            borderRadius: 4,
          }}
        >
          {response}
        </pre>
      )}
    </div>
  );
};

export default DashboardPage;

import React, { useRef, useState } from "react";
import { useData } from "../context/DataContext";

export default function FileUpload() {
  const { loadFiles, loading, filesLoaded, clearData } = useData();
  const inputRef = useRef();
  const [dragOver, setDragOver] = useState(false);

  const handleFiles = (files) => {
    const zips = Array.from(files).filter((f) =>
      f.name.toLowerCase().endsWith(".zip")
    );
    if (zips.length === 0) return;
    loadFiles(zips);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  return (
    <div className="upload-section">
      <div
        className={`dropzone${dragOver ? " drag-over" : ""}`}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={() => setDragOver(false)}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".zip"
          multiple
          hidden
          onChange={(e) => handleFiles(e.target.files)}
        />
        {loading ? (
          <p className="dropzone-text">⏳ Processing…</p>
        ) : (
          <>
            <p className="dropzone-icon">📁</p>
            <p className="dropzone-text">
              Drag &amp; drop Hootsuite ZIP export(s) here
              <br />
              or <span className="link-text">click to browse</span>
            </p>
          </>
        )}
      </div>

      {filesLoaded.length > 0 && (
        <div className="loaded-files">
          <span>
            Loaded: <strong>{filesLoaded.join(", ")}</strong>
          </span>
          <button className="btn-clear" onClick={clearData}>
            ✕ Clear data
          </button>
        </div>
      )}
    </div>
  );
}

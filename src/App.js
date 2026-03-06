import React from "react";
import { DataProvider, useData } from "./context/DataContext";
import FileUpload from "./components/FileUpload";
import Dashboard from "./components/Dashboard";
import "./App.css";

function AppContent() {
  const { error } = useData();

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-inner">
          <h1>📊 VA Social Media Dashboard</h1>
          <p className="subtitle">Hootsuite Facebook Metrics Analyzer</p>
        </div>
      </header>

      <main className="app-main">
        <FileUpload />
        {error && <div className="error-banner">⚠️ {error}</div>}
        <Dashboard />
      </main>

      <footer className="app-footer">
        <p>
          U.S. Department of Veterans Affairs · All data processed locally in
          your browser
        </p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <DataProvider>
      <AppContent />
    </DataProvider>
  );
}

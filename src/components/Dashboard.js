import React, { useState, useMemo, useCallback } from "react";
import { useData } from "../context/DataContext";
import KpiCards from "./KpiCards";
import TrendChart from "./TrendChart";
import PostTypeChart from "./PostTypeChart";
import PostTable from "./PostTable";
import Filters from "./Filters";

export default function Dashboard() {
  const { posts } = useData();

  /* ---------- filter state ---------- */
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  /* unique post types */
  const postTypes = useMemo(() => {
    const set = new Set(posts.map((p) => p.postType).filter(Boolean));
    return Array.from(set).sort();
  }, [posts]);

  /* initialise selected types when data first arrives */
  useMemo(() => {
    if (postTypes.length > 0 && selectedTypes.length === 0) {
      setSelectedTypes(postTypes);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postTypes]);

  const handleTypeToggle = useCallback(
    (type) =>
      setSelectedTypes((prev) =>
        prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
      ),
    []
  );

  /* filtered data */
  const filtered = useMemo(() => {
    return posts.filter((p) => {
      if (startDate && p.date && p.date < startDate) return false;
      if (endDate && p.date && p.date > endDate) return false;
      if (!selectedTypes.includes(p.postType)) return false;
      if (
        searchTerm &&
        !(p.postMessage || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
        return false;
      return true;
    });
  }, [posts, startDate, endDate, selectedTypes, searchTerm]);

  if (posts.length === 0) return null;

  return (
    <section className="dashboard">
      <Filters
        startDate={startDate}
        endDate={endDate}
        onStartChange={setStartDate}
        onEndChange={setEndDate}
        postTypes={postTypes}
        selectedTypes={selectedTypes}
        onTypeToggle={handleTypeToggle}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <KpiCards data={filtered} />

      <div className="charts-row">
        <TrendChart data={filtered} />
        <PostTypeChart data={filtered} />
      </div>

      <PostTable data={filtered} />
    </section>
  );
}

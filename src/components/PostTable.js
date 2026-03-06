import React, { useState, useMemo } from "react";
import { format } from "date-fns";

const PAGE_SIZE = 15;

const SORTABLE_COLS = [
  { key: "date", label: "Date", type: "date" },
  { key: "postMessage", label: "Post Message", type: "text" },
  { key: "postType", label: "Type", type: "text" },
  { key: "reach", label: "Reach", type: "number" },
  { key: "engagementRate", label: "Eng. Rate", type: "number" },
  { key: "clicks", label: "Clicks", type: "number" },
  { key: "postEngagement", label: "Engagement", type: "number" },
  { key: "shares", label: "Shares", type: "number" },
];

export default function PostTable({ data }) {
  const [sortKey, setSortKey] = useState("reach");
  const [sortDir, setSortDir] = useState("desc");
  const [page, setPage] = useState(0);

  const sorted = useMemo(() => {
    const copy = [...data];
    copy.sort((a, b) => {
      let va = a[sortKey];
      let vb = b[sortKey];
      if (va instanceof Date) {
        va = va.getTime();
        vb = vb?.getTime() ?? 0;
      }
      if (typeof va === "string") {
        return sortDir === "asc"
          ? va.localeCompare(vb)
          : vb.localeCompare(va);
      }
      return sortDir === "asc" ? va - vb : vb - va;
    });
    return copy;
  }, [data, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const pageData = sorted.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const toggleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
    setPage(0);
  };

  const arrow = (key) => {
    if (sortKey !== key) return "";
    return sortDir === "asc" ? " ▲" : " ▼";
  };

  const truncate = (str, len = 100) =>
    str && str.length > len ? str.slice(0, len) + "…" : str || "";

  if (data.length === 0) return null;

  return (
    <div className="table-section">
      <h3>🏆 Post Leaderboard</h3>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              {SORTABLE_COLS.map((col) => (
                <th key={col.key} onClick={() => toggleSort(col.key)}>
                  {col.label}
                  {arrow(col.key)}
                </th>
              ))}
              <th>Link</th>
            </tr>
          </thead>
          <tbody>
            {pageData.map((post, i) => (
              <tr key={post.postId || i}>
                <td className="no-wrap">
                  {post.date ? format(post.date, "MM/dd/yyyy") : "—"}
                </td>
                <td className="msg-cell" title={post.postMessage}>
                  {truncate(post.postMessage)}
                </td>
                <td>{post.postType}</td>
                <td className="num">{post.reach.toLocaleString()}</td>
                <td className="num">{(post.engagementRate * 100).toFixed(2)}%</td>
                <td className="num">{post.clicks.toLocaleString()}</td>
                <td className="num">{post.postEngagement.toLocaleString()}</td>
                <td className="num">{post.shares.toLocaleString()}</td>
                <td>
                  {post.postPermalink ? (
                    <a
                      href={post.postPermalink}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="View on Facebook"
                    >
                      🔗
                    </a>
                  ) : (
                    "—"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="pagination">
        <button disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
          ◀ Prev
        </button>
        <span>
          Page {page + 1} of {totalPages}
        </span>
        <button
          disabled={page >= totalPages - 1}
          onClick={() => setPage((p) => p + 1)}
        >
          Next ▶
        </button>
      </div>
    </div>
  );
}

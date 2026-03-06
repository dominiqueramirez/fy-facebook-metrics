import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function Filters({
  startDate,
  endDate,
  onStartChange,
  onEndChange,
  postTypes,
  selectedTypes,
  onTypeToggle,
  searchTerm,
  onSearchChange,
}) {
  return (
    <div className="filters-bar">
      <div className="filter-group">
        <label>From</label>
        <DatePicker
          selected={startDate}
          onChange={onStartChange}
          dateFormat="MM/dd/yyyy"
          isClearable
          placeholderText="Start date"
          className="date-input"
        />
      </div>

      <div className="filter-group">
        <label>To</label>
        <DatePicker
          selected={endDate}
          onChange={onEndChange}
          dateFormat="MM/dd/yyyy"
          isClearable
          placeholderText="End date"
          className="date-input"
        />
      </div>

      <div className="filter-group types-group">
        <label>Post Type</label>
        <div className="type-checks">
          {postTypes.map((t) => (
            <label key={t} className="check-label">
              <input
                type="checkbox"
                checked={selectedTypes.includes(t)}
                onChange={() => onTypeToggle(t)}
              />
              {t}
            </label>
          ))}
        </div>
      </div>

      <div className="filter-group search-group">
        <label>Search</label>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Filter by keyword…"
          className="search-input"
        />
      </div>
    </div>
  );
}

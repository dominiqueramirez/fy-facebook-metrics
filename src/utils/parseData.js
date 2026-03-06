import JSZip from "jszip";
import Papa from "papaparse";

/**
 * Extracts CSV files from a ZIP archive buffer and parses them into an array
 * of post objects.
 *
 * @param {ArrayBuffer} buffer – raw bytes of a .zip file
 * @returns {Promise<Array>} parsed rows
 */
export async function parseZip(buffer) {
  const zip = await JSZip.loadAsync(buffer);
  const csvFiles = Object.keys(zip.files).filter((name) =>
    name.toLowerCase().endsWith(".csv")
  );

  const allRows = [];

  for (const fileName of csvFiles) {
    const csvText = await zip.files[fileName].async("string");
    const { data } = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
    });

    for (const row of data) {
      allRows.push(normalizeRow(row));
    }
  }

  return allRows;
}

/**
 * Normalise a single CSV row into a typed JS object.
 */
function normalizeRow(raw) {
  return {
    date: raw["Date (GMT)"] ? new Date(raw["Date (GMT)"]) : null,
    dateStr: raw["Date (GMT)"] || "",
    facebookPage: raw["Facebook Page"] || "",
    postId: raw["Post ID"] || "",
    postPermalink: raw["Post Permalink"] || "",
    postType: raw["Post Type"] || "",
    postMessage: raw["Post Message"] || "",
    clicks: safeInt(raw["Clicks"]),
    postEngagement: safeInt(raw["Post engagement"]),
    engagementRate: safeFloat(raw["Engagement rate"]),
    fanImpressions: safeInt(raw["Fan impressions (unique)"]),
    reactions: safeInt(raw["Reactions"]),
    reach: safeInt(raw["Reach"]),
    shares: safeInt(raw["Shares (unique)"]),
    viralReach: safeInt(raw["Viral reach"]),
    reactionsWow: safeInt(raw["Reactions: Wow"]),
    hotPost: raw["Hot Post"] === "True",
    viralPost: raw["Viral Post"] === "True",
  };
}

function safeInt(val) {
  const n = parseInt(val, 10);
  return Number.isFinite(n) ? n : 0;
}

function safeFloat(val) {
  const n = parseFloat(val);
  return Number.isFinite(n) ? n : 0;
}

/**
 * Merge new rows into an existing dataset, deduplicating by Post ID.
 */
export function mergeData(existing, incoming) {
  const map = new Map();
  for (const row of existing) {
    map.set(row.postId, row);
  }
  for (const row of incoming) {
    map.set(row.postId, row);
  }
  return Array.from(map.values());
}

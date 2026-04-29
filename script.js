let conferences = [];

const container = document.getElementById("conferenceContainer");
const searchInput = document.getElementById("search");
const areaFilter = document.getElementById("areaFilter");
const statusFilter = document.getElementById("statusFilter");

fetch("conferences.json")
  .then(response => response.json())
  .then(data => {
    conferences = data;
    populateAreaFilter();
    renderConferences();
  })
  .catch(error => {
    container.innerHTML = `<p>Could not load conferences.json: ${error}</p>`;
  });

function parseDate(value) {
  if (!value) return null;
  return new Date(value);
}

function getPrimaryDeadline(conf) {
  const current = parseDate(conf.deadline);
  const next = parseDate(conf.next_deadline);
  const now = new Date();

  if (current && current >= now) {
    return {
      date: current,
      edition: conf.edition || "",
      mode: "current"
    };
  }

  if (next) {
    return {
      date: next,
      edition: conf.next_edition || "Next edition",
      mode: "next_known"
    };
  }

  return {
    date: null,
    edition: conf.next_edition || inferNextEdition(conf.edition),
    mode: current ? "next_pending" : "not_announced"
  };
}

function inferNextEdition(edition) {
  const year = Number(edition);
  if (!Number.isNaN(year) && year > 0) return String(year + 1);
  return "Next edition";
}

function getDaysLeft(deadline) {
  const now = new Date();
  const diff = deadline - now;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function getConferenceStatus(conf) {
  const current = parseDate(conf.deadline);
  const next = parseDate(conf.next_deadline);
  const now = new Date();

  if (current && current < now && next) return "announced";
  if (current && current < now && !next) return "pending";
  if (current && current >= now) return "announced";
  if (!current && next) return "announced";
  if (conf.status === "not_announced" || !current) return "pending";
  return "past";
}

function getCountdown(conf) {
  const primary = getPrimaryDeadline(conf);

  if (!primary.date) {
    return {
      text: `${primary.edition}: deadline not announced`,
      className: "pending"
    };
  }

  const days = getDaysLeft(primary.date);
  const editionLabel = primary.edition ? `${primary.edition}: ` : "";

  if (days < 0) {
    return { text: "Passed", className: "past" };
  }

  if (days === 0) {
    return { text: `${editionLabel}Due today`, className: "urgent" };
  }

  if (days <= 7) {
    return { text: `${editionLabel}Due in ${days} days`, className: "urgent" };
  }

  if (days <= 30) {
    return { text: `${editionLabel}Due in ${days} days`, className: "soon" };
  }

  return { text: `${editionLabel}Due in ${days} days`, className: "safe" };
}

function formatDeadline(conf) {
  const primary = getPrimaryDeadline(conf);
  if (!primary.date) return "Not announced";

  return primary.date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

function populateAreaFilter() {
  const areas = [...new Set(conferences.map(c => c.area).filter(Boolean))].sort();

  areas.forEach(area => {
    const option = document.createElement("option");
    option.value = area;
    option.textContent = area;
    areaFilter.appendChild(option);
  });
}

function renderConferences() {
  const search = searchInput.value.toLowerCase();
  const area = areaFilter.value;
  const status = statusFilter.value;

  let visible = conferences
    .filter(conf => {
      const haystack = [
        conf.name,
        conf.area,
        conf.location,
        ...(conf.tags || [])
      ].join(" ").toLowerCase();

      return haystack.includes(search);
    })
    .filter(conf => area === "all" || conf.area === area)
    .filter(conf => {
      const confStatus = getConferenceStatus(conf);
      if (status === "all") return true;
      if (status === "actionable") return confStatus === "announced" || confStatus === "pending";
      if (status === "announced") return confStatus === "announced";
      if (status === "pending") return confStatus === "pending";
      if (status === "past") return confStatus === "past";
      return true;
    })
    .sort((a, b) => {
      const da = getPrimaryDeadline(a).date;
      const db = getPrimaryDeadline(b).date;

      if (!da && !db) return a.name.localeCompare(b.name);
      if (!da) return 1;
      if (!db) return -1;

      return da - db;
    });

  container.innerHTML = "";

  if (visible.length === 0) {
    container.innerHTML = "<p>No matching conferences found.</p>";
    return;
  }

  visible.forEach(conf => {
    const countdown = getCountdown(conf);
    const primary = getPrimaryDeadline(conf);
    const tags = conf.tags || [];
    const edition = primary.edition || conf.edition || "";

    let note = "";
    if (primary.mode === "next_pending") {
      note = `<p class="note">The listed deadline has passed. This card is now tracking ${edition}, but the next deadline has not been entered yet.</p>`;
    } else if (primary.mode === "next_known") {
      note = `<p class="note">The previous listed deadline has passed, so this card is now tracking the next known edition.</p>`;
    }

    const card = document.createElement("article");
    card.className = "card";

    card.innerHTML = `
      <h2>${conf.name}${edition ? " " + edition : ""}</h2>
      <p class="meta">${conf.area || "General"} · ${conf.location || "Location TBA"}</p>
      <div class="badges">
        ${tags.map(tag => `<span class="badge">${tag}</span>`).join("")}
      </div>
      <p class="countdown ${countdown.className}">${countdown.text}</p>
      <p><strong>Deadline:</strong> ${formatDeadline(conf)} ${conf.timezone ? `(${conf.timezone})` : ""}</p>
      ${note}
      <p><a href="${conf.link}" target="_blank" rel="noopener noreferrer">Conference website</a></p>
    `;

    container.appendChild(card);
  });
}

searchInput.addEventListener("input", renderConferences);
areaFilter.addEventListener("change", renderConferences);
statusFilter.addEventListener("change", renderConferences);

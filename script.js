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

function parseDeadline(conf) {
  if (!conf.deadline || conf.status === "not_announced") {
    return null;
  }
  return new Date(conf.deadline);
}

function getDaysLeft(deadline) {
  const now = new Date();
  const diff = deadline - now;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function getCountdownText(conf) {
  const deadline = parseDeadline(conf);

  if (!deadline) {
    return { text: "Deadline not announced", className: "past" };
  }

  const days = getDaysLeft(deadline);

  if (days < 0) {
    return { text: "Passed", className: "past" };
  }

  if (days === 0) {
    return { text: "Due today", className: "urgent" };
  }

  if (days <= 7) {
    return { text: `Due in ${days} days`, className: "urgent" };
  }

  if (days <= 30) {
    return { text: `Due in ${days} days`, className: "soon" };
  }

  return { text: `Due in ${days} days`, className: "safe" };
}

function formatDate(conf) {
  const deadline = parseDeadline(conf);
  if (!deadline) return "Not announced";

  return deadline.toLocaleDateString(undefined, {
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
    .filter(conf => conf.name.toLowerCase().includes(search))
    .filter(conf => area === "all" || conf.area === area)
    .filter(conf => {
      const deadline = parseDeadline(conf);
      const isPast = deadline && deadline < new Date();

      if (status === "all") return true;
      if (status === "past") return isPast;
      if (status === "upcoming") return !isPast;
      return true;
    })
    .sort((a, b) => {
      const da = parseDeadline(a);
      const db = parseDeadline(b);

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
    const countdown = getCountdownText(conf);
    const tags = conf.tags || [];

    const card = document.createElement("article");
    card.className = "card";

    card.innerHTML = `
      <h2>${conf.name}</h2>
      <p class="meta">${conf.area || "General"} · ${conf.location || "Location TBA"}</p>
      <div class="badges">
        ${tags.map(tag => `<span class="badge">${tag}</span>`).join("")}
      </div>
      <p class="countdown ${countdown.className}">${countdown.text}</p>
      <p><strong>Deadline:</strong> ${formatDate(conf)} ${conf.timezone ? `(${conf.timezone})` : ""}</p>
      <p><a href="${conf.link}" target="_blank" rel="noopener noreferrer">Conference website</a></p>
    `;

    container.appendChild(card);
  });
}

searchInput.addEventListener("input", renderConferences);
areaFilter.addEventListener("change", renderConferences);
statusFilter.addEventListener("change", renderConferences);

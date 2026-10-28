
const locations = [
  { id: "L1", name: "Control Centre", type: "Command", people: "—", x: 80, y: 70, icon: "⌘" },
  { id: "L2", name: "North Shelter", type: "Shelter", people: "420 capacity", x: 260, y: 70, icon: "⌂" },
  { id: "L3", name: "Riverside Clinic", type: "Medical", people: "60 beds", x: 440, y: 70, icon: "✚" },
  { id: "L4", name: "Central Depot", type: "Supply depot", people: "Boats & kits", x: 620, y: 70, icon: "▣" },
  { id: "L5", name: "East Bridge", type: "Route / crossing", people: "Partially blocked", x: 800, y: 70, icon: "⌁" },
  { id: "L6", name: "Lowland Village", type: "Affected area", people: "310 people", x: 170, y: 425, icon: "⌂" },
  { id: "L7", name: "Market District", type: "Affected area", people: "180 people", x: 350, y: 425, icon: "⌂" },
  { id: "L8", name: "South School", type: "Shelter", people: "250 capacity", x: 530, y: 425, icon: "⌂" },
  { id: "L9", name: "West Landing", type: "Boat access", people: "Boat launch", x: 710, y: 425, icon: "≈" },
  { id: "L10", name: "Water Plant", type: "Utility", people: "Water treatment", x: 830, y: 270, icon: "◉" }
];

const tasks = [
  {
    id: "T1",
    name: "Assess affected zones",
    short: "Area assessment",
    cost: 900,
    people: 0,
    location: "L1",
    type: "OR",
    desc: "Establish verified impact, hazards and route conditions before dispatch.",
    alternatives: ["Drone survey", "Ground assessment"],
    time: "20 min"
  },
  {
    id: "T2",
    name: "Evacuate Lowland Village",
    short: "Village evacuation",
    cost: 4200,
    people: 310,
    location: "L6",
    type: "OR",
    desc: "Move residents from the flooded lowland to a verified safe shelter.",
    needs: ["T1"],
    alternatives: [
      "Boat evacuation via West Landing",
      "High-ground bus route via East Bridge"
    ],
    time: "60–90 min"
  },
  {
    id: "T3",
    name: "Evacuate Market District",
    short: "District evacuation",
    cost: 2600,
    people: 180,
    location: "L7",
    type: "OR",
    desc: "Evacuate residents and visitors from the market district.",
    needs: ["T1"],
    alternatives: [
      "Bus convoy to South School",
      "Foot teams to North Shelter"
    ],
    time: "45 min"
  },
  {
    id: "T4",
    name: "Set up medical support",
    short: "Medical support",
    cost: 1800,
    people: 70,
    location: "L3",
    type: "OR",
    desc: "Deploy triage staff, first-aid kits and a patient transfer point.",
    needs: ["T1"],
    alternatives: ["Riverside Clinic team"],
    time: "30 min"
  },
  {
    id: "T5",
    name: "Transport critical patients",
    short: "Patient transport",
    cost: 2200,
    people: 24,
    location: "L4",
    type: "OR",
    desc: "Transport urgent patients to a safe treatment point.",
    needs: ["T4"],
    alternatives: ["Ambulance convoy", "Boat medical transfer"],
    time: "30–50 min"
  },
  {
    id: "T6",
    name: "Distribute clean water",
    short: "Water distribution",
    cost: 1500,
    people: 500,
    location: "L10",
    type: "OR",
    desc: "Provide potable water and safe collection points.",
    needs: ["T1", "T7"],
    alternatives: ["Water-truck delivery"],
    time: "40 min"
  },
  {
    id: "T7",
    name: "Open temporary shelters",
    short: "Shelter activation",
    cost: 1100,
    people: 670,
    location: "L2",
    type: "OR",
    desc: "Inspect, staff and stock a safe shelter before people arrive.",
    needs: ["T1"],
    alternatives: ["North Shelter", "South School"],
    time: "25 min"
  }
];

const graphNodes = [
  {
    id: "ROOT",
    name: "Flood response",
    sub: "AND · all required groups",
    type: "and",
    x: 500, y: 24, w: 220, h: 48,
    desc: "The overall response requires assessment, evacuation, medical response and essential supplies."
  },
  {
    id: "T1",
    name: "Assess zones",
    sub: "OR · drone or ground",
    type: "or",
    x: 500, y: 112, w: 174, h: 48,
    desc: "Choose one feasible assessment method before response operations proceed."
  },
  {
    id: "G_EVAC",
    name: "Evacuation operations",
    sub: "AND · both areas",
    type: "and",
    x: 190, y: 210, w: 190, h: 48,
    desc: "Both Lowland Village and Market District evacuation are required."
  },
  {
    id: "G_MED",
    name: "Medical response",
    sub: "AND · support + transfer",
    type: "and",
    x: 500, y: 210, w: 190, h: 48,
    desc: "The response requires medical support and patient transportation."
  },
  {
    id: "G_SUP",
    name: "Essential supplies",
    sub: "AND · shelters + water",
    type: "and",
    x: 810, y: 210, w: 190, h: 48,
    desc: "Shelter activation and clean-water distribution are required."
  },
  {
    id: "T2",
    name: "Village evacuation",
    sub: "OR · boat or bus",
    type: "or",
    x: 100, y: 330, w: 150, h: 48
  },
  {
    id: "T3",
    name: "District evacuation",
    sub: "OR · bus or foot teams",
    type: "or",
    x: 265, y: 330, w: 150, h: 48
  },
  {
    id: "T4",
    name: "Medical support",
    sub: "OR · available method",
    type: "or",
    x: 430, y: 330, w: 150, h: 48
  },
  {
    id: "T5",
    name: "Patient transport",
    sub: "OR · ambulance or boat",
    type: "or",
    x: 595, y: 330, w: 150, h: 48
  },
  {
    id: "T7",
    name: "Open shelters",
    sub: "OR · North or South",
    type: "or",
    x: 760, y: 330, w: 150, h: 48
  },
  {
    id: "T6",
    name: "Clean water",
    sub: "OR · delivery method",
    type: "or",
    x: 850, y: 425, w: 150, h: 48
  }
];

let selected = "ROOT";
let currentPlan = null;

// Store one selected response option per task.
const selectedOptions = {};

const $ = id => document.getElementById(id);

const money = n =>
  "₹" + Number(n || 0).toLocaleString("en-IN");

function renderGraph() {
  const svg = $("graph");
  if (!svg) return;

  let html = `
    <defs>
      <marker id="arrow" markerWidth="7" markerHeight="7"
        refX="6" refY="3.5" orient="auto">
        <path d="M0,0 L7,3.5 L0,7 z" fill="#3b526c"/>
      </marker>

      <marker id="dependencyArrow" markerWidth="7" markerHeight="7"
        refX="6" refY="3.5" orient="auto">
        <path d="M0,0 L7,3.5 L0,7 z" fill="#d7a64a"/>
      </marker>
    </defs>

    <text x="18" y="18" class="graph-label">
      ROOT AND COMPOSITE AND NODES
    </text>

    <text x="18" y="500" class="graph-label">
      TASK NODES WITH OR ALTERNATIVES
    </text>
  `;

  const byId = id => graphNodes.find(n => n.id === id);

  function link(source, target, kind = "hierarchy") {
    let d;

    if (kind === "dependency") {
      const sx = source.x;
      const sy = source.y + source.h;
      const tx = target.x;
      const ty = target.y + target.h;
      const routeY = Math.max(sy, ty) + 28;

      d = `M ${sx} ${sy}
           C ${sx} ${routeY},
             ${tx} ${routeY},
             ${tx} ${ty}`;
    } else {
      const sx = source.x;
      const sy = source.y + source.h;
      const tx = target.x;
      const ty = target.y;

      if (ty > sy + 12) {
        const midY = sy + (ty - sy) * 0.5;

        d = `M ${sx} ${sy}
             C ${sx} ${midY},
               ${tx} ${midY},
               ${tx} ${ty}`;
      } else {
        const direction = tx >= sx ? 1 : -1;
        const startX = source.x + direction * source.w / 2;
        const endX = target.x - direction * target.w / 2;
        const startY = source.y + source.h / 2;
        const endY = target.y + target.h / 2;
        const bend = Math.max(28, Math.abs(endX - startX) * 0.4);

        d = `M ${startX} ${startY}
             C ${startX + direction * bend} ${startY},
               ${endX - direction * bend} ${endY},
               ${endX} ${endY}`;
      }
    }

    const marker =
      kind === "dependency" ? "dependencyArrow" : "arrow";

    return `
      <path class="edge ${kind}"
        marker-end="url(#${marker})"
        d="${d}"/>
    `;
  }

  const hierarchyPairs = [
    ["ROOT", "T1"],
    ["T1", "G_EVAC"],
    ["T1", "G_MED"],
    ["T1", "G_SUP"],
    ["G_EVAC", "T2"],
    ["G_EVAC", "T3"],
    ["G_MED", "T4"],
    ["G_MED", "T5"],
    ["G_SUP", "T7"],
    ["G_SUP", "T6"]
  ];

  hierarchyPairs.forEach(([sourceId, targetId]) => {
    const source = byId(sourceId);
    const target = byId(targetId);

    if (source && target) {
      html += link(source, target, "hierarchy");
    }
  });

  // Prerequisite is retained in task data; no extra dashed edge
  // is drawn here because it duplicates the solid hierarchy.
  const dependencyPairs = [];

  dependencyPairs.forEach(([sourceId, targetId]) => {
    const source = byId(sourceId);
    const target = byId(targetId);

    if (source && target) {
      html += link(source, target, "dependency");
    }
  });

  graphNodes.forEach(n => {
    html += `
      <g class="node ${n.type}
        ${n.id === "ROOT" ? "root" : ""}
        ${selected === n.id ? "selected" : ""}"
        data-id="${n.id}"
        tabindex="0"
        role="button"
        aria-label="Inspect ${n.name}">

        <rect
          x="${n.x - n.w / 2}"
          y="${n.y}"
          width="${n.w}"
          height="${n.h}"/>

        <text class="n-title"
          x="${n.x}" y="${n.y + 19}"
          text-anchor="middle">${n.name}</text>

        <text class="n-sub"
          x="${n.x}" y="${n.y + 34}"
          text-anchor="middle">${n.sub}</text>
      </g>
    `;
  });

  svg.innerHTML = html;
  svg.setAttribute("viewBox", "0 0 1000 510");

  svg.querySelectorAll(".node").forEach(el => {
    el.addEventListener("click", () => inspect(el.dataset.id));

    el.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        inspect(el.dataset.id);
      }
    });
  });
}

function inspect(id) {
  selected = id;
  renderGraph();

  const node = graphNodes.find(n => n.id === id);
  const task = tasks.find(t => t.id === id);

  if (!$("detailTitle")) return;

  $("detailTitle").textContent =
    node?.name || task?.name || id;

  $("nodeType").textContent =
    task ? task.type : (node?.type || "NODE").toUpperCase();

  $("detailDescription").textContent =
    task
      ? task.desc
      : (node?.desc || "This composite node groups required tasks.");

  let body = "";

  if (task) {
    body += row("Estimated direct cost", money(task.cost));

    body += row(
      "Estimated people reached",
      task.people.toLocaleString()
    );

    body += row(
      "Location",
      locations.find(l => l.id === task.location)?.name ||
        task.location
    );

    body += row("Expected duration", task.time || "Varies");

    body += `
      <div class="section-kicker" style="margin-top:18px">
        RESPONSE OPTIONS
      </div>
      <div class="child-list">
    `;

    (task.alternatives || []).forEach((alternative, i) => {
      const isSelected = selectedOptions[task.id] === i;

      body += `
        <button
          type="button"
          class="child-item ${isSelected ? "selected-option" : ""}"
          data-alt="${i}"
          aria-pressed="${isSelected ? "true" : "false"}">

          <span>
            <strong>${alternative}</strong>
            <small>
              ${isSelected
                ? "Selected option"
                : i === 0
                  ? "Primary option"
                  : "Alternative option"}
            </small>
          </span>

          <span>${isSelected ? "✓" : "↗"}</span>
        </button>
      `;
    });

    body += "</div>";

    if (task.needs?.length) {
      body += row("Prerequisites", task.needs.join(", "));
    }
  } else {
    body += row(
      "Node logic",
      (node?.type || "and").toUpperCase()
    );

    body += row("Planning model", "AND/OR graph");
    body += row("Task groups", tasks.length);
    body += row("Cost evaluation", "AND sums / OR minimum");

    const childMap = {
      ROOT: ["T1", "G_EVAC", "G_MED", "G_SUP"],
      G_EVAC: ["T2", "T3"],
      G_MED: ["T4", "T5"],
      G_SUP: ["T7", "T6"]
    };

    const childIds = childMap[id] || [];

    if (childIds.length) {
      body += `
        <div class="section-kicker" style="margin-top:18px">
          REQUIRED CHILD NODES
        </div>
        <div class="child-list">
          ${childIds.map(childId => {
            const childNode = graphNodes.find(n => n.id === childId);
            const childTask = tasks.find(t => t.id === childId);

            return `
              <button
                type="button"
                class="child-item"
                data-node="${childId}">

                <span>
                  <strong>${childNode?.name || childTask?.name || childId}</strong>
                  <small>
                    ${(childNode?.type || childTask?.type || "node").toUpperCase()} node
                  </small>
                </span>

                <span>↗</span>
              </button>
            `;
          }).join("")}
        </div>
      `;
    }
  }

  $("detailBody").innerHTML = body;

  // Navigate to another graph node.
  $("detailBody").querySelectorAll("[data-node]").forEach(button => {
    button.addEventListener("click", () => {
      inspect(button.dataset.node);
    });
  });

  // Select an option without triggering a browser alert.
  $("detailBody").querySelectorAll("[data-alt]").forEach(button => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.alt);

      selectedOptions[task.id] = index;

      // Re-render the inspector to highlight the selected option.
      inspect(task.id);

      // Show a non-blocking confirmation.
      const note = document.createElement("p");
      note.className = "selection-note";
      note.setAttribute("role", "status");

      note.textContent =
        `Selected: ${task.alternatives[index]}. ` +
        "Verify route and resource availability before deployment.";

      $("detailBody").appendChild(note);
    });
  });
}

function row(label, value) {
  return `
    <div class="detail-row">
      <span>${label}</span>
      <strong>${value}</strong>
    </div>
  `;
}

function renderLocations() {
  if (!$("locationsList")) return;

  $("locationsList").innerHTML = locations.map(location => `
    <div class="location-card">
      <div class="location-icon">${location.icon}</div>
      <div>
        <strong>${location.name}</strong>
        <small>
          ${location.id} · ${location.type} · ${location.people}
        </small>
      </div>
    </div>
  `).join("");
}

function renderCatalog() {
  if (!$("taskCatalog")) return;

  $("taskCatalog").innerHTML = tasks.map(task => `
    <div class="catalog-card">
      <div class="catalog-num">${task.id}</div>
      <div>
        <strong>${task.name}</strong>
        <small>
          ${task.type} node · ${money(task.cost)} ·
          ${task.people} estimated beneficiaries
        </small>
      </div>
    </div>
  `).join("");
}

async function generatePlan() {
  const budget = Math.max(0, Number($("budget").value) || 0);
  const priority = $("priority").value;

  $("planSubtitle").textContent =
    "Calculating candidate plan with the FastAPI backend…";

  try {
    const response = await fetch(
      `/api/plan?budget=${encodeURIComponent(budget)}&priority=${encodeURIComponent(priority)}`
    );

    if (!response.ok) {
      throw new Error("API returned " + response.status);
    }

    const plan = await response.json();

    currentPlan = {
      rows: plan.tasks,
      total: plan.total_cost,
      people: plan.people,
      budget: plan.budget,
      feasible: plan.feasible,
      all: plan.all_tasks_covered
    };

    $("costMetric").textContent = money(plan.total_cost);

    $("budgetMetric").textContent =
      `Budget ceiling: ${money(budget)} · ` +
      (plan.total_cost <= budget ? "within limit" : "over budget");

    $("peopleMetric").textContent =
      Number(plan.people || 0).toLocaleString();

    $("tasksMetric").textContent =
      `${plan.selected_count} / ${plan.total_task_groups}`;

    $("statusMetric").textContent = plan.status;
    $("statusMetric").style.color =
      plan.feasible ? "var(--green)" : "var(--red)";

    $("statusDetail").textContent =
      plan.all_tasks_covered
        ? "All task groups covered"
        : `${(plan.deferred_task_ids || []).length} task group(s) deferred`;

    $("planSubtitle").textContent = plan.note;

    if (!plan.tasks.length) {
      $("planContent").innerHTML = `
        <div class="empty-state">
          No tasks selected under this budget.
          Increase the budget and try again.
        </div>
      `;
      return;
    }

    $("planContent").innerHTML = `
      <div class="plan-table-wrap">
        <table>
          <thead>
            <tr>
              <th>TASK / OPERATION</th>
              <th>LOCATION</th>
              <th>NODE</th>
              <th>EST. BENEFICIARIES</th>
              <th>SELECTED COST</th>
            </tr>
          </thead>
          <tbody>
            ${plan.tasks.map(task => `
              <tr>
                <td class="task-name">
                  ${task.name}
                  <small>
                    Chosen: ${task.option}<br>
                    ${task.option_reason || ""}
                  </small>
                </td>
                <td>${task.location_name}</td>
                <td><span class="pill alt">OR · choose one</span></td>
                <td>${Number(task.people || 0).toLocaleString()}</td>
                <td>${money(task.cost)}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>

        <div class="plan-total">
          <span>
            ${plan.selected_count} / ${plan.total_task_groups} required task groups
          </span>
          <span>
            Estimated total <strong>${money(plan.total_cost)}</strong>
          </span>
        </div>

        <div style="padding:14px 12px;border-top:1px solid var(--line)">
          <div class="section-kicker">COST-BACKUP TRACE</div>

          <p style="font-size:12px;color:var(--muted);margin:6px 0 10px">
            OR nodes compare operational alternatives. The root AND node
            combines required task groups.
          </p>

          ${(plan.search_trace || []).map(step => `
            <div class="detail-row">
              <span>
                <strong>${step.node}</strong> · ${step.operation}
              </span>
              <strong>
                ${step.chosen
                  ? `${step.chosen} · ${money(step.backed_up_cost)}`
                  : step.combined_cost !== undefined
                    ? money(step.combined_cost)
                    : step.result || "evaluated"}
              </strong>
            </div>

            ${step.candidate_costs
              ? step.candidate_costs.map(option => `
                <div class="detail-row" style="padding-left:16px">
                  <span>
                    ${option.option}${option.feasible ? "" : " · infeasible"}
                  </span>
                  <strong>${money(option.cost)}</strong>
                </div>
              `).join("")
              : ""}
          `).join("")}
        </div>

        ${!plan.feasible
          ? `<p style="color:var(--amber);font-size:12px;padding:0 12px">${plan.note}</p>`
          : ""}
      </div>
    `;
  } catch (error) {
    $("planSubtitle").textContent =
      "Could not connect to FastAPI. Start the server with: uvicorn app:app --reload";

    $("statusMetric").textContent = "API ERROR";
    $("statusMetric").style.color = "var(--red)";

    console.error(error);
  }
}

function exportCSV() {
  const budget = Math.max(0, Number($("budget").value) || 0);
  const priority = $("priority").value;

  window.location.href =
    `/api/plan.csv?budget=${encodeURIComponent(budget)}&priority=${encodeURIComponent(priority)}`;
}

if ($("planBtn")) {
  $("planBtn").addEventListener("click", generatePlan);
}

if ($("resetBtn")) {
  $("resetBtn").addEventListener("click", () => {
    $("budget").value = 18000;
    $("priority").value = "balanced";
    currentPlan = null;

    $("costMetric").textContent = "—";
    $("budgetMetric").textContent = "Set budget and generate plan";
    $("peopleMetric").textContent = "—";
    $("tasksMetric").textContent = "—";

    $("statusMetric").textContent = "NOT RUN";
    $("statusMetric").style.color = "var(--amber)";
    $("statusDetail").textContent =
      "Generate a plan to evaluate feasibility";

    $("planSubtitle").textContent =
      "Generate a plan to see the selected operations and their costs.";

    $("planContent").innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">⌁</div>
        <strong>No plan generated yet</strong>
        <p>
          Choose a budget and select <b>Generate plan</b>
          to calculate a feasible response.
        </p>
      </div>
    `;
  });
}

if ($("exportBtn")) {
  $("exportBtn").addEventListener("click", exportCSV);
}

if ($("showAllBtn")) {
  $("showAllBtn").addEventListener("click", () => {
    inspect("ROOT");

    $("graph")?.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  });
}

renderGraph();
renderLocations();
renderCatalog();
inspect("ROOT");

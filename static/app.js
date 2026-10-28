const locations=[
{id:"L1",name:"Control Centre",type:"Command",people:"—",x:80,y:70,icon:"⌘"},
{id:"L2",name:"North Shelter",type:"Shelter",people:"420 capacity",x:260,y:70,icon:"⌂"},
{id:"L3",name:"Riverside Clinic",type:"Medical",people:"60 beds",x:440,y:70,icon:"✚"},
{id:"L4",name:"Central Depot",type:"Supply depot",people:"Boats & kits",x:620,y:70,icon:"▣"},
{id:"L5",name:"East Bridge",type:"Route / crossing",people:"Partially blocked",x:800,y:70,icon:"⌁"},
{id:"L6",name:"Lowland Village",type:"Affected area",people:"310 people",x:170,y:425,icon:"⌂"},
{id:"L7",name:"Market District",type:"Affected area",people:"180 people",x:350,y:425,icon:"⌂"},
{id:"L8",name:"South School",type:"Shelter",people:"250 capacity",x:530,y:425,icon:"⌂"},
{id:"L9",name:"West Landing",type:"Boat access",people:"Boat launch",x:710,y:425,icon:"≈"},
{id:"L10",name:"Water Plant",type:"Utility",people:"Water treatment",x:830,y:270,icon:"◉"}
];
const tasks=[
{id:"T1",name:"Assess affected zones",short:"Area assessment",cost:900,people:0,location:"L1",type:"OR",desc:"Establish verified impact, hazards and route conditions before dispatch.",alternatives:["Drone survey","Ground assessment"],time:"20 min"},
{id:"T2",name:"Evacuate Lowland Village",short:"Village evacuation",cost:4200,people:310,location:"L6",type:"OR",desc:"Move residents from the flooded lowland to a verified safe shelter.",needs:["T1"],alternatives:["Boat evacuation via West Landing","High-ground bus route via East Bridge"],time:"60–90 min"},
{id:"T3",name:"Evacuate Market District",short:"District evacuation",cost:2600,people:180,location:"L7",type:"OR",desc:"Evacuate residents and visitors from the market district.",needs:["T1"],alternatives:["Bus convoy to South School","Foot teams to North Shelter"],time:"45 min"},
{id:"T4",name:"Set up medical support",short:"Medical support",cost:1800,people:70,location:"L3",type:"OR",desc:"Deploy triage staff, first-aid kits and a patient transfer point.",needs:["T1"],alternatives:["Riverside Clinic team"],time:"30 min"},
{id:"T5",name:"Transport critical patients",short:"Patient transport",cost:2200,people:24,location:"L4",type:"OR",desc:"Transport urgent patients to the Riverside Clinic or another safe treatment point.",needs:["T4"],alternatives:["Ambulance convoy","Boat medical transfer"],time:"30–50 min"},
{id:"T6",name:"Distribute clean water",short:"Water distribution",cost:1500,people:500,location:"L10",type:"OR",desc:"Provide potable water and safe collection points to displaced residents.",needs:["T7"],alternatives:["Water-truck delivery"],time:"40 min"},
{id:"T7",name:"Open temporary shelters",short:"Shelter activation",cost:1100,people:670,location:"L2",type:"OR",desc:"Inspect, staff and stock a safe shelter before people arrive.",alternatives:["North Shelter","South School"],time:"25 min"}
];
const graphNodes=[
{id:"ROOT",name:"Flood response",sub:"AND · all required groups",type:"and",x:500,y:24,w:220,h:48,desc:"The overall response requires assessment plus evacuation, medical response, and essential supplies."},
{id:"T1",name:"Assess zones",sub:"OR · drone or ground",type:"or",x:500,y:112,w:174,h:48,desc:"Choose one feasible assessment method before response operations proceed."},
{id:"G_EVAC",name:"Evacuation operations",sub:"AND · both areas",type:"and",x:190,y:210,w:190,h:48,desc:"Both Lowland Village and Market District evacuation are required in this scenario."},
{id:"G_MED",name:"Medical response",sub:"AND · support + transfer",type:"and",x:500,y:210,w:190,h:48,desc:"The response requires medical support and transportation of critical patients."},
{id:"G_SUP",name:"Essential supplies",sub:"AND · shelters + water",type:"and",x:810,y:210,w:190,h:48,desc:"Shelter activation and clean-water distribution are both required."},
{id:"T2",name:"Village evacuation",sub:"OR · boat or bus",type:"or",x:115,y:330,w:170,h:48},
{id:"T3",name:"District evacuation",sub:"OR · bus or foot teams",type:"or",x:300,y:330,w:170,h:48},
{id:"T4",name:"Medical support",sub:"OR · available method",type:"or",x:405,y:330,w:170,h:48},
{id:"T5",name:"Patient transport",sub:"OR · ambulance or boat",type:"or",x:595,y:330,w:180,h:48},
{id:"T7",name:"Open shelters",sub:"OR · North or South",type:"or",x:720,y:330,w:170,h:48},
{id:"T6",name:"Clean water",sub:"OR · delivery method",type:"or",x:885,y:425,w:150,h:48}
];
let selected="ROOT",currentPlan=null;
const $=id=>document.getElementById(id);
const money=n=>"₹"+Number(n).toLocaleString("en-IN");
function renderGraph(){
 const svg=$("graph");let html=`<defs><marker id="arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7 z" fill="#3b526c"/></marker></defs>`;
 html+=`<text x="18" y="18" class="graph-label">ROOT AND COMPOSITE AND NODES</text><text x="18" y="500" class="graph-label">TASK NODES WITH OR ALTERNATIVES</text>`;
 const link=(a,b)=>`<path class="edge" marker-end="url(#arrow)" d="M${a.x} ${a.y+a.h} C${a.x} ${(a.y+a.h+b.y)/2}, ${b.x} ${(a.y+a.h+b.y)/2}, ${b.x} ${b.y}"/>`;
 const byId=id=>graphNodes.find(n=>n.id===id);
 const pairs=[["ROOT","T1"],["ROOT","G_EVAC"],["ROOT","G_MED"],["ROOT","G_SUP"],["G_EVAC","T2"],["G_EVAC","T3"],["G_MED","T4"],["G_MED","T5"],["G_SUP","T7"],["G_SUP","T6"],["T1","T2"],["T1","T3"],["T1","T4"],["T4","T5"],["T1","T7"],["T7","T6"]];
 pairs.forEach(([a,b])=>{const n1=byId(a),n2=byId(b);if(n1&&n2)html+=link(n1,n2)});
 graphNodes.forEach(n=>{html+=`<g class="node ${n.type} ${selected===n.id?"selected":""}" data-id="${n.id}" tabindex="0" role="button" aria-label="Inspect ${n.name}"><rect x="${n.x-n.w/2}" y="${n.y}" width="${n.w}" height="${n.h}"/><text class="n-title" x="${n.x}" y="${n.y+19}" text-anchor="middle">${n.name}</text><text class="n-sub" x="${n.x}" y="${n.y+34}" text-anchor="middle">${n.sub}</text></g>`});
 svg.innerHTML=html;svg.setAttribute("viewBox","0 0 1000 510");svg.querySelectorAll(".node").forEach(el=>{el.addEventListener("click",()=>inspect(el.dataset.id));el.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();inspect(el.dataset.id)}})});
}
function Tpos(id){return graphNodes.find(n=>n.id===id)}
function inspect(id){selected=id;renderGraph();const n=graphNodes.find(x=>x.id===id);const t=tasks.find(x=>x.id===id);$("detailTitle").textContent=n?.name||t?.name||id;$("nodeType").textContent=t?t.type:(n?.type||"NODE").toUpperCase();$("detailDescription").textContent=t?t.desc:(n?.desc||"This composite node groups required tasks. Its AND relationship means all connected child task groups are required.");let body="";
 if(t){body+=row("Estimated direct cost",money(t.cost));body+=row("Estimated people reached",t.people.toLocaleString());body+=row("Location",locations.find(l=>l.id===t.location)?.name||t.location);body+=row("Expected duration",t.time||"Varies");body+=`<div class="section-kicker" style="margin-top:18px">RESPONSE OPTIONS</div><div class="child-list">`;
 (t.alternatives||[]).forEach((a,i)=>body+=`<button class="child-item" data-alt="${i}"><span><strong>${a}</strong><small>${i===0?"Primary option":"Alternative option"}</small></span><span>↗</span></button>`);
 body+="</div>";if(t.needs?.length)body+=`<div class="detail-row"><span>Prerequisites</span><strong>${t.needs.join(", ")}</strong></div>`;
 }else{body+=row("Node logic",(n?.type||"and").toUpperCase());body+=row("Planning model","AND/OR graph");body+=row("Task groups",tasks.length);body+=row("Cost evaluation","AND sums / OR minimum");const childMap={ROOT:["T1","G_EVAC","G_MED","G_SUP"],G_EVAC:["T2","T3"],G_MED:["T4","T5"],G_SUP:["T7","T6"]};const childIds=childMap[id]||[];if(childIds.length)body+=`<div class="section-kicker" style="margin-top:18px">REQUIRED CHILD NODES</div><div class="child-list">${childIds.map(cid=>{const cn=graphNodes.find(z=>z.id===cid);const ct=tasks.find(z=>z.id===cid);return `<button class="child-item" data-node="${cid}"><span><strong>${cn?.name||ct?.name||cid}</strong><small>${(cn?.type||ct?.type||"node").toUpperCase()} node</small></span><span>↗</span></button>`}).join("")}</div>`}
 $("detailBody").innerHTML=body;$("detailBody").querySelectorAll("[data-node]").forEach(b=>b.onclick=()=>inspect(b.dataset.node));$("detailBody").querySelectorAll("[data-alt]").forEach(b=>b.onclick=()=>{const i=+b.dataset.alt;alert("Selected option: "+t.alternatives[i]+". Route feasibility should be verified by the incident commander before deployment.")});
}
function row(a,b){return `<div class="detail-row"><span>${a}</span><strong>${b}</strong></div>`}
function renderLocations(){$("locationsList").innerHTML=locations.map(l=>`<div class="location-card"><div class="location-icon">${l.icon}</div><div><strong>${l.name}</strong><small>${l.id} · ${l.type} · ${l.people}</small></div></div>`).join("");}
function renderCatalog(){$("taskCatalog").innerHTML=tasks.map(t=>`<div class="catalog-card"><div class="catalog-num">${t.id}</div><div><strong>${t.name}</strong><small>${t.type} node · ${money(t.cost)} · ${t.people} estimated beneficiaries</small></div></div>`).join("");}
async function generatePlan(){
 const budget=Math.max(0,Number($("budget").value)||0),priority=$("priority").value;
 $("planSubtitle").textContent="Calculating candidate plan with the FastAPI backend…";
 try{
  const response=await fetch(`/api/plan?budget=${encodeURIComponent(budget)}&priority=${encodeURIComponent(priority)}`);
  if(!response.ok)throw new Error("API returned "+response.status);
  const plan=await response.json();currentPlan={rows:plan.tasks,total:plan.total_cost,people:plan.people,budget:plan.budget,feasible:plan.feasible,all:plan.all_tasks_covered};
  $("costMetric").textContent=money(plan.total_cost);$("budgetMetric").textContent=`Budget ceiling: ${money(budget)} · ${plan.total_cost<=budget?"within limit":"over budget"}`;
  $("peopleMetric").textContent=plan.people.toLocaleString();$("tasksMetric").textContent=`${plan.selected_count} / ${plan.total_task_groups}`;
  $("statusMetric").textContent=plan.status;$("statusMetric").style.color=plan.feasible?"var(--green)":"var(--red)";
  $("statusDetail").textContent=plan.all_tasks_covered?"All task groups covered":`${plan.deferred_task_ids.length} task group(s) deferred`;
  $("planSubtitle").textContent=plan.note;
  if(!plan.tasks.length){$("planContent").innerHTML='<div class="empty-state">No tasks selected under this budget. Increase the budget and try again.</div>';return}
  $("planContent").innerHTML=`<div class="plan-table-wrap"><table><thead><tr><th>TASK / OPERATION</th><th>LOCATION</th><th>NODE</th><th>EST. BENEFICIARIES</th><th>SELECTED COST</th></tr></thead><tbody>${plan.tasks.map(t=>`<tr><td class="task-name">${t.name}<small>Chosen: ${t.option}<br>${t.option_reason||""}</small></td><td>${t.location_name}</td><td><span class="pill alt">OR · choose one</span></td><td>${t.people.toLocaleString()}</td><td>${money(t.cost)}</td></tr>`).join("")}</tbody></table><div class="plan-total"><span>${plan.selected_count} / ${plan.total_task_groups} required task groups</span><span>Estimated total <strong>${money(plan.total_cost)}</strong></span></div><div style="padding:14px 12px;border-top:1px solid var(--line)"><div class="section-kicker">AO* COST-BACKUP TRACE</div><p style="font-size:12px;color:var(--muted);margin:6px 0 10px">Each OR node compares its available operational alternatives. The root AND node combines all required task groups.</p>${(plan.search_trace||[]).map(step=>`<div class="detail-row"><span><strong>${step.node}</strong> · ${step.operation}</span><strong>${step.chosen?`${step.chosen} · ${money(step.backed_up_cost)}`:step.combined_cost!==undefined?money(step.combined_cost):step.result||"evaluated"}</strong></div>${step.candidate_costs?step.candidate_costs.map(o=>`<div class="detail-row" style="padding-left:16px"><span>${o.option}${o.feasible?"":" · infeasible"}</span><strong>${money(o.cost)}</strong></div>`).join(""):""}`).join("")}</div>${!plan.feasible?`<p style="color:var(--amber);font-size:12px;padding:0 12px">${plan.note}</p>`:""}</div>`;
 }catch(err){$("planSubtitle").textContent="Could not connect to FastAPI. Start the server with: uvicorn app:app --reload";$("statusMetric").textContent="API ERROR";$("statusMetric").style.color="var(--red)";console.error(err)}
}
function exportCSV(){const budget=Math.max(0,Number($("budget").value)||0),priority=$("priority").value;window.location.href=`/api/plan.csv?budget=${encodeURIComponent(budget)}&priority=${encodeURIComponent(priority)}`}
$("planBtn").addEventListener("click",generatePlan);$("resetBtn").addEventListener("click",()=>{$("budget").value=18000;$("priority").value="balanced";currentPlan=null;$("costMetric").textContent="—";$("budgetMetric").textContent="Set budget and generate plan";$("peopleMetric").textContent="—";$("tasksMetric").textContent="—";$("statusMetric").textContent="NOT RUN";$("statusMetric").style.color="var(--amber)";$("statusDetail").textContent="Generate a plan to evaluate feasibility";$("planSubtitle").textContent="Generate a plan to see the selected operations and their costs.";$("planContent").innerHTML='<div class="empty-state"><div class="empty-icon">⌁</div><strong>No plan generated yet</strong><p>Choose a budget and select <b>Generate plan</b> to calculate a feasible response.</p></div>'});$("exportBtn").addEventListener("click",exportCSV);$("showAllBtn").addEventListener("click",()=>{inspect("ROOT");$("graph").scrollIntoView({behavior:"smooth",block:"center"})});
renderGraph();renderLocations();renderCatalog();inspect("ROOT");

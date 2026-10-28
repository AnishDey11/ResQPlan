"""AO*-style AND/OR planner for the ResQPlan classroom scenario.

The overall response goal is an AND node: every required task group must be
completed. Each task's operational methods are OR alternatives. We perform
bottom-up cost backup on this acyclic AND/OR graph, choosing the least-cost
feasible alternative at each OR node, then test the complete plan against the
budget. This is exact for this finite acyclic model; it is not live dispatch.
"""
from copy import deepcopy
from data import LOCATIONS, TASKS

# Operational alternatives are explicit edges below OR task nodes. Costs are
# illustrative total direct costs for each alternative, not live quotations.
OPTIONS = {
    "T1": [
        {"name": "Drone survey", "cost": 900, "feasible": True, "reason": "Fast aerial assessment"},
        {"name": "Ground assessment", "cost": 650, "feasible": True, "reason": "Lower-cost team survey"},
    ],
    "T2": [
        {"name": "Boat evacuation via West Landing", "cost": 4500, "feasible": True, "reason": "Suitable when flooded roads prevent vehicle access"},
        {"name": "High-ground bus route via East Bridge", "cost": 3200, "feasible": True, "reason": "Lower-cost road option; bridge status must be verified"},
    ],
    "T3": [
        {"name": "Bus convoy to South School", "cost": 2600, "feasible": True, "reason": "Vehicle-based evacuation"},
        {"name": "Foot teams to North Shelter", "cost": 1900, "feasible": True, "reason": "Lower-cost option for people able to walk safely"},
    ],
    "T4": [
        {"name": "Riverside Clinic team", "cost": 1800, "feasible": True, "reason": "Required medical setup"},
    ],
    "T5": [
        {"name": "Ambulance convoy", "cost": 2200, "feasible": True, "reason": "Road-based patient transfer"},
        {"name": "Boat medical transfer", "cost": 1800, "feasible": True, "reason": "Alternative when waterways are accessible"},
    ],
    "T6": [
        {"name": "Water-truck delivery", "cost": 1500, "feasible": True, "reason": "Required potable-water distribution"},
    ],
    "T7": [
        {"name": "North Shelter", "cost": 1100, "feasible": True, "reason": "420-person stated capacity"},
        {"name": "South School", "cost": 900, "feasible": True, "reason": "250-person stated capacity; confirm actual occupancy"},
    ],
}

ROOT_REQUIREMENTS = [t["id"] for t in TASKS]

def _select_option(task, priority):
    """Back up OR-node values and select a feasible child.

    The current scenario has no validated numerical life-saving probabilities,
    so the objective is transparent least direct cost. Priority is retained for
    API compatibility and reported, but never fabricates a lives-saved score.
    """
    options = [o for o in OPTIONS[task["id"]] if o["feasible"]]
    if not options:
        return None
    return min(options, key=lambda o: (o["cost"], o["name"]))

def generate_plan(budget: int = 18000, priority: str = "balanced") -> dict:
    locations = {loc["id"]: loc for loc in LOCATIONS}
    tasks_by_id = {task["id"]: task for task in TASKS}
    selected = {}
    trace = []

    # Validate dependency graph and ensure prerequisites can be completed.
    visiting, visited = set(), set()
    def check_cycle(tid):
        if tid in visiting:
            raise ValueError(f"Dependency cycle detected at {tid}")
        if tid in visited:
            return
        visiting.add(tid)
        for dep in tasks_by_id[tid].get("depends_on", []):
            if dep not in tasks_by_id:
                raise ValueError(f"Unknown prerequisite {dep} for {tid}")
            check_cycle(dep)
        visiting.remove(tid)
        visited.add(tid)
    for tid in tasks_by_id:
        check_cycle(tid)

    # AO* cost backup: root is AND (all response objectives), each task is an
    # OR node (choose one operational method). Prerequisite links impose order.
    for task in TASKS:
        option = _select_option(task, priority)
        if option is None:
            trace.append({"node": task["id"], "operation": "OR backup", "result": "no feasible alternative"})
            continue
        selected[task["id"]] = option
        trace.append({
            "node": task["id"], "operation": "OR backup",
            "alternatives_checked": len(OPTIONS[task["id"]]),
            "candidate_costs": [{"option": o["name"], "cost": o["cost"], "feasible": o["feasible"]} for o in OPTIONS[task["id"]]],
            "chosen": option["name"], "backed_up_cost": option["cost"]
        })

    missing = [tid for tid in ROOT_REQUIREMENTS if tid not in selected]
    # Prerequisites are mandatory AND dependencies: both the dependent task and
    # every prerequisite must be present in the selected solution graph.
    for tid in list(selected):
        deps = tasks_by_id[tid].get("depends_on", [])
        for dep in deps:
            if dep not in selected and dep not in missing:
                missing.append(dep)
    tasks_result = []
    for task in TASKS:
        option = selected.get(task["id"])
        if option is None:
            continue
        item = deepcopy(task)
        item["option"] = option["name"]
        item["cost"] = option["cost"]
        item["option_reason"] = option["reason"]
        item["alternatives_evaluated"] = len(OPTIONS[task["id"]])
        item["location_name"] = locations[task["location"]]["name"]
        item["alternatives"] = [{"name": o["name"], "cost": o["cost"], "feasible": o["feasible"]} for o in OPTIONS[task["id"]]]
        tasks_result.append(item)

    total_cost = sum(task["cost"] for task in tasks_result)
    people = sum(task["people"] for task in tasks_result)
    all_covered = len(tasks_result) == len(TASKS) and not missing
    within_budget = total_cost <= budget
    feasible = all_covered and within_budget
    trace.append({"node": "ROOT", "operation": "AND backup", "required_children": ROOT_REQUIREMENTS,
                  "selected_children": [t["id"] for t in tasks_result], "combined_cost": total_cost,
                  "budget": budget, "result": "complete and within budget" if feasible else ("budget exceeded" if all_covered else "required child unavailable")})

    if not all_covered:
        status = "NO COMPLETE PLAN"
        note = "At least one required task has no feasible operational alternative. Review the scenario data."
    elif not within_budget:
        status = "BUDGET INSUFFICIENT"
        note = f"The least-cost complete plan costs ₹{total_cost:,}, exceeding the ₹{budget:,} budget by ₹{total_cost-budget:,}. No tasks were silently dropped; increase the budget or revise validated scenario assumptions."
    else:
        status = "FEASIBLE — OPTIMIZED"
        note = "AO*-style cost backup selected the least-cost feasible alternative at each OR node, combined all required tasks at the root AND node, and checked the complete plan against the budget. Costs and route feasibility are illustrative and must be verified."

    return {
        "budget": budget, "priority": priority, "objective": "lowest-cost complete feasible response",
        "algorithm": "AO*-style AND/OR cost backup on a finite acyclic graph",
        "tasks": tasks_result, "total_cost": total_cost, "people": people,
        "selected_count": len(tasks_result), "total_task_groups": len(TASKS),
        "all_tasks_covered": all_covered, "feasible": feasible, "status": status,
        "deferred_task_ids": [], "budget_shortfall": max(0, total_cost-budget),
        "search_trace": trace, "note": note,
        "limitations": ["Illustrative estimates, not live quotations", "No real-time road, water, weather, staffing, or occupancy feed", "Beneficiary counts may overlap and must not be interpreted as unique people served"]
    }

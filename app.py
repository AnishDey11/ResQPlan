
from __future__ import annotations
import csv, io
from typing import Any
from fastapi import FastAPI, Query
from fastapi.responses import HTMLResponse, StreamingResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from starlette.requests import Request
from data import LOCATIONS, TASKS
from planner import generate_plan

app = FastAPI(title="ResQPlan API", description="Flood emergency response planning with an AND/OR task model.", version="1.0.0")
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

@app.get("/", response_class=HTMLResponse, include_in_schema=False)
def home(request: Request):
    return templates.TemplateResponse(request=request, name="index.html", context={})

@app.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "ResQPlan"}

@app.get("/api/data")
def get_data() -> dict[str, Any]:
    return {"locations": LOCATIONS, "tasks": TASKS}

@app.get("/api/plan")
def create_plan(budget: int = Query(default=18000, ge=0, le=10000000),
                priority: str = Query(default="balanced", pattern="^(balanced|lives|cost)$")):
    return generate_plan(budget=budget, priority=priority)

@app.get("/api/plan.csv", include_in_schema=False)
def export_plan_csv(budget: int = Query(default=18000, ge=0, le=10000000),
                    priority: str = Query(default="balanced", pattern="^(balanced|lives|cost)$")):
    plan = generate_plan(budget=budget, priority=priority)
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["Task ID","Task","Selected option","Location","Logic","Estimated beneficiaries","Estimated cost"])
    for task in plan["tasks"]:
        writer.writerow([task["id"],task["name"],task["option"],task["location_name"],task["type"],task["people"],task["cost"]])
    writer.writerow(["","","","","TOTAL",plan["people"],plan["total_cost"]])
    output.seek(0)
    return StreamingResponse(iter([output.getvalue()]), media_type="text/csv",
        headers={"Content-Disposition": 'attachment; filename="resqplan-response-plan.csv"'})

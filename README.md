# ResQPlan — FastAPI Emergency Disaster Response Planner

## Run on Windows
1. Install Python 3.10 or newer and extract this folder.
2. Open a terminal in this folder.
3. Run:

```bash
python -m venv .venv
.venv\\Scripts\\activate
python -m pip install -r requirements.txt
uvicorn app:app --reload
```

4. Open http://127.0.0.1:8000

## API
- `GET /api/health` — health check
- `GET /api/data` — locations and task catalogue
- `GET /api/plan?budget=18000&priority=cost` — optimized complete plan with cost-backup trace
- `GET /api/plan.csv?budget=18000&priority=balanced` — CSV export
- `GET /docs` — interactive Swagger documentation

The graph visualization distinguishes AND nodes from OR task nodes. The root AND node requires the assessment plus three composite groups: evacuation operations (both evacuation tasks), medical response (medical support and patient transport), and essential supplies (shelter activation and water distribution). Individual task nodes are OR nodes when they offer alternative methods. Dependency edges show prerequisites such as assessment before evacuation and shelter activation before water distribution. The planner selects the least-cost feasible alternative at each OR task, combines required tasks at the root AND node, and reports a budget shortfall without silently dropping required tasks. Costs are illustrative.

## Structure
- `app.py`: FastAPI routes and HTML serving
- `planner.py`: AND/OR cost backup, alternative comparison, dependency validation, and full-plan budget feasibility
- `data.py`: illustrative locations and tasks
- `templates/index.html`: UI
- `static/styles.css`, `static/app.js`: frontend

## Important
This is a classroom prototype with illustrative costs and beneficiary estimates. It does not optimize live road/boat paths, travel times, resource schedules, uncertainty, or live flood conditions. Do not use for actual emergency dispatch.

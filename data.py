
LOCATIONS = [
 {"id":"L1","name":"Control Centre","type":"Command","people":"—","icon":"⌘"},
 {"id":"L2","name":"North Shelter","type":"Shelter","people":"420 capacity","icon":"⌂"},
 {"id":"L3","name":"Riverside Clinic","type":"Medical","people":"60 beds","icon":"✚"},
 {"id":"L4","name":"Central Depot","type":"Supply depot","people":"Boats & kits","icon":"▣"},
 {"id":"L5","name":"East Bridge","type":"Route / crossing","people":"Partially blocked","icon":"⌁"},
 {"id":"L6","name":"Lowland Village","type":"Affected area","people":"310 people","icon":"⌂"},
 {"id":"L7","name":"Market District","type":"Affected area","people":"180 people","icon":"⌂"},
 {"id":"L8","name":"South School","type":"Shelter","people":"250 capacity","icon":"⌂"},
 {"id":"L9","name":"West Landing","type":"Boat access","people":"Boat launch","icon":"≈"},
 {"id":"L10","name":"Water Plant","type":"Utility","people":"Water treatment","icon":"◉"},
]
TASKS = [
 {"id":"T1","name":"Assess affected zones","short":"Area assessment","cost":900,"people":0,"location":"L1","type":"OR","desc":"Establish verified impact, hazards and route conditions before dispatch.","alternatives":["Drone survey","Ground assessment"],"time":"20 min","depends_on":[]},
 {"id":"T2","name":"Evacuate Lowland Village","short":"Village evacuation","cost":4200,"people":310,"location":"L6","type":"OR","desc":"Move residents from the flooded lowland to a verified safe shelter.","alternatives":["Boat evacuation via West Landing","High-ground bus route via East Bridge"],"time":"60–90 min","depends_on":["T1"]},
 {"id":"T3","name":"Evacuate Market District","short":"District evacuation","cost":2600,"people":180,"location":"L7","type":"OR","desc":"Evacuate residents and visitors from the market district.","alternatives":["Bus convoy to South School","Foot teams to North Shelter"],"time":"45 min","depends_on":["T1"]},
 {"id":"T4","name":"Set up medical support","short":"Medical support","cost":1800,"people":70,"location":"L3","type":"OR","desc":"Deploy triage staff, first-aid kits and a patient transfer point.","alternatives":["Riverside Clinic team"],"time":"30 min","depends_on":["T1"]},
 {"id":"T5","name":"Transport critical patients","short":"Patient transport","cost":2200,"people":24,"location":"L4","type":"OR","desc":"Transport urgent patients to a verified treatment point.","alternatives":["Ambulance convoy","Boat medical transfer"],"time":"30–50 min","depends_on":["T4"]},
 {"id":"T6","name":"Distribute clean water","short":"Water distribution","cost":1500,"people":500,"location":"L10","type":"OR","desc":"Provide potable water and safe collection points to displaced residents.","alternatives":["Water-truck delivery"],"time":"40 min","depends_on":["T1","T7"]},
 {"id":"T7","name":"Open temporary shelters","short":"Shelter activation","cost":1100,"people":670,"location":"L2","type":"OR","desc":"Inspect, staff and stock a safe shelter before people arrive.","alternatives":["North Shelter","South School"],"time":"25 min","depends_on":["T1"]},
]

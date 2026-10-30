import json

with open('tour_data_extracted.json', encoding='utf-8') as f:
    data = json.load(f)

print("=== SCHOOL OF ENGINEERING & AI NODES ===")
soe_nodes = [v for v in data.values() if any('SchoolofEngineering' in t for t in v['tags']) or 'Engineering' in v['title'] or 'AI' in v['title']]
for n in soe_nodes:
    hs = [h['title'] for h in n['hotspots']]
    print(f"[{n['id']}] {n['title']} (tags: {n['tags']})")
    print(f"    Hotspots: {hs}")

print("\n=== EATERIES, CANTEEN & CAFETERIA ===")
eatery_nodes = [v for v in data.values() if any('MessEateries' in t for t in v['tags']) or any(w in v['title'].lower() for w in ['canteen', 'cafeteria', 'food', 'mess', 'kitchen'])]
for n in eatery_nodes:
    hs = [h['title'] for h in n['hotspots']]
    print(f"[{n['id']}] {n['title']} (tags: {n['tags']})")
    print(f"    Hotspots: {hs}")

print("\n=== PARKING & ENTRANCE ===")
parking_nodes = [v for v in data.values() if any('Entrance' in t for t in v['tags']) or any(w in v['title'].lower() for w in ['parking', 'gate', 'entrance', 'driveway', '4 wheeler', 'wheeler'])]
for n in parking_nodes:
    hs = [h['title'] for h in n['hotspots']]
    print(f"[{n['id']}] {n['title']} (tags: {n['tags']})")
    print(f"    Hotspots: {hs}")

print("\n=== CDSIMER & MEDICAL ===")
cdsimer_nodes = [v for v in data.values() if any('CDSIMER' in t for t in v['tags']) or 'CDSIMER' in v['title']]
for n in cdsimer_nodes:
    hs = [h['title'] for h in n['hotspots']]
    print(f"[{n['id']}] {n['title']} (tags: {n['tags']})")
    print(f"    Hotspots: {hs}")

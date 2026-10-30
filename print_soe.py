import json

with open('tour_data_extracted.json', encoding='utf-8') as f:
    data = json.load(f)

soe_nodes = [v for v in data.values() if any('SchoolofEngineering' in t for t in v['tags']) or 'Engineering' in v['title']]
print(f"=== DETAILED SCHOOL OF ENGINEERING NODES ({len(soe_nodes)}) ===")
for n in sorted(soe_nodes, key=lambda x: x['title']):
    hs = [h['title'] for h in n['hotspots'] if h['title']]
    print(f"[{n['id']}] {n['title']}")
    print(f"    Tags: {', '.join(n['tags'])}")
    print(f"    Hotspots: {hs}")

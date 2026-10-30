import json

with open('tour_data_extracted.json', encoding='utf-8') as f:
    data = json.load(f)

targets = [
    # Canteens & Eateries
    'node243', 'node131', 'node130', 'node295', 'node306', 'node193',
    # Parking & Entrance
    'node258', 'node178', 'node287', 'node179',
    # SOE key nodes
    'node180', 'node41', 'node39', 'node23', 'node194', 'node19', 'node13', 'node20',
    'node33', 'node30', 'node27', 'node28', 'node22',
    # CDSIMER key nodes
    'node305', 'node149', 'node105', 'node99', 'node142', 'node132'
]

print("=== TARGET NODE DETAILS ===")
for tid in targets:
    if tid in data:
        n = data[tid]
        print(f"[{n['id']}] {n['title']}")
        print(f"   Tags: {n['tags']}")
        print(f"   Preview: {n['preview']}")
        print(f"   Hotspots: {[h['title'] for h in n['hotspots'] if h['title']]}")

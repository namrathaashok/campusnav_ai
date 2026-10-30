import xml.etree.ElementTree as ET
import json

tree = ET.parse('dsu_pano.xml')
root = tree.getroot()

panoramas = root.findall('.//panorama')

tour_data = {}

for p in panoramas:
    nid = p.get('id', '')
    userdata = p.find('userdata')
    title = userdata.get('title', '') if userdata is not None else ''
    desc = userdata.get('description', '') if userdata is not None else ''
    tags = userdata.get('tags', '') if userdata is not None else ''
    source = userdata.get('source', '') if userdata is not None else ''
    author = userdata.get('author', '') if userdata is not None else ''
    
    # Extract preview/tile image info
    input_elem = p.find('input')
    prev_url = ''
    if input_elem is not None:
        prev_elem = p.find('preview')
        if prev_elem is not None:
            prev_url = prev_elem.get('url', '')
    
    # Extract hotspots
    hotspots = []
    hotspots_elem = p.find('hotspots')
    if hotspots_elem is not None:
        for hs in hotspots_elem.findall('hotspot'):
            hs_title = hs.get('title', '')
            hs_target = hs.get('target', '')
            hs_url = hs.get('url', '')
            hs_pan = hs.get('pan', '')
            hs_tilt = hs.get('tilt', '')
            hotspots.append({
                'title': hs_title,
                'target': hs_target,
                'url': hs_url,
                'pan': hs_pan,
                'tilt': hs_tilt
            })
            
    tour_data[nid] = {
        'id': nid,
        'title': title,
        'description': desc,
        'tags': [t.strip() for t in tags.split(',') if t.strip()],
        'preview': prev_url,
        'hotspots': hotspots
    }

print(f"Total processed nodes: {len(tour_data)}")

# Group by major clusters / tags
clusters = {}
for nid, data in tour_data.items():
    tag_str = "|".join(data['tags'])
    if 'SchoolofEngineering' in tag_str or 'Engineering' in data['title']:
        cluster = 'School of Engineering'
    elif 'CDSIMER' in tag_str or 'Hospital' in tag_str or 'Medical' in data['title']:
        cluster = 'CDSIMER & Hospital'
    elif 'SchoolOfHealthSciences' in tag_str or 'HealthSciences' in tag_str:
        cluster = 'School of Health Sciences'
    elif 'MessEateries' in tag_str or 'Canteen' in data['title'] or 'Cafeteria' in data['title'] or 'Food' in data['title']:
        cluster = 'Eateries & Canteen'
    elif 'Entrance' in tag_str or 'Parking' in data['title'] or 'Gate' in data['title']:
        cluster = 'Entrance & Parking'
    elif 'Sports' in tag_str:
        cluster = 'Sports & Recreation'
    elif 'SResidences' in tag_str or 'Hostel' in data['title']:
        cluster = 'Student Residences'
    elif 'BirdEyeView' in tag_str or 'AerialView' in tag_str:
        cluster = 'Aerial & Campus Overview'
    else:
        cluster = 'Other'
    
    clusters.setdefault(cluster, []).append(data)

print("\n--- CLUSTERS SUMMARY ---")
for cname, items in sorted(clusters.items()):
    print(f"\n=== {cname} ({len(items)} nodes) ===")
    for item in items:
        hs_summary = ", ".join([h['title'] or h['url'] for h in item['hotspots'][:4]])
        print(f"  [{item['id']}] {item['title']} (tags: {','.join(item['tags'][:2])}) -> Links to: [{hs_summary}]")
        if item['description']:
            print(f"       Desc: {item['description'][:100]}")

with open('tour_data_extracted.json', 'w', encoding='utf-8') as f:
    json.dump(tour_data, f, indent=2)
print("\nFull tour data saved to tour_data_extracted.json")

import xml.etree.ElementTree as ET
import collections

tree = ET.parse('dsu_pano.xml')
root = tree.getroot()

panoramas = root.findall('.//panorama')
print(f'Total panoramas / tour nodes: {len(panoramas)}')

categories = collections.defaultdict(list)
all_nodes = []

for p in panoramas:
    nid = p.get('id', '')
    userdata = p.find('userdata')
    title = userdata.get('title', '') if userdata is not None else ''
    desc = userdata.get('description', '') if userdata is not None else ''
    tags = userdata.get('tags', '') if userdata is not None else ''
    all_nodes.append({'id': nid, 'title': title, 'description': desc, 'tags': tags})
    for t in tags.split(','):
        t = t.strip()
        if t:
            categories[t].append((nid, title))

print('\nDistinct Tags / Categories:')
for cat, items in sorted(categories.items()):
    print(f'  {cat} ({len(items)} scenes)')

print('\n--- Search for AI, Engineering, School of Engineering, Canteen, Parking ---')
keywords = ['artificial intelligence', 'ai', 'engineering', 'school of engineering', 'canteen', 'cafeteria', 'food', 'parking', 'lab', 'floor', 'faculty']
for kw in keywords:
    matches = [n for n in all_nodes if kw in n['title'].lower() or kw in n['description'].lower() or kw in n['tags'].lower()]
    print(f"\nKeyword '{kw}': {len(matches)} matches")
    for m in matches[:10]:
        print(f"   [{m['id']}] {m['title']} | Tags: {m['tags']}")

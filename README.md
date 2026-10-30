# CampusNav AI — Dayananda Sagar University (DSU) Harohalli Campus

[![Virtual Tour Active](https://img.shields.io/badge/360%C2%B0%20Virtual%20Tour-Integrated-06b6d4.svg)](#)
[![Zero Dependencies](https://img.shields.io/badge/Dependencies-Zero%20(Pure%20Vanilla)-10b981.svg)](#)
[![Stack](https://img.shields.io/badge/Stack-HTML5%20%7C%20CSS3%20%7C%20ES6%20JS%20%7C%20SVG-6366f1.svg)](#)
[![Accessibility](https://img.shields.io/badge/Accessibility-Wheelchair%20Ramp%20Aware-a855f7.svg)](#)

> **“Your Campus. One Smart Direction.”**  
> An interactive, AI-powered spatial navigation and floor discovery engine built specifically for **Dayananda Sagar University (DSU), Harohalli Campus** (Kanakapura Road, Bengaluru). Derived directly from the university's official [360° Virtual Tour](https://www.dsu.edu.in/virtual-tour/).

---

## 🌟 What is CampusNav AI?

**CampusNav AI** provides real-time spatial intelligence, floor-by-floor exploration, photographic virtual tour previews, and Dijkstra shortest-path navigation for students, faculty, and campus visitors.

### Key Highlights
1. **Official 360° Virtual Tour Telemetry**:
   - Maps 310+ panorama nodes from `https://www.dsu.edu.in/virtual-tour/`.
   - Displays real 360° panoramic preview photos for laboratories, lobbies, and dining halls.
   - Includes **"Open in Tour ↗"** links connecting directly to specific panorama nodes.
2. **Floor-by-Floor Layer Switcher**:
   - Interactive toolbar toggles between **Campus Overview**, **L0: Ground Foyer & Library**, **L1: AI, Computing & IoT Labs**, **L2: ECE & VLSI**, and **L3: Placement & Aerospace**.
3. **Specific Architectural Mapping**:
   - **School of Engineering (SOE)**: Central sky-lit Atrium & Reception (Node 41), Central Library (Node 17), Classrooms 101–112 (Node 39), Carver Mead VLSI Lab (Node 33), Joseph Fourier DSP Lab (Node 30), Corporate Placement Wing (Node 22), and Dr. V M Ghatage Aerospace Lab (Node 28).
   - **Computing & AI Wing (B-Block)**: Dennis M. Ritchie AI & Computing Lab (Node 19), John Von Neumann IoT & Digital Lab (Node 13), Gordon Moore Microcontroller Lab (Node 20).
   - **CDSIMER Medical Complex**: Dr. Chandramma Medical College, clinical departments, hospital wards, and emergency reception (Node 305).
   - **Resolved Dining & Eateries**:
     - **CDSIMER Cafeteria (Indoor)** (Node 131): Ground Floor inside the CDSIMER building with hot meals and seating.
     - **Campus Food Truck** (Node 193): Outdoor quick-service cafe on the promenade facing the Central Quadrangle Lawn.
     - **Hospital Staff Canteen** (Node 243): 24/7 express cafeteria in the hospital wing.
   - **Parking Zones**:
     - **4-Wheeler Main Parking** (Node 178): 150+ bays right beside the SOE Main Entrance Gate.
     - **2-Wheeler Student Parking**: Western perimeter surface lot.
4. **Graph-Based Shortest Path Engine (Dijkstra's Algorithm)**:
   - Calculates true walking distance in meters and walking time estimates.
   - Supports accessibility routing (avoids stairs and guides via smooth paved ramps and elevators).
5. **Conversational Campus AI Guide**:
   - Natural language assistant answering questions about floor locations, specific labs, faculty/recruiter interview wings, food courts, and parking.

---

## 🚀 How to Run the Project

No build step, no npm packages, and no node_modules required!

### Method 1: Instant Direct Launch
Double-click on `index.html` in file explorer:
```
c:\Users\ammog\.gemini\antigravity-ide\scratch\Frontend_campus\index.html
```

### Method 2: Python HTTP Server (Recommended)
```bash
cd Frontend_campus
python -m http.server 8000
```
Then visit **`http://localhost:8000`** in your browser.

---

## 📍 Campus Locations & Virtual Tour Node Mapping

| Icon | Location Name | Floor Level | Room / Wing | Virtual Tour Node |
| :---: | :--- | :---: | :--- | :---: |
| 🚪 | **SOE Main Entrance Gate** | Campus | Campus Gate 1 | `node180` |
| 🚗 | **4-Wheeler Main Parking** | Campus | P-4W Tarmac Bays | `node178` |
| 🛵 | **2-Wheeler Student Parking** | Campus | P-2W West Lot | — |
| 🌿 | **Central Quadrangle Lawn** | Campus | Central Quad | — |
| 🚚 | **Campus Food Truck** | Campus | Promenade Deck | `node193` |
| ⚙️ | **Mechanical Engineering Complex** | Campus | Blocks M1–M3 | `node194` |
| 🏛️ | **SOE Central Atrium & Reception** | Level 0 | Ground Foyer | `node41` |
| 📚 | **Central Library & Digital Centre** | Level 0 | East Wing L0 | `node17` |
| 🤖 | **Dennis M. Ritchie AI Lab** | Level 1 | Room 104 (L1) | `node19` |
| ⚡ | **John Von Neumann IoT Lab** | Level 1 | Room 102 (L1) | `node13` |
| 💻 | **Gordon Moore Controller Lab** | Level 1 | Room 108 (L1) | `node20` |
| 🎓 | **Level 1 Quadrangle & Classrooms** | Level 1 | Rooms 101–112 | `node39` |
| 🔬 | **Carver Mead VLSI Design Lab** | Level 2 | Room 201 (L2) | `node33` |
| 📡 | **Joseph Fourier DSP Lab** | Level 2 | Room 205 (L2) | `node30` |
| 💼 | **Placement & Corporate Wing** | Level 3 | L3 North Wing | `node22` |
| ✈️ | **Dr. V M Ghatage Aerospace Lab** | Level 3 | Room 308 (L3) | `node28` |
| 🏥 | **CDSIMER Medical College** | Campus | Medical Complex | `node305` |
| 🍽️ | **CDSIMER Cafeteria (Indoor)** | Level 0 | Ground Floor Inside | `node131` |
| ☕ | **Hospital Staff Canteen** | Level 0 | Clinical Wing L0 | `node243` |

---

## 📁 Project Structure

```
Frontend_campus/
│
├── index.html           # HTML5 interface with SVG map, floor switcher & preview modals
├── styles.css           # Modern design system, themes, CSS tokens, and responsiveness
├── script.js            # Dijkstra graph engine, DSU dataset, search & AI assistant
├── tour_images/         # High-resolution 360° panorama preview photographs
│   ├── ai_computer_lab.jpg
│   ├── iot_circuits_lab.jpg
│   ├── cdsimer_cafeteria.jpg
│   ├── food_truck.jpg
│   ├── hospital_canteen.jpg
│   ├── mech_dept.jpg
│   ├── parking_area.jpg
│   ├── soe_entrance.jpg
│   ├── soe_ground_lobby.jpg
│   ├── soe_1st_floor.jpg
│   ├── soe_3rd_floor.jpg
│   └── cdsimer_entrance.jpg
├── README.md            # Project documentation & quickstart
└── PROJECT_GUIDE.md     # In-depth architectural & algorithm reference
```

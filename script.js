/**
 * ============================================================================
 * CampusNav AI — AI-Powered Campus Navigation Assistant
 * Core Application Engine & Data Architecture
 * 
 * Includes:
 * 1. Configurable Campus Dataset & Graph Architecture
 * 2. Dijkstra's Shortest Path Algorithm (Distance & Accessibility Weighted)
 * 3. Interactive SVG Map Engine (Rendering, Pan, Zoom, Pins, Animated Routes)
 * 4. Location Search & Live Autocomplete Suggestions
 * 5. Category Filters & Place Details Preview
 * 6. Interactive Route Planner & Turn-by-Turn Guided Walk Demo
 * 7. AI Campus Assistant with Intent Matching & Natural Language Triggers
 * 8. Theme Switcher & Mobile Responsive Controls
 * ============================================================================
 */

'use strict';

/* ============================================================================
   1. CAMPUS CONFIGURATION & DATASET ARCHITECTURE
   Developers can customize campus name, walking speed, locations, and graph edges here.
   ============================================================================ */

const CAMPUS_CONFIG = {
  campusName: "Dayananda Sagar University (DSU) — Harohalli Campus",
  subtitle: "School of Engineering, Computing & CDSIMER Complex",
  virtualTourBaseUrl: "https://www.dsu.edu.in/virtual-tour/index.html",
  walkingSpeedMpm: 80, // Average walking speed in metres per minute (~1.33 m/s)
  defaultOrigin: "gate",
  defaultDestination: "ai_lab",
  svgWidth: 1200,
  svgHeight: 800
};

/**
 * Campus Locations Dataset — Dayananda Sagar University (Harohalli)
 * Extracted directly from official 360° virtual tour telemetry.
 */
const CAMPUS_LOCATIONS = [
  {
    id: "gate",
    name: "SOE Main Entrance Gate",
    category: "Administrative",
    floorLevel: "campus",
    roomNumber: "Campus Gate 1",
    dept: "Security & Transport Office",
    tourNode: "node180",
    tourImage: "tour_images/soe_entrance.jpg",
    description: "Primary University entry gate on Kanakapura Main Road with visitor registration, barrier security, and shuttle drop-off bays.",
    x: 140,
    y: 710,
    width: 160,
    height: 70,
    icon: "🚪",
    hours: "Open 24/7",
    floors: "Ground Entrance Archway",
    accessible: true,
    keywords: ["entrance", "security", "gate", "soe gate", "exit", "main gate", "dsu gate", "entry", "security gate", "bus"]
  },
  {
    id: "parking_4w",
    name: "4-Wheeler Main Parking",
    category: "Parking",
    floorLevel: "campus",
    roomNumber: "P-4W Zone",
    dept: "Campus Infrastructure & Estate",
    tourNode: "node178",
    tourImage: "tour_images/parking_area.jpg",
    description: "Dedicated tarmac parking facility with 150+ bays for faculty, university visitors, and ambulance access.",
    x: 1020,
    y: 620,
    width: 250,
    height: 200,
    icon: "🚗",
    hours: "06:00 AM – 11:00 PM",
    floors: "Tarmac Surface Lot (150+ Bays)",
    accessible: true,
    keywords: ["parking", "4 wheeler", "car", "visitor parking", "four wheeler", "faculty parking", "car park", "lot"]
  },
  {
    id: "parking_2w",
    name: "2-Wheeler Student Parking",
    category: "Parking",
    floorLevel: "campus",
    roomNumber: "P-2W Zone",
    dept: "Campus Infrastructure",
    description: "Covered two-wheeler parking lot along the western perimeter for student bikes, scooters, and EV two-wheelers.",
    x: 150,
    y: 140,
    width: 170,
    height: 85,
    icon: "🛵",
    hours: "06:00 AM – 10:30 PM",
    floors: "Paved Surface Lot",
    accessible: true,
    keywords: ["2 wheeler", "bike", "scooter", "motorcycle", "bike parking", "two wheeler", "parking"]
  },
  {
    id: "lawn",
    name: "Central Quadrangle Lawn",
    category: "Recreation",
    floorLevel: "campus",
    roomNumber: "Central Quad",
    dept: "Campus Horticulture & Student Affairs",
    description: "Vibrant manicured green lawns and shaded student amphitheatre connecting SOE, Mechanical, and the central promenade.",
    x: 430,
    y: 590,
    width: 360,
    height: 210,
    icon: "🌿",
    hours: "Open 24/7",
    floors: "Open Amphitheatre Greens",
    accessible: true,
    keywords: ["lawn", "grass", "garden", "greenery", "quad", "park", "central lawn", "sitting", "ground", "amphitheatre"]
  },
  {
    id: "food_truck",
    name: "Campus Food Truck",
    category: "Food",
    floorLevel: "campus",
    roomNumber: "Promenade Kiosk",
    dept: "Hospitality & Student Dining",
    tourNode: "node193",
    tourImage: "tour_images/food_truck.jpg",
    description: "Open-air fast food kiosk and coffee bar featuring patio umbrella seating facing the central quadrangle lawn.",
    x: 140,
    y: 530,
    width: 140,
    height: 75,
    icon: "🚚",
    hours: "09:00 AM – 08:30 PM",
    floors: "Outdoor Promenade Deck",
    accessible: true,
    keywords: ["food truck", "food", "snacks", "coffee", "tea", "juice", "breakfast", "fast food", "kiosk", "cafe"]
  },
  {
    id: "mech",
    name: "Mechanical Engineering Complex",
    category: "Academic",
    floorLevel: "campus",
    roomNumber: "Blocks M1–M3",
    dept: "Dept of Mechanical Engineering",
    tourNode: "node194",
    tourImage: "tour_images/mech_dept.jpg",
    description: "Specialized mechanical labs: Machine shop, CNC machining centre, Foundry, Thermal Fluids Lab, and CAD/CAM simulation lab.",
    x: 150,
    y: 330,
    width: 170,
    height: 95,
    icon: "⚙️",
    hours: "08:30 AM – 06:00 PM",
    floors: "3 Floors (Workshops & Labs)",
    accessible: true,
    keywords: ["mechanical", "mech", "workshop", "cad", "cnc", "machine shop", "manufacturing", "thermal", "fluid", "engineering"]
  },
  {
    id: "b_block",
    name: "Computing & Academic Wing (B-Block)",
    category: "Academic",
    floorLevel: "campus",
    roomNumber: "Block B (L0–L4)",
    dept: "School of Engineering & Computing",
    description: "Spacious multi-level academic wing housing CSE lecture halls, high-tech computer clusters, and tutorial rooms.",
    x: 390,
    y: 310,
    width: 220,
    height: 180,
    icon: "🏢",
    hours: "08:00 AM – 08:00 PM",
    floors: "4 Floors (Elevator & Ramp)",
    accessible: true,
    keywords: ["b block", "b-block", "classrooms", "lectures", "academic", "halls", "faculty", "cse block", "computer science"]
  },
  {
    id: "ai_lab",
    name: "Dennis M. Ritchie AI Lab",
    category: "Academic",
    floorLevel: "L1",
    roomNumber: "Room 104 (Level 1)",
    dept: "Dept of CSE / AI & Data Science",
    tourNode: "node19",
    tourImage: "tour_images/ai_computer_lab.jpg",
    description: "Premier AI & Deep Learning laboratory with GPU clusters, Data Science workstations, and neural network development terminals.",
    x: 390,
    y: 130,
    width: 195,
    height: 55,
    icon: "🤖",
    hours: "08:00 AM – 09:00 PM",
    floors: "Level 1 • B-Block Computing Wing",
    accessible: true,
    keywords: ["ai", "artificial intelligence", "ml", "dennis ritchie", "computer lab", "data science", "deep learning", "gpu", "coding", "python", "ai lab"]
  },
  {
    id: "iot_lab",
    name: "John Von Neumann IoT & Circuits Lab",
    category: "Academic",
    floorLevel: "L1",
    roomNumber: "Room 102 (Level 1)",
    dept: "Dept of ECE & Embedded Systems",
    tourNode: "node13",
    tourImage: "tour_images/iot_circuits_lab.jpg",
    description: "Digital circuits prototyping, sensor interfacing benches, Raspberry Pi/Arduino workstations, and embedded robotics test rigs.",
    x: 505,
    y: 130,
    width: 110,
    height: 55,
    icon: "⚡",
    hours: "08:30 AM – 06:00 PM",
    floors: "Level 1 • Innovation Wing",
    accessible: true,
    keywords: ["iot", "von neumann", "circuits", "digital lab", "embedded", "sensors", "robotics", "arduino", "electronics"]
  },
  {
    id: "moore_lab",
    name: "Gordon Moore Microcontroller Lab",
    category: "Academic",
    floorLevel: "L1",
    roomNumber: "Room 108 (Level 1)",
    dept: "Dept of CSE & Hardware Architecture",
    tourNode: "node20",
    description: "Microprocessor architecture, FPGA testing benches, and embedded assembly design lab.",
    x: 390,
    y: 200,
    width: 220,
    height: 48,
    icon: "💻",
    hours: "08:30 AM – 06:00 PM",
    floors: "Level 1 • Hardware Wing",
    accessible: true,
    keywords: ["moore", "microcontroller", "microprocessor", "fpga", "hardware", "gordon moore", "computer architecture"]
  },
  {
    id: "soe_lobby",
    name: "SOE Central Atrium & Reception",
    category: "Administrative",
    floorLevel: "L0",
    roomNumber: "Ground Atrium (L0)",
    dept: "Admissions, Enquiry & Dean Office",
    tourNode: "node41",
    tourImage: "tour_images/soe_ground_lobby.jpg",
    description: "Grand sky-lit entrance foyer of School of Engineering with student helpdesk, admissions counter, and dean's lounge.",
    x: 670,
    y: 360,
    width: 150,
    height: 95,
    icon: "🏛️",
    hours: "08:30 AM – 06:00 PM",
    floors: "Level 0 • Ground Foyer",
    accessible: true,
    keywords: ["soe lobby", "reception", "atrium", "admissions", "enquiry", "help desk", "dean", "waiting", "entrance", "soe"]
  },
  {
    id: "library",
    name: "Central Library & Digital Centre",
    category: "Academic",
    floorLevel: "L0",
    roomNumber: "Ground Level East",
    dept: "University Library Services",
    tourNode: "node17",
    description: "Extensive reference section, journals reading halls, and Digital Library with high-speed research terminals.",
    x: 795,
    y: 360,
    width: 140,
    height: 95,
    icon: "📚",
    hours: "08:00 AM – 09:30 PM",
    floors: "Level 0 • East Wing",
    accessible: true,
    keywords: ["library", "digital library", "books", "reading room", "journals", "study", "research", "central library"]
  },
  {
    id: "soe_l1_corridor",
    name: "Level 1 Quadrangle & Classrooms",
    category: "Academic",
    floorLevel: "L1",
    roomNumber: "Classrooms 101–112",
    dept: "School of Engineering",
    tourNode: "node39",
    tourImage: "tour_images/soe_1st_floor.jpg",
    description: "Spacious first-floor engineering academic concourse leading to tiered interactive classrooms and science labs.",
    x: 670,
    y: 260,
    width: 265,
    height: 70,
    icon: "🎓",
    hours: "08:00 AM – 07:00 PM",
    floors: "Level 1 • Academic Concourse",
    accessible: true,
    keywords: ["level 1", "first floor", "classrooms", "lecture hall", "physics lab", "chemistry lab", "corridor", "soe 1st floor"]
  },
  {
    id: "vlsi_lab",
    name: "Carver Mead VLSI Design Lab",
    category: "Academic",
    floorLevel: "L2",
    roomNumber: "Room 201 (Level 2)",
    dept: "Dept of ECE / Microelectronics",
    tourNode: "node33",
    description: "Advanced VLSI chip simulation suites with Cadence tools, semiconductor test rigs, and RF communication benches.",
    x: 670,
    y: 180,
    width: 125,
    height: 55,
    icon: "🔬",
    hours: "08:30 AM – 06:00 PM",
    floors: "Level 2 • ECE Wing",
    accessible: true,
    keywords: ["vlsi", "carver mead", "chip design", "electronics", "cadence", "semiconductor", "ece lab", "level 2"]
  },
  {
    id: "dsp_lab",
    name: "Joseph Fourier DSP Lab",
    category: "Academic",
    floorLevel: "L2",
    roomNumber: "Room 205 (Level 2)",
    dept: "Dept of ECE / Signal Processing",
    tourNode: "node30",
    description: "Digital signal processing, audio/video encoding test stations, and mathematical simulation suites.",
    x: 805,
    y: 180,
    width: 125,
    height: 55,
    icon: "📡",
    hours: "08:30 AM – 06:00 PM",
    floors: "Level 2 • Signal Processing Wing",
    accessible: true,
    keywords: ["dsp", "fourier", "signal processing", "audio", "video", "communication", "ece", "level 2"]
  },
  {
    id: "placement_wing",
    name: "Corporate Relations & Placement Wing",
    category: "Administrative",
    floorLevel: "L3",
    roomNumber: "L3 North Wing",
    dept: "Centre for Career Excellence & Placements",
    tourNode: "node22",
    tourImage: "tour_images/soe_3rd_floor.jpg",
    description: "Corporate recruitment centre with recruiter briefing halls, executive interview chambers, and group discussion rooms.",
    x: 670,
    y: 105,
    width: 125,
    height: 55,
    icon: "💼",
    hours: "09:00 AM – 06:00 PM",
    floors: "Level 3 • Placement Executive Wing",
    accessible: true,
    keywords: ["placement", "interview", "jobs", "training", "corporate", "career", "placement cell", "third floor", "level 3", "recruiters"]
  },
  {
    id: "aero_lab",
    name: "Dr. V M Ghatage Aerospace Lab",
    category: "Academic",
    floorLevel: "L3",
    roomNumber: "Room 308 (Level 3)",
    dept: "Dept of Aeronautical Engineering",
    tourNode: "node28",
    description: "Aircraft structural testing rigs, sub-sonic wind tunnel instrumentation, and advanced carbon-fiber composites laboratory.",
    x: 805,
    y: 105,
    width: 125,
    height: 55,
    icon: "✈️",
    hours: "08:30 AM – 06:00 PM",
    floors: "Level 3 • Aerospace Wing",
    accessible: true,
    keywords: ["aerospace", "aero", "ghatage", "wind tunnel", "structures", "avionics", "aircraft", "level 3", "composites"]
  },
  {
    id: "cdsimer",
    name: "CDSIMER Medical College & Hospital",
    category: "Academic",
    floorLevel: "campus",
    roomNumber: "Medical Complex",
    dept: "Dr. Chandramma DSU Medical Sciences",
    tourNode: "node305",
    tourImage: "tour_images/cdsimer_entrance.jpg",
    description: "Dr. Chandramma Dayananda Sagar Institute of Medical Education & Research — medical college, multi-specialty hospital, and trauma centre.",
    x: 1030,
    y: 280,
    width: 255,
    height: 255,
    icon: "🏥",
    hours: "Hospital 24/7 • College 08:30 AM – 05:00 PM",
    floors: "5 Floors (Elevators & Clinical Wards)",
    accessible: true,
    keywords: ["cdsimer", "medical", "hospital", "doctor", "health", "clinic", "medicine", "emergency", "simer", "cd simor", "nursing"]
  },
  {
    id: "canteen_cdsimer",
    name: "CDSIMER Cafeteria (Indoor Ground Floor)",
    category: "Food",
    floorLevel: "L0",
    roomNumber: "Ground Floor Dining Court",
    dept: "University Dining Services",
    tourNode: "node131",
    tourImage: "tour_images/cdsimer_cafeteria.jpg",
    description: "Primary indoor air-cooled cafeteria located directly inside CDSIMER ground floor. Serves South & North Indian meals, breakfast, fresh juices, and baked snacks.",
    x: 1030,
    y: 125,
    width: 235,
    height: 75,
    icon: "🍽️",
    hours: "07:30 AM – 09:30 PM",
    floors: "Ground Floor (Inside CDSIMER)",
    accessible: true,
    keywords: ["canteen", "cafeteria", "food", "lunch", "dinner", "breakfast", "coffee", "tea", "dining", "meals", "eat", "cdsimer canteen"]
  },
  {
    id: "hospital_canteen",
    name: "CDSIMER Hospital Staff Canteen",
    category: "Food",
    floorLevel: "L0",
    roomNumber: "Clinical Wing L0",
    dept: "Hospital Clinical Catering",
    tourNode: "node243",
    tourImage: "tour_images/hospital_canteen.jpg",
    description: "24/7 express cafeteria inside the CDSIMER hospital wing serving doctors, clinical students, patients, and visitors.",
    x: 1150,
    y: 205,
    width: 110,
    height: 55,
    icon: "☕",
    hours: "Open 24/7",
    floors: "Ground Floor (Hospital Wing)",
    accessible: true,
    keywords: ["hospital canteen", "staff canteen", "tea", "coffee", "night food", "24/7 food", "hospital food"]
  }
];

/**
 * Campus Graph Junction Nodes & Locations
 */
const GRAPH_NODES = {
  // Key destinations
  "gate": { x: 140, y: 710, label: "SOE Main Entrance Gate" },
  "food_truck": { x: 140, y: 530, label: "Campus Food Truck" },
  "mech": { x: 150, y: 330, label: "Mechanical Engineering Complex" },
  "parking_2w": { x: 150, y: 140, label: "2-Wheeler Student Parking" },
  "lawn": { x: 430, y: 590, label: "Central Quadrangle Lawn" },
  "b_block": { x: 390, y: 310, label: "Computing & Academic Wing (B-Block)" },
  "ai_lab": { x: 390, y: 130, label: "Dennis M. Ritchie AI Lab (L1)" },
  "iot_lab": { x: 505, y: 130, label: "John Von Neumann IoT Lab (L1)" },
  "moore_lab": { x: 390, y: 200, label: "Gordon Moore Microcontroller Lab (L1)" },
  "soe_lobby": { x: 670, y: 360, label: "SOE Central Atrium & Reception (L0)" },
  "library": { x: 795, y: 360, label: "Central Library & Digital Centre (L0)" },
  "soe_l1_corridor": { x: 670, y: 260, label: "SOE Level 1 Quadrangle (L1)" },
  "vlsi_lab": { x: 670, y: 180, label: "Carver Mead VLSI Lab (L2)" },
  "dsp_lab": { x: 805, y: 180, label: "Joseph Fourier DSP Lab (L2)" },
  "placement_wing": { x: 670, y: 105, label: "Placement Wing (L3)" },
  "aero_lab": { x: 805, y: 105, label: "Dr. V M Ghatage Aerospace Lab (L3)" },
  "cdsimer": { x: 1030, y: 280, label: "CDSIMER Medical College Main Foyer" },
  "canteen_cdsimer": { x: 1030, y: 125, label: "CDSIMER Cafeteria (Indoor Ground Floor)" },
  "hospital_canteen": { x: 1150, y: 205, label: "Hospital Staff Canteen" },
  "parking_4w": { x: 1020, y: 620, label: "4-Wheeler Main Parking" },

  // Walkway Waypoints & Vertical Connectors
  "j_gate": { x: 140, y: 670, label: "Gate North Junction" },
  "j_gate_east": { x: 220, y: 710, label: "South Boulevard West Fork" },
  "j_lawn_south": { x: 500, y: 710, label: "South Perimeter Promenade" },
  "j_south_east": { x: 800, y: 710, label: "South-East Boulevard Junction" },
  "j_truck": { x: 140, y: 470, label: "Food Truck Promenade Crossing" },
  "j_west_cross": { x: 140, y: 410, label: "West Central Crossroads" },
  "j_lawn_west": { x: 240, y: 590, label: "Central Lawn West Path" },
  "j_lawn_north": { x: 430, y: 470, label: "Central Lawn North Promenade" },
  "j_mech": { x: 150, y: 380, label: "Mechanical Dept Approach" },
  "j_north_west": { x: 140, y: 140, label: "North-West Corner Junction" },
  "j_b_block_north": { x: 280, y: 140, label: "B-Block North Avenue" },
  "j_b_block_south": { x: 390, y: 420, label: "B-Block South Plaza" },
  "j_b_block_ramp": { x: 420, y: 360, label: "B-Block Accessible Ramp" },
  "j_soe_south": { x: 670, y: 440, label: "SOE South Plaza" },
  "j_soe_ramp": { x: 670, y: 400, label: "SOE Accessible Entrance Ramp" },
  "j_soe_stair_l1": { x: 670, y: 310, label: "SOE Central Atrium Stairs / Elevator" },
  "j_soe_stair_l2": { x: 670, y: 220, label: "SOE Level 2 Hallway Junction" },
  "j_soe_stair_l3": { x: 670, y: 140, label: "SOE Level 3 Placement Wing Foyer" },
  "j_promenade_north": { x: 920, y: 90, label: "Central Promenade North End" },
  "j_promenade_canteen": { x: 920, y: 125, label: "Promenade at CDSIMER Cafeteria" },
  "j_promenade_cdsimer": { x: 920, y: 280, label: "Promenade at CDSIMER Entrance" },
  "j_promenade_center": { x: 920, y: 440, label: "Central Promenade Crossroads" },
  "j_promenade_parking": { x: 920, y: 560, label: "Promenade at 4W Parking Fork" },
  "j_parking_4w": { x: 980, y: 560, label: "4W Parking Access Gate" }
};

/**
 * Campus Weighted Graph Edges
 */
const GRAPH_EDGES = [
  // West Entrance Boulevard (Gate -> Food Truck -> Mech Block -> 2W Parking)
  { u: "gate", v: "j_gate", distance: 30, accessible: true, instruction: "Proceed through the SOE Main Entrance Gate onto the West Boulevard." },
  { u: "j_gate", v: "food_truck", distance: 140, accessible: true, instruction: "Head north past the security post toward the Campus Food Truck." },
  { u: "food_truck", v: "j_truck", distance: 40, accessible: true, instruction: "Continue north past the Food Truck along the paved sidewalk." },
  { u: "j_truck", v: "j_west_cross", distance: 60, accessible: true, instruction: "Walk north to the West Central Crossroads." },
  { u: "j_west_cross", v: "j_mech", distance: 50, accessible: true, instruction: "Follow the West Boulevard north toward the Mechanical Engineering Complex." },
  { u: "j_mech", v: "mech", distance: 40, accessible: true, instruction: "Turn west into the Mechanical Engineering main lobby." },
  { u: "j_mech", v: "j_north_west", distance: 180, accessible: true, instruction: "Continue north toward the 2-Wheeler Parking area." },
  { u: "j_north_west", v: "parking_2w", distance: 20, accessible: true, instruction: "Turn into the 2-Wheeler Student Parking bays." },
  { u: "j_north_west", v: "j_b_block_north", distance: 140, accessible: true, instruction: "Walk east along the North Avenue toward B-Block Computing Wing." },
  { u: "j_b_block_north", v: "ai_lab", distance: 60, accessible: true, instruction: "Enter Level 1 of B-Block to reach the Dennis M. Ritchie AI Lab." },
  { u: "ai_lab", v: "iot_lab", distance: 40, accessible: true, instruction: "Cross the Level 1 computing corridor to the John Von Neumann IoT Lab." },
  { u: "ai_lab", v: "moore_lab", distance: 50, accessible: true, instruction: "Take the Level 1 corridor south to Gordon Moore Microcontroller Lab." },
  { u: "moore_lab", v: "b_block", distance: 40, accessible: true, instruction: "Step into the main central foyer of B-Block." },

  // South Ring Road & Lawn Perimeter
  { u: "gate", v: "j_gate_east", distance: 80, accessible: true, instruction: "Turn east along the south perimeter boulevard from SOE Gate." },
  { u: "j_gate_east", v: "j_lawn_south", distance: 280, accessible: true, instruction: "Follow the scenic southern walkway bordering the Central Lawn." },
  { u: "j_lawn_south", v: "j_south_east", distance: 280, accessible: true, instruction: "Continue east along the shaded promenade toward South-East Boulevard." },
  { u: "j_south_east", v: "j_promenade_parking", distance: 160, accessible: true, instruction: "Walk north toward the 4-Wheeler Parking entrance fork." },

  // Central Lawn Intersections
  { u: "j_west_cross", v: "j_lawn_west", distance: 90, accessible: true, instruction: "Walk east toward the Central Quadrangle Lawn west entrance." },
  { u: "j_lawn_west", v: "lawn", distance: 60, accessible: true, instruction: "Step onto the Central Quadrangle Lawn amphitheatre greens." },
  { u: "lawn", v: "j_lawn_north", distance: 60, accessible: true, instruction: "Walk across to the north promenade of the Central Lawn." },
  { u: "j_lawn_north", v: "j_b_block_south", distance: 40, accessible: true, instruction: "Step onto the central plaza facing B-Block." },
  { u: "j_west_cross", v: "j_b_block_south", distance: 245, accessible: true, instruction: "Walk east along the boulevard between the Lawn and B-Block." },

  // Academic Connections (B-Block & SOE)
  { u: "j_b_block_south", v: "j_b_block_ramp", distance: 70, accessible: true, instruction: "Follow the smooth accessible ramp to B-Block South Entrance." },
  { u: "j_b_block_ramp", v: "b_block", distance: 45, accessible: true, instruction: "Enter B-Block ground foyer." },
  { u: "j_b_block_south", v: "j_soe_south", distance: 260, accessible: true, instruction: "Walk east along the central avenue to the School of Engineering (SOE)." },
  { u: "j_soe_south", v: "j_soe_ramp", distance: 50, accessible: true, instruction: "Follow the SOE entrance ramp toward the main portico." },
  { u: "j_soe_ramp", v: "soe_lobby", distance: 40, accessible: true, instruction: "Enter the SOE Central Atrium & Reception." },
  { u: "soe_lobby", v: "library", distance: 50, accessible: true, instruction: "Walk through the Level 0 corridor to the Central Library." },

  // Vertical Navigation inside SOE (L0 -> L1 -> L2 -> L3)
  { u: "soe_lobby", v: "j_soe_stair_l1", distance: 30, accessible: true, instruction: "Take the central elevator or stairs from Level 0 to Level 1." },
  { u: "j_soe_stair_l1", v: "soe_l1_corridor", distance: 30, accessible: true, instruction: "Step into the Level 1 Quadrangle and smart classrooms concourse." },
  { u: "j_soe_stair_l1", v: "j_soe_stair_l2", distance: 40, accessible: true, instruction: "Proceed up the stairs/elevator to Level 2 (ECE & VLSI Wing)." },
  { u: "j_soe_stair_l2", v: "vlsi_lab", distance: 35, accessible: true, instruction: "Turn west on Level 2 to Carver Mead VLSI Design Lab." },
  { u: "j_soe_stair_l2", v: "dsp_lab", distance: 45, accessible: true, instruction: "Turn east on Level 2 to Joseph Fourier DSP Lab." },
  { u: "j_soe_stair_l2", v: "j_soe_stair_l3", distance: 40, accessible: true, instruction: "Proceed up the elevator to Level 3 (Placement Wing & Aerospace)." },
  { u: "j_soe_stair_l3", v: "placement_wing", distance: 35, accessible: true, instruction: "Step into the Corporate Relations & Placement Wing on Level 3." },
  { u: "j_soe_stair_l3", v: "aero_lab", distance: 45, accessible: true, instruction: "Follow the Level 3 north corridor to Dr. V M Ghatage Aerospace Lab." },

  // Central Promenade & CDSIMER Medical Complex
  { u: "j_soe_south", v: "j_promenade_center", distance: 150, accessible: true, instruction: "Walk east from SOE toward the tree-lined Central Promenade." },
  { u: "j_promenade_north", v: "j_promenade_canteen", distance: 35, accessible: true, instruction: "Walk south along the Central Promenade." },
  { u: "j_promenade_canteen", v: "j_promenade_cdsimer", distance: 110, accessible: true, instruction: "Continue south along the promenade between SOE and CDSIMER." },
  { u: "j_promenade_cdsimer", v: "j_promenade_center", distance: 120, accessible: true, instruction: "Follow the promenade south toward the central crossroads." },
  { u: "j_promenade_center", v: "j_promenade_parking", distance: 110, accessible: true, instruction: "Continue south along the promenade toward 4-Wheeler Parking." },

  // Direct Access into Canteen (INSIDE CDSIMER Ground Floor)
  { u: "j_promenade_canteen", v: "canteen_cdsimer", distance: 85, accessible: true, instruction: "Turn east and step directly inside the CDSIMER building to reach the Ground Floor Indoor Cafeteria." },
  { u: "canteen_cdsimer", v: "cdsimer", distance: 60, accessible: true, instruction: "Walk through the ground floor connecting lobby from the Cafeteria into the CDSIMER Main Foyer." },
  { u: "j_promenade_cdsimer", v: "cdsimer", distance: 75, accessible: true, instruction: "Walk east into the main grand foyer of CDSIMER Medical College & Hospital." },
  { u: "cdsimer", v: "hospital_canteen", distance: 50, accessible: true, instruction: "Follow the Ground Floor clinical corridor east to the Hospital Staff Canteen." },
  { u: "soe_lobby", v: "j_promenade_cdsimer", distance: 130, accessible: true, instruction: "Exit SOE East Wing onto the Central Promenade facing CDSIMER." },

  // 4-Wheeler Parking Connections
  { u: "j_promenade_parking", v: "j_parking_4w", distance: 60, accessible: true, instruction: "Follow the vehicle access lane toward the 4-Wheeler Parking entrance." },
  { u: "j_parking_4w", v: "parking_4w", distance: 50, accessible: true, instruction: "Enter the 4-Wheeler Main Parking facility." }
];

/* ============================================================================
   2. SHORTEST PATH GRAPH ENGINE (DIJKSTRA'S ALGORITHM)
   ============================================================================ */

/**
 * Builds an adjacency list from GRAPH_EDGES with optional accessibility filter.
 */
function buildAdjacencyList(accessibleOnly = false) {
  const adj = {};
  for (const nodeKey of Object.keys(GRAPH_NODES)) {
    adj[nodeKey] = [];
  }

  for (const edge of GRAPH_EDGES) {
    if (accessibleOnly && !edge.accessible) {
      continue; // Skip stairs or inaccessible paths
    }
    // Undirected graph (walkways can be walked in both directions)
    adj[edge.u].push({ node: edge.v, distance: edge.distance, accessible: edge.accessible, instruction: edge.instruction });
    adj[edge.v].push({ node: edge.u, distance: edge.distance, accessible: edge.accessible, instruction: edge.instruction });
  }

  return adj;
}

/**
 * Calculates shortest path between startNodeId and targetNodeId.
 * Returns { success, path: [nodeIds], totalDistance, walkingTimeMinutes, steps: [...] }
 */
function findShortestRoute(startNodeId, targetNodeId, accessibleOnly = false) {
  if (!GRAPH_NODES[startNodeId] || !GRAPH_NODES[targetNodeId]) {
    return { success: false, error: "Invalid start or destination location." };
  }

  if (startNodeId === targetNodeId) {
    return {
      success: true,
      path: [startNodeId],
      totalDistance: 0,
      walkingTimeMinutes: 0,
      isAccessible: true,
      steps: [{
        from: startNodeId,
        to: targetNodeId,
        distance: 0,
        instruction: `You are already at ${GRAPH_NODES[startNodeId].label}.`
      }]
    };
  }

  const adj = buildAdjacencyList(accessibleOnly);
  const distances = {};
  const previous = {};
  const edgeUsed = {};
  const unvisited = new Set(Object.keys(GRAPH_NODES));

  for (const node of Object.keys(GRAPH_NODES)) {
    distances[node] = Infinity;
    previous[node] = null;
    edgeUsed[node] = null;
  }
  distances[startNodeId] = 0;

  while (unvisited.size > 0) {
    // Find unvisited node with minimal distance
    let current = null;
    let minDistance = Infinity;

    for (const node of unvisited) {
      if (distances[node] < minDistance) {
        minDistance = distances[node];
        current = node;
      }
    }

    if (current === null || minDistance === Infinity) {
      break; // All remaining nodes are unreachable
    }

    if (current === targetNodeId) {
      break; // Reached destination
    }

    unvisited.delete(current);

    // Update neighbors
    for (const neighbor of adj[current]) {
      if (!unvisited.has(neighbor.node)) continue;

      const alt = distances[current] + neighbor.distance;
      if (alt < distances[neighbor.node]) {
        distances[neighbor.node] = alt;
        previous[neighbor.node] = current;
        edgeUsed[neighbor.node] = neighbor;
      }
    }
  }

  if (distances[targetNodeId] === Infinity) {
    return {
      success: false,
      error: accessibleOnly 
        ? "No fully accessible (step-free) route was found between these points. Try disabling the accessible-only toggle." 
        : "No route exists between the selected locations."
    };
  }

  // Reconstruct path
  const path = [];
  const steps = [];
  let curr = targetNodeId;

  while (curr !== null) {
    path.unshift(curr);
    curr = previous[curr];
  }

  // Build step-by-step instructions
  for (let i = 0; i < path.length - 1; i++) {
    const fromId = path[i];
    const toId = path[i + 1];
    
    // Find matching edge instruction
    const matchingEdge = GRAPH_EDGES.find(e => 
      (e.u === fromId && e.v === toId) || (e.u === toId && e.v === fromId)
    );

    const stepDist = matchingEdge ? matchingEdge.distance : Math.round(calculateCoordDist(GRAPH_NODES[fromId], GRAPH_NODES[toId]));
    const stepInstruction = matchingEdge ? matchingEdge.instruction : `Walk from ${GRAPH_NODES[fromId].label} toward ${GRAPH_NODES[toId].label}.`;

    steps.push({
      stepNum: i + 1,
      from: fromId,
      to: toId,
      distance: stepDist,
      instruction: stepInstruction,
      accessible: matchingEdge ? matchingEdge.accessible : true
    });
  }

  const totalDist = Math.round(distances[targetNodeId]);
  const walkingTime = Math.max(1, Math.ceil(totalDist / CAMPUS_CONFIG.walkingSpeedMpm));

  return {
    success: true,
    path,
    totalDistance: totalDist,
    walkingTimeMinutes: walkingTime,
    steps,
    isAccessible: steps.every(s => s.accessible)
  };
}

function calculateCoordDist(p1, p2) {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/* ============================================================================
   3. APPLICATION STATE & DOM REFERENCES
   ============================================================================ */

const state = {
  selectedLocationId: null,
  activeRoute: null,
  routeOriginId: "",
  routeDestId: "",
  accessibleOnly: false,
  mapTransform: { scale: 1, x: 0, y: 0 },
  isPanning: false,
  panStart: { x: 0, y: 0 },
  activeCategory: "all",
  activeFloorLevel: "all",
  activeDemoStepIndex: 0,
  isDemoNavigating: false,
  theme: "light"
};

// Cached DOM Elements
const dom = {};

function initDomReferences() {
  dom.campusNameDisplay = document.getElementById("campusNameDisplay");
  dom.globalSearchInput = document.getElementById("globalSearchInput");
  dom.clearSearchBtn = document.getElementById("clearSearchBtn");
  dom.searchSuggestionsDropdown = document.getElementById("searchSuggestionsDropdown");
  dom.searchSuggestionsList = document.getElementById("searchSuggestionsList");
  dom.quickChipsContainer = document.getElementById("quickChipsContainer");

  // Left Panel
  dom.categoryFilters = document.getElementById("categoryFilters");
  dom.frequentTagsList = document.getElementById("frequentTagsList");
  dom.placesList = document.getElementById("placesList");
  dom.noPlacesFound = document.getElementById("noPlacesFound");
  dom.locationCountBadge = document.getElementById("locationCountBadge");
  dom.selectedPlacePreview = document.getElementById("selectedPlacePreview");
  dom.previewCategoryTag = document.getElementById("previewCategoryTag");
  dom.previewFloorTag = document.getElementById("previewFloorTag");
  dom.previewAccessibilityTag = document.getElementById("previewAccessibilityTag");
  dom.previewTourSnapshot = document.getElementById("previewTourSnapshot");
  dom.previewTourImg = document.getElementById("previewTourImg");
  dom.previewTourLink = document.getElementById("previewTourLink");
  dom.previewTitle = document.getElementById("previewTitle");
  dom.previewDesc = document.getElementById("previewDesc");
  dom.previewHoursText = document.getElementById("previewHoursText");
  dom.previewFloorsText = document.getElementById("previewFloorsText");
  dom.previewDeptText = document.getElementById("previewDeptText");
  dom.previewGetDirectionsBtn = document.getElementById("previewGetDirectionsBtn");
  dom.previewSetOriginBtn = document.getElementById("previewSetOriginBtn");
  dom.previewCloseBtn = document.getElementById("previewCloseBtn");
  dom.resetFiltersBtn = document.getElementById("resetFiltersBtn");

  // Floor selector in map toolbar
  dom.floorSelectorGroup = document.getElementById("floorSelectorGroup");

  // Map
  dom.mapViewport = document.getElementById("mapViewport");
  dom.campusSvg = document.getElementById("campusSvg");
  dom.mapPanZoomLayer = document.getElementById("mapPanZoomLayer");
  dom.mapLandscapeLayer = document.getElementById("mapLandscapeLayer");
  dom.mapPathsLayer = document.getElementById("mapPathsLayer");
  dom.mapRouteLayer = document.getElementById("mapRouteLayer");
  dom.mapBuildingsLayer = document.getElementById("mapBuildingsLayer");
  dom.mapMarkersLayer = document.getElementById("mapMarkersLayer");
  dom.mapPinsLayer = document.getElementById("mapPinsLayer");
  dom.mapZoomInBtn = document.getElementById("mapZoomInBtn");
  dom.mapZoomOutBtn = document.getElementById("mapZoomOutBtn");
  dom.mapResetBtn = document.getElementById("mapResetBtn");
  dom.mapFitSelectionBtn = document.getElementById("mapFitSelectionBtn");
  dom.activeRouteChip = document.getElementById("activeRouteChip");
  dom.routeChipText = document.getElementById("routeChipText");
  dom.chipClearRouteBtn = document.getElementById("chipClearRouteBtn");
  dom.mapHintText = document.getElementById("mapHintText");
  dom.legendToggleBtn = document.getElementById("legendToggleBtn");
  dom.legendBody = document.getElementById("legendBody");

  // Right Panel - Route Planner
  dom.tabDirectionsMode = document.getElementById("tabDirectionsMode");
  dom.tabAssistantMode = document.getElementById("tabAssistantMode");
  dom.routePanelWrapper = document.getElementById("routePanelWrapper");
  dom.assistantPanelWrapper = document.getElementById("assistantPanelWrapper");
  dom.routeOriginSelect = document.getElementById("routeOriginSelect");
  dom.routeDestSelect = document.getElementById("routeDestSelect");
  dom.swapLocationsBtn = document.getElementById("swapLocationsBtn");
  dom.accessibleOnlyToggle = document.getElementById("accessibleOnlyToggle");
  dom.calculateRouteBtn = document.getElementById("calculateRouteBtn");
  dom.clearRouteBtn = document.getElementById("clearRouteBtn");
  dom.routeResultCard = document.getElementById("routeResultCard");
  dom.plannerEmptyState = document.getElementById("plannerEmptyState");
  dom.routeDistValue = document.getElementById("routeDistValue");
  dom.routeTimeValue = document.getElementById("routeTimeValue");
  dom.routeAccessBadge = document.getElementById("routeAccessBadge");
  dom.turnStepsList = document.getElementById("turnStepsList");
  dom.stepsCountText = document.getElementById("stepsCountText");
  dom.quickPlanDemoBtn = document.getElementById("quickPlanDemoBtn");

  // Route Demo Navigation Bar
  dom.startNavDemoBtn = document.getElementById("startNavDemoBtn");
  dom.navDemoControls = document.getElementById("navDemoControls");
  dom.demoProgressFill = document.getElementById("demoProgressFill");
  dom.demoStepText = document.getElementById("demoStepText");
  dom.prevStepBtn = document.getElementById("prevStepBtn");
  dom.nextStepBtn = document.getElementById("nextStepBtn");
  dom.stopNavDemoBtn = document.getElementById("stopNavDemoBtn");

  // Right Panel - AI Chat
  dom.chatMessagesContainer = document.getElementById("chatMessagesContainer");
  dom.chatTypingIndicator = document.getElementById("chatTypingIndicator");
  dom.chatInputForm = document.getElementById("chatInputForm");
  dom.chatTextInput = document.getElementById("chatTextInput");
  dom.clearChatBtn = document.getElementById("clearChatBtn");
  dom.promptsScroll = document.getElementById("promptsScroll");
  dom.initialChatTime = document.getElementById("initialChatTime");

  // Header & Mobile View
  dom.themeToggleBtn = document.getElementById("themeToggleBtn");
  dom.mobileMenuBtn = document.getElementById("mobileMenuBtn");
  dom.mobileViewTabs = document.getElementById("mobileViewTabs");
  dom.toastContainer = document.getElementById("toastContainer");
}

/* ============================================================================
   4. SVG CAMPUS MAP ENGINE
   ============================================================================ */

/**
 * Initializes the entire SVG layout including parkland, roads, and building silhouettes.
 */
function renderCampusSvgBase() {
  if (dom.campusNameDisplay) {
    dom.campusNameDisplay.textContent = CAMPUS_CONFIG.campusName;
  }

  // 1. Render Landscape, Green Courtyards & Roads
  dom.mapLandscapeLayer.innerHTML = `
    <!-- Campus Base Turf -->
    <rect x="0" y="0" width="${CAMPUS_CONFIG.svgWidth}" height="${CAMPUS_CONFIG.svgHeight}" class="svg-grass" rx="16" />

    <!-- Campus Boundary Perimeter -->
    <rect x="25" y="25" width="1150" height="750" fill="none" stroke="#e2e8f0" stroke-width="4" stroke-dasharray="12 8" opacity="0.35" rx="20" />

    <!-- Central Walking Path Pedestrian Strip -->
    <rect x="760" y="70" width="40" height="660" rx="20" fill="#0284c7" opacity="0.08" />
    <text x="780" y="380" fill="#0284c7" font-size="10" font-weight="700" letter-spacing="2" text-anchor="middle" transform="rotate(-90 780 380)" opacity="0.6">WALKING PATH PROMENADE</text>

    <!-- Decorative Campus Trees -->
    ${generateTreeElements()}
  `;

  // 2. Render Walkway Network (Edges)
  renderWalkwayLines();

  // 3. Render Architectural Buildings
  renderBuildingsLayer();

  // 4. Populate Route Select Dropdowns
  populateRouteDropdowns();
}

/**
 * Generates decorative stylized tree elements across grass zones.
 */
function generateTreeElements() {
  const treeCoords = [
    [215, 465], [610, 465], [215, 710], [610, 710], [755, 130],
    [810, 130], [755, 480], [810, 480], [280, 740], [530, 740],
    [850, 430], [1140, 430], [755, 650], [810, 650], [350, 740], [450, 740]
  ];

  return treeCoords.map(([tx, ty]) => `
    <g class="campus-tree" transform="translate(${tx}, ${ty})">
      <circle cx="0" cy="0" r="10" fill="#10b981" opacity="0.25" />
      <circle cx="0" cy="-1" r="7" fill="#059669" opacity="0.8" />
      <circle cx="-2" cy="-3" r="3.5" fill="#34d399" opacity="0.9" />
    </g>
  `).join("");
}

/**
 * Renders the visible walkways in the SVG based on GRAPH_EDGES.
 */
function renderWalkwayLines() {
  let pathsMarkup = "";

  for (const edge of GRAPH_EDGES) {
    const p1 = GRAPH_NODES[edge.u];
    const p2 = GRAPH_NODES[edge.v];
    if (!p1 || !p2) continue;

    // Distinct visual line for accessible vs stepped paths
    if (!edge.accessible) {
      pathsMarkup += `
        <line x1="${p1.x}" y1="${p1.y}" x2="${p2.x}" y2="${p2.y}" class="svg-walkway-base" />
        <line x1="${p1.x}" y1="${p1.y}" x2="${p2.x}" y2="${p2.y}" class="svg-walkway-surface" />
        <line x1="${p1.x}" y1="${p1.y}" x2="${p2.x}" y2="${p2.y}" class="svg-step-indicator" title="Stone Steps (Not wheelchair accessible)" />
      `;
    } else {
      pathsMarkup += `
        <line x1="${p1.x}" y1="${p1.y}" x2="${p2.x}" y2="${p2.y}" class="svg-walkway-base" />
        <line x1="${p1.x}" y1="${p1.y}" x2="${p2.x}" y2="${p2.y}" class="svg-walkway-surface" />
      `;
    }
  }

  dom.mapPathsLayer.innerHTML = pathsMarkup;
}

/**
 * Renders all campus building shapes, icons, and interactive elements.
 */
function renderBuildingsLayer() {
  let buildingsMarkup = "";

  for (const place of CAMPUS_LOCATIONS) {
    const rx = place.x - place.width / 2;
    const ry = place.y - place.height / 2;

    if (place.id === "b_block") {
      // B-Block with nested AI, IoT, and Moore Architecture Labs
      buildingsMarkup += `
        <g class="campus-building" id="svgBuilding_b_block" data-id="b_block" data-floor="campus" role="button" tabindex="0" aria-label="B - Block Computing Wing">
          <rect x="${rx}" y="${ry}" width="${place.width}" height="${place.height}" rx="14" fill="url(#academicGrad)" class="building-body" />
          <rect x="${rx + 8}" y="${ry + 6}" width="${place.width - 16}" height="6" rx="3" fill="#ffffff" opacity="0.25" />
          
          <text x="${place.x}" y="${place.y + 10}" font-size="22" text-anchor="middle" dominant-baseline="central" pointer-events="none">${place.icon}</text>
          <text x="${place.x}" y="${place.y + 36}" class="building-label-text">B - BLOCK</text>
          <text x="${place.x}" y="${place.y + 52}" class="building-sub-text">Computing & Academic Wing</text>
          <text x="${place.x}" y="${place.y + 70}" font-size="9" fill="#a5b4fc" font-weight="600" text-anchor="middle">Floors L0–L4 | CSE Dept</text>
        </g>

        <!-- Nested Level 1 Dennis Ritchie AI Lab -->
        <g class="campus-building sub-building" id="svgBuilding_ai_lab" data-id="ai_lab" data-floor="L1" role="button" tabindex="0" aria-label="Dennis M. Ritchie AI Lab">
          <rect x="295" y="102" width="195" height="55" rx="8" fill="url(#techGrad)" stroke="#c7d2fe" stroke-width="1.5" class="building-body" />
          <text x="392" y="125" font-size="10.5" font-weight="800" fill="#ffffff" text-anchor="middle" letter-spacing="0.5">🤖 DENNIS RITCHIE AI LAB</text>
          <text x="392" y="141" font-size="8.5" fill="#e0e7ff" text-anchor="middle">Level 1 • GPU Clusters & ML</text>
        </g>

        <!-- Nested Level 1 Von Neumann IoT Lab -->
        <g class="campus-building sub-building" id="svgBuilding_iot_lab" data-id="iot_lab" data-floor="L1" role="button" tabindex="0" aria-label="John Von Neumann IoT Lab">
          <rect x="495" y="102" width="115" height="55" rx="8" fill="url(#techGrad)" stroke="#a7f3d0" stroke-width="1.5" class="building-body" />
          <text x="552" y="125" font-size="10" font-weight="800" fill="#ffffff" text-anchor="middle">⚡ IOT LAB</text>
          <text x="552" y="141" font-size="8.2" fill="#d1fae5" text-anchor="middle">Level 1 • Circuits & Edge</text>
        </g>

        <!-- Nested Gordon Moore Microcontroller Lab -->
        <g class="campus-building sub-building" id="svgBuilding_moore_lab" data-id="moore_lab" data-floor="L1" role="button" tabindex="0" aria-label="Gordon Moore Lab">
          <rect x="295" y="165" width="220" height="48" rx="8" fill="#1e1b4b" stroke="#818cf8" stroke-width="1.2" class="building-body" opacity="0.9" />
          <text x="405" y="185" font-size="10" font-weight="800" fill="#c7d2fe" text-anchor="middle">💻 MOORE CONTROLLER LAB</text>
          <text x="405" y="199" font-size="8" fill="#a5b4fc" text-anchor="middle">Level 1 • Architecture Lab 108</text>
        </g>
      `;
    } else if (place.id === "ai_lab" || place.id === "iot_lab" || place.id === "moore_lab") {
      // Rendered nested inside B-Block
      continue;
    } else if (place.id === "soe_lobby") {
      // School of Engineering Complex with floor-by-floor wings
      buildingsMarkup += `
        <!-- SOE Main Structural Boundary Shell -->
        <rect x="585" y="70" width="300" height="400" rx="18" fill="url(#techGrad)" stroke="#38bdf8" stroke-width="2" class="building-shell" opacity="0.3" />
        <rect x="595" y="76" width="280" height="4" rx="2" fill="#ffffff" opacity="0.25" />

        <!-- Level 3 Placement Wing -->
        <g class="campus-building sub-building" id="svgBuilding_placement_wing" data-id="placement_wing" data-floor="L3" role="button" tabindex="0" aria-label="Placement Wing">
          <rect x="595" y="82" width="135" height="52" rx="8" fill="#0f172a" stroke="#fbbf24" stroke-width="1.5" class="building-body" />
          <text x="662" y="104" font-size="9.5" font-weight="800" fill="#fde68a" text-anchor="middle">💼 PLACEMENT WING</text>
          <text x="662" y="120" font-size="8" fill="#fef3c7" text-anchor="middle">Level 3 • Corporate Relations</text>
        </g>

        <!-- Level 3 Aerospace Lab -->
        <g class="campus-building sub-building" id="svgBuilding_aero_lab" data-id="aero_lab" data-floor="L3" role="button" tabindex="0" aria-label="Aerospace Lab">
          <rect x="740" y="82" width="135" height="52" rx="8" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5" class="building-body" />
          <text x="807" y="104" font-size="9.5" font-weight="800" fill="#bae6fd" text-anchor="middle">✈️ GHATAGE AERO LAB</text>
          <text x="807" y="120" font-size="8" fill="#e0f2fe" text-anchor="middle">Level 3 • Wind Tunnel Lab</text>
        </g>

        <!-- Level 2 Carver Mead VLSI Lab -->
        <g class="campus-building sub-building" id="svgBuilding_vlsi_lab" data-id="vlsi_lab" data-floor="L2" role="button" tabindex="0" aria-label="Carver Mead VLSI Lab">
          <rect x="595" y="148" width="135" height="52" rx="8" fill="#0c4a6e" stroke="#38bdf8" stroke-width="1.5" class="building-body" />
          <text x="662" y="170" font-size="9.5" font-weight="800" fill="#7dd3fc" text-anchor="middle">🔬 CARVER VLSI LAB</text>
          <text x="662" y="186" font-size="8" fill="#bae6fd" text-anchor="middle">Level 2 • ECE Chip Design</text>
        </g>

        <!-- Level 2 Fourier DSP Lab -->
        <g class="campus-building sub-building" id="svgBuilding_dsp_lab" data-id="dsp_lab" data-floor="L2" role="button" tabindex="0" aria-label="Fourier DSP Lab">
          <rect x="740" y="148" width="135" height="52" rx="8" fill="#0c4a6e" stroke="#38bdf8" stroke-width="1.5" class="building-body" />
          <text x="807" y="170" font-size="9.5" font-weight="800" fill="#7dd3fc" text-anchor="middle">📡 FOURIER DSP LAB</text>
          <text x="807" y="186" font-size="8" fill="#bae6fd" text-anchor="middle">Level 2 • Signal Processing</text>
        </g>

        <!-- Level 1 Academic Concourse & Smart Classrooms -->
        <g class="campus-building sub-building" id="svgBuilding_soe_l1_corridor" data-id="soe_l1_corridor" data-floor="L1" role="button" tabindex="0" aria-label="SOE Level 1 Concourse">
          <rect x="595" y="218" width="280" height="60" rx="8" fill="#0369a1" stroke="#bae6fd" stroke-width="1.5" class="building-body" />
          <text x="735" y="244" font-size="11" font-weight="800" fill="#ffffff" text-anchor="middle">🎓 LEVEL 1 CONCOURSE & CLASSROOMS</text>
          <text x="735" y="260" font-size="8.5" fill="#e0f2fe" text-anchor="middle">Rooms 101–112 • Physics & Chemistry Research Labs</text>
        </g>

        <!-- Level 0 SOE Central Atrium & Reception -->
        <g class="campus-building sub-building" id="svgBuilding_soe_lobby" data-id="soe_lobby" data-floor="L0" role="button" tabindex="0" aria-label="SOE Atrium & Admissions">
          <rect x="595" y="300" width="145" height="95" rx="10" fill="#075985" stroke="#38bdf8" stroke-width="2" class="building-body" />
          <text x="667" y="335" font-size="20" text-anchor="middle" dominant-baseline="central">🏛️</text>
          <text x="667" y="358" font-size="10.5" font-weight="800" fill="#ffffff" text-anchor="middle">SOE ATRIUM</text>
          <text x="667" y="374" font-size="8.5" fill="#bae6fd" text-anchor="middle">Ground Level • Admissions</text>
        </g>

        <!-- Level 0 Central Library -->
        <g class="campus-building sub-building" id="svgBuilding_library" data-id="library" data-floor="L0" role="button" tabindex="0" aria-label="Central Library">
          <rect x="750" y="300" width="125" height="95" rx="10" fill="#1e3a8a" stroke="#60a5fa" stroke-width="2" class="building-body" />
          <text x="812" y="335" font-size="20" text-anchor="middle" dominant-baseline="central">📚</text>
          <text x="812" y="358" font-size="10.5" font-weight="800" fill="#ffffff" text-anchor="middle">LIBRARY</text>
          <text x="812" y="374" font-size="8.5" fill="#bfdbfe" text-anchor="middle">Digital Research Wing</text>
        </g>
      `;
    } else if (place.id === "library" || place.id === "soe_l1_corridor" || place.id === "vlsi_lab" || place.id === "dsp_lab" || place.id === "placement_wing" || place.id === "aero_lab") {
      // Rendered in SOE shell
      continue;
    } else if (place.id === "cdsimer") {
      // CDSIMER Medical College with nested Indoor Cafeteria & Hospital Canteen
      buildingsMarkup += `
        <g class="campus-building" id="svgBuilding_cdsimer" data-id="cdsimer" data-floor="campus" role="button" tabindex="0" aria-label="CDSIMER Medical College & Hospital">
          <rect x="${rx}" y="${ry}" width="${place.width}" height="${place.height}" rx="16" fill="url(#hostelGrad)" class="building-body" />
          <rect x="${rx + 8}" y="${ry + 6}" width="${place.width - 16}" height="6" rx="3" fill="#ffffff" opacity="0.25" />

          <text x="${place.x}" y="${place.y + 40}" font-size="22" text-anchor="middle" dominant-baseline="central" pointer-events="none">${place.icon}</text>
          <text x="${place.x}" y="${place.y + 66}" class="building-label-text">CDSIMER</text>
          <text x="${place.x}" y="${place.y + 82}" class="building-sub-text">Dr. Chandramma Medical College & Hospital</text>

          <!-- Medical Red Cross Indicator -->
          <rect x="${place.x - 12}" y="${place.y + 96}" width="24" height="6" rx="2" fill="#f43f5e" />
          <rect x="${place.x - 3}" y="${place.y + 87}" width="6" height="24" rx="2" fill="#f43f5e" />
          <text x="${place.x}" y="${place.y + 124}" font-size="9" font-weight="700" fill="#fda4af" text-anchor="middle">5 FLOORS • EMERGENCY 24/7</text>
        </g>

        <!-- CDSIMER INDOOR CAFETERIA (Inside Ground Floor) -->
        <g class="campus-building sub-building" id="svgBuilding_canteen_cdsimer" data-id="canteen_cdsimer" data-floor="L0" role="button" tabindex="0" aria-label="CDSIMER Indoor Cafeteria">
          <rect x="${rx + 10}" y="${ry + 10}" width="${place.width - 20}" height="70" rx="10" fill="url(#foodGrad)" stroke="#fbbf24" stroke-width="2" class="building-body" />
          <text x="${place.x}" y="${ry + 38}" font-size="12" font-weight="800" fill="#ffffff" text-anchor="middle">🍽️ CDSIMER CAFETERIA (Indoor)</text>
          <text x="${place.x}" y="${ry + 56}" font-size="9" font-weight="600" fill="#fef3c7" text-anchor="middle">Ground Floor Multi-Cuisine Dining Court</text>
          <circle cx="${rx + place.width - 25}" cy="${ry + 38}" r="4" fill="#10b981" />
        </g>

        <!-- CDSIMER Hospital Staff Canteen -->
        <g class="campus-building sub-building" id="svgBuilding_hospital_canteen" data-id="hospital_canteen" data-floor="L0" role="button" tabindex="0" aria-label="Hospital Staff Canteen">
          <rect x="${rx + place.width - 120}" y="${ry + 90}" width="110" height="48" rx="8" fill="#1e293b" stroke="#fda4af" stroke-width="1.2" class="building-body" />
          <text x="${rx + place.width - 65}" y="${ry + 110}" font-size="9.5" font-weight="800" fill="#fda4af" text-anchor="middle">☕ HOSPITAL CANTEEN</text>
          <text x="${rx + place.width - 65}" y="${ry + 124}" font-size="7.8" fill="#fecdd3" text-anchor="middle">Clinical Wing • 24/7</text>
        </g>
      `;
    } else if (place.id === "canteen_cdsimer" || place.id === "hospital_canteen") {
      // Rendered nested inside CDSIMER
      continue;
    } else if (place.id === "lawn") {
      // Central Quadrangle Lawn
      buildingsMarkup += `
        <g class="campus-building" id="svgBuilding_lawn" data-id="lawn" data-floor="campus" role="button" tabindex="0" aria-label="Central Quadrangle Lawn">
          <rect x="${rx}" y="${ry}" width="${place.width}" height="${place.height}" rx="28" fill="url(#grassGrad)" stroke="#10b981" stroke-width="2.5" class="building-body" opacity="0.9" />
          <circle cx="${rx + 50}" cy="${ry + 40}" r="14" fill="#10b981" opacity="0.2" />
          <circle cx="${rx + place.width - 50}" cy="${ry + place.height - 40}" r="18" fill="#10b981" opacity="0.2" />
          <text x="${place.x}" y="${place.y - 12}" font-size="16" font-weight="800" fill="#065f46" text-anchor="middle">🌿 CENTRAL QUADRANGLE</text>
          <text x="${place.x}" y="${place.y + 12}" font-size="11" font-weight="600" fill="#047857" text-anchor="middle">Manicured Green Lawn & Open Amphitheatre</text>
        </g>
      `;
    } else if (place.id === "parking_4w") {
      // 4-Wheeler Parking
      buildingsMarkup += `
        <g class="campus-building" id="svgBuilding_parking_4w" data-id="parking_4w" data-floor="campus" role="button" tabindex="0" aria-label="4-Wheeler Main Parking">
          <rect x="${rx}" y="${ry}" width="${place.width}" height="${place.height}" rx="14" fill="url(#parkingGrad)" class="building-body" />
          <rect x="${rx + 8}" y="${ry + 6}" width="${place.width - 16}" height="5" rx="2.5" fill="#ffffff" opacity="0.2" />
          <text x="${place.x}" y="${place.y - 15}" font-size="24" text-anchor="middle" dominant-baseline="central" pointer-events="none">${place.icon}</text>
          <text x="${place.x}" y="${place.y + 16}" class="building-label-text">4-WHEELER MAIN PARKING</text>
          <text x="${place.x}" y="${place.y + 34}" class="building-sub-text">Faculty, Staff & Visitor Parking</text>
          <rect x="${rx + 35}" y="${ry + place.height - 40}" width="${place.width - 70}" height="25" rx="6" fill="#1e293b" stroke="#475569" stroke-width="1" />
          <text x="${place.x}" y="${ry + place.height - 24}" font-size="9.5" font-weight="700" fill="#fbbf24" text-anchor="middle">🅿️ 150+ Designated Bays</text>
        </g>
      `;
    } else {
      // Standard Building
      const gradMap = {
        "Academic": "url(#academicGrad)",
        "Administrative": "url(#adminGrad)",
        "Food": "url(#foodGrad)",
        "Parking": "url(#parkingGrad)",
        "Recreation": "url(#grassGrad)"
      };
      const fillStyle = gradMap[place.category] || "url(#academicGrad)";

      buildingsMarkup += `
        <g class="campus-building" id="svgBuilding_${place.id}" data-id="${place.id}" data-floor="${place.floorLevel || 'campus'}" role="button" tabindex="0" aria-label="${place.name}">
          <rect x="${rx}" y="${ry}" width="${place.width}" height="${place.height}" rx="12" fill="${fillStyle}" class="building-body" />
          <rect x="${rx + 8}" y="${ry + 6}" width="${place.width - 16}" height="6" rx="3" fill="#ffffff" opacity="0.25" />
          <text x="${place.x}" y="${place.y - 4}" font-size="20" text-anchor="middle" dominant-baseline="central" pointer-events="none">${place.icon}</text>
          <text x="${place.x}" y="${place.y + 18}" class="building-label-text">${place.name}</text>
          <text x="${place.x}" y="${place.y + 30}" class="building-sub-text">${place.category}</text>
        </g>
      `;
    }
  }

  dom.mapBuildingsLayer.innerHTML = buildingsMarkup;

  // Attach click & keyboard listeners to buildings
  const buildingNodes = dom.mapBuildingsLayer.querySelectorAll(".campus-building");
  buildingNodes.forEach(node => {
    node.addEventListener("click", (e) => {
      e.stopPropagation();
      const placeId = node.getAttribute("data-id");
      handleSelectLocation(placeId, { centerMap: false, userInitiated: true });
    });
    node.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        e.stopPropagation();
        const placeId = node.getAttribute("data-id");
        handleSelectLocation(placeId, { centerMap: true, userInitiated: true });
      }
    });
  });
}

/**
 * Draws the active route on the map with animated dashes and pins.
 */
function renderActiveRouteOnMap(routeResult) {
  if (!routeResult || !routeResult.path || routeResult.path.length < 2) {
    dom.mapRouteLayer.innerHTML = "";
    dom.mapPinsLayer.innerHTML = "";
    dom.activeRouteChip.style.display = "none";
    return;
  }

  const pathPoints = routeResult.path.map(nodeId => {
    const node = GRAPH_NODES[nodeId];
    return `${node.x},${node.y}`;
  }).join(" ");

  // Build Animated SVG Polyline
  dom.mapRouteLayer.innerHTML = `
    <!-- Glow Backdrop -->
    <polyline points="${pathPoints}" class="svg-route-halo" />
    <!-- Flowing Dashed Route Line -->
    <polyline points="${pathPoints}" class="svg-route-path" id="activeSvgRoutePolyline" />
  `;

  // Start Pin (A) & Destination Pin (B)
  const startNode = GRAPH_NODES[routeResult.path[0]];
  const endNode = GRAPH_NODES[routeResult.path[routeResult.path.length - 1]];

  dom.mapPinsLayer.innerHTML = `
    <!-- Start Pin Pulse -->
    <g class="route-pin pin-start" transform="translate(${startNode.x}, ${startNode.y})">
      <circle cx="0" cy="0" r="14" fill="#10b981" class="pin-pulse-circle" />
      <circle cx="0" cy="0" r="12" fill="#10b981" stroke="#ffffff" stroke-width="2.5" filter="url(#pinShadow)" />
      <text x="0" y="4" font-size="11" font-weight="800" fill="#ffffff" text-anchor="middle">A</text>
    </g>

    <!-- Destination Pin Pulse -->
    <g class="route-pin pin-dest" transform="translate(${endNode.x}, ${endNode.y})">
      <circle cx="0" cy="0" r="16" fill="#6366f1" class="pin-pulse-circle" />
      <circle cx="0" cy="0" r="14" fill="#4f46e5" stroke="#ffffff" stroke-width="3" filter="url(#pinShadow)" />
      <text x="0" y="4" font-size="11" font-weight="800" fill="#ffffff" text-anchor="middle">B</text>
    </g>
  `;

  // Update Route Chip in Toolbar
  dom.routeChipText.textContent = `Route: ${routeResult.totalDistance}m (${routeResult.walkingTimeMinutes} min)`;
  dom.activeRouteChip.style.display = "flex";
}

/* ============================================================================
   5. MAP PAN & ZOOM ENGINE
   ============================================================================ */

function initMapInteractions() {
  applyMapTransform();

  // Zoom In
  dom.mapZoomInBtn.addEventListener("click", () => {
    state.mapTransform.scale = Math.min(2.5, state.mapTransform.scale + 0.25);
    applyMapTransform();
  });

  // Zoom Out
  dom.mapZoomOutBtn.addEventListener("click", () => {
    state.mapTransform.scale = Math.max(0.65, state.mapTransform.scale - 0.25);
    applyMapTransform();
  });

  // Reset Map View
  dom.mapResetBtn.addEventListener("click", () => {
    resetMapView();
    showToast("Map view reset to default", "🗺️");
  });

  // Center on Selected
  dom.mapFitSelectionBtn.addEventListener("click", () => {
    if (state.selectedLocationId) {
      centerMapOnLocation(state.selectedLocationId);
    } else {
      showToast("Please select a building first", "ℹ️");
    }
  });

  // Legend Toggle
  dom.legendToggleBtn.addEventListener("click", () => {
    const isHidden = dom.legendBody.style.display === "none";
    dom.legendBody.style.display = isHidden ? "grid" : "none";
    dom.legendToggleBtn.textContent = isHidden ? "▾" : "▸";
  });

  // Mouse Drag Panning
  dom.mapViewport.addEventListener("mousedown", (e) => {
    // Only pan on left click and not on interactive buttons
    if (e.button !== 0 || e.target.closest("button") || e.target.closest(".map-legend-card")) return;
    state.isPanning = true;
    state.panStart = { x: e.clientX - state.mapTransform.x, y: e.clientY - state.mapTransform.y };
    dom.mapViewport.classList.add("is-dragging");
  });

  window.addEventListener("mousemove", (e) => {
    if (!state.isPanning) return;
    state.mapTransform.x = e.clientX - state.panStart.x;
    state.mapTransform.y = e.clientY - state.panStart.y;
    applyMapTransform();
  });

  window.addEventListener("mouseup", () => {
    if (state.isPanning) {
      state.isPanning = false;
      dom.mapViewport.classList.remove("is-dragging");
    }
  });

  // Mouse Wheel Zoom
  dom.mapViewport.addEventListener("wheel", (e) => {
    e.preventDefault();
    const zoomDelta = e.deltaY < 0 ? 0.15 : -0.15;
    const newScale = Math.min(2.5, Math.max(0.65, state.mapTransform.scale + zoomDelta));
    state.mapTransform.scale = newScale;
    applyMapTransform();
  }, { passive: false });

  // Touch Drag for Mobile
  let touchStartDist = 0;
  dom.mapViewport.addEventListener("touchstart", (e) => {
    if (e.touches.length === 1) {
      state.isPanning = true;
      state.panStart = { x: e.touches[0].clientX - state.mapTransform.x, y: e.touches[0].clientY - state.mapTransform.y };
    } else if (e.touches.length === 2) {
      touchStartDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
    }
  }, { passive: true });

  dom.mapViewport.addEventListener("touchmove", (e) => {
    if (e.touches.length === 1 && state.isPanning) {
      state.mapTransform.x = e.touches[0].clientX - state.panStart.x;
      state.mapTransform.y = e.touches[0].clientY - state.panStart.y;
      applyMapTransform();
    } else if (e.touches.length === 2) {
      const currentDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      if (touchStartDist > 0) {
        const factor = currentDist / touchStartDist;
        state.mapTransform.scale = Math.min(2.5, Math.max(0.65, state.mapTransform.scale * (factor > 1 ? 1.03 : 0.97)));
        applyMapTransform();
      }
    }
  }, { passive: true });

  dom.mapViewport.addEventListener("touchend", () => {
    state.isPanning = false;
    touchStartDist = 0;
  });
}

function applyMapTransform() {
  dom.mapPanZoomLayer.setAttribute(
    "transform",
    `translate(${state.mapTransform.x}, ${state.mapTransform.y}) scale(${state.mapTransform.scale})`
  );
}

function resetMapView() {
  state.mapTransform = { scale: 1, x: 0, y: 0 };
  applyMapTransform();
}

function centerMapOnLocation(placeId) {
  const loc = CAMPUS_LOCATIONS.find(l => l.id === placeId);
  if (!loc) return;

  // Center coordinate relative to viewport
  const viewportRect = dom.mapViewport.getBoundingClientRect();
  const targetScale = Math.max(1.2, state.mapTransform.scale);

  // SVG viewBox center is (600, 400)
  const offsetX = (600 - loc.x) * targetScale;
  const offsetY = (400 - loc.y) * targetScale;

  state.mapTransform = {
    scale: targetScale,
    x: offsetX,
    y: offsetY
  };
  applyMapTransform();
}

/* ============================================================================
   6. LOCATION EXPLORATION, SEARCH & LIVE AUTOCOMPLETE
   ============================================================================ */

function initExploreAndSearch() {
  renderPlacesList();
  renderFrequentTags();

  // Search Input Handler (Live suggestions)
  dom.globalSearchInput.addEventListener("input", (e) => {
    const query = e.target.value.trim().toLowerCase();
    if (query.length > 0) {
      dom.clearSearchBtn.style.display = "flex";
      showSearchSuggestions(query);
    } else {
      dom.clearSearchBtn.style.display = "none";
      dom.searchSuggestionsDropdown.style.display = "none";
    }
  });

  // Clear Search Button
  dom.clearSearchBtn.addEventListener("click", () => {
    dom.globalSearchInput.value = "";
    dom.clearSearchBtn.style.display = "none";
    dom.searchSuggestionsDropdown.style.display = "none";
    dom.globalSearchInput.focus();
  });

  // Close suggestions when clicking outside
  document.addEventListener("click", (e) => {
    if (!e.target.closest("#heroSearchWrapper")) {
      dom.searchSuggestionsDropdown.style.display = "none";
    }
  });

  // Keyboard navigation inside search
  dom.globalSearchInput.addEventListener("keydown", (e) => {
    const items = dom.searchSuggestionsList.querySelectorAll(".suggestion-item");
    const activeItem = dom.searchSuggestionsList.querySelector(".suggestion-item.highlighted");
    let index = Array.from(items).indexOf(activeItem);

    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (items.length > 0) {
        if (activeItem) activeItem.classList.remove("highlighted");
        index = (index + 1) % items.length;
        items[index].classList.add("highlighted");
        items[index].scrollIntoView({ block: "nearest" });
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (items.length > 0) {
        if (activeItem) activeItem.classList.remove("highlighted");
        index = (index - 1 + items.length) % items.length;
        items[index].classList.add("highlighted");
        items[index].scrollIntoView({ block: "nearest" });
      }
    } else if (e.key === "Enter") {
      if (activeItem) {
        e.preventDefault();
        const placeId = activeItem.getAttribute("data-place-id");
        selectFromSearch(placeId);
      }
    } else if (e.key === "Escape") {
      dom.searchSuggestionsDropdown.style.display = "none";
    }
  });

  // Quick Chips in Hero
  dom.quickChipsContainer.addEventListener("click", (e) => {
    const chip = e.target.closest(".chip-btn");
    if (!chip) return;
    const placeId = chip.getAttribute("data-place");
    handleSelectLocation(placeId, { centerMap: true, userInitiated: true });
    scrollToSection("dashboardMain");
  });

  // Floor Level Selector in Map Toolbar
  if (dom.floorSelectorGroup) {
    dom.floorSelectorGroup.addEventListener("click", (e) => {
      const btn = e.target.closest(".floor-btn");
      if (!btn) return;

      dom.floorSelectorGroup.querySelectorAll(".floor-btn").forEach(b => {
        b.classList.remove("active");
        b.setAttribute("aria-checked", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-checked", "true");

      state.activeFloorLevel = btn.getAttribute("data-floor");
      renderPlacesList();
      filterBuildingsOnMap(state.activeCategory, state.activeFloorLevel);

      const floorLabel = btn.textContent;
      showToast(`Switched view to ${floorLabel}`, "🏢");
    });
  }

  // Category Filter Pills
  dom.categoryFilters.addEventListener("click", (e) => {
    const pill = e.target.closest(".cat-pill");
    if (!pill) return;

    dom.categoryFilters.querySelectorAll(".cat-pill").forEach(p => {
      p.classList.remove("active");
      p.setAttribute("aria-checked", "false");
    });
    pill.classList.add("active");
    pill.setAttribute("aria-checked", "true");

    state.activeCategory = pill.getAttribute("data-category");
    renderPlacesList();
    filterBuildingsOnMap(state.activeCategory, state.activeFloorLevel);
  });

  // Reset Filters Button in empty state
  dom.resetFiltersBtn.addEventListener("click", () => {
    const allPill = document.getElementById("catAll");
    if (allPill) allPill.click();
    if (dom.floorSelectorGroup) {
      const allFloorBtn = dom.floorSelectorGroup.querySelector('[data-floor="all"]');
      if (allFloorBtn) allFloorBtn.click();
    }
  });

  // Preview Card Actions
  dom.previewCloseBtn.addEventListener("click", () => {
    dom.selectedPlacePreview.style.display = "none";
    unhighlightBuildingsOnMap();
    state.selectedLocationId = null;
  });

  dom.previewGetDirectionsBtn.addEventListener("click", () => {
    if (!state.selectedLocationId) return;
    dom.routeDestSelect.value = state.selectedLocationId;
    if (!dom.routeOriginSelect.value) {
      dom.routeOriginSelect.value = CAMPUS_CONFIG.defaultOrigin;
    }
    // Switch to Route Planner Tab
    dom.tabDirectionsMode.click();
    calculateAndDisplayRoute();
    showToast(`Destination set to ${getPlaceName(state.selectedLocationId)}`, "📍");
  });

  dom.previewSetOriginBtn.addEventListener("click", () => {
    if (!state.selectedLocationId) return;
    dom.routeOriginSelect.value = state.selectedLocationId;
    dom.tabDirectionsMode.click();
    showToast(`Starting point set to ${getPlaceName(state.selectedLocationId)}`, "🟢");
  });
}

function showSearchSuggestions(query) {
  const matches = CAMPUS_LOCATIONS.filter(place => {
    const nameMatch = place.name.toLowerCase().includes(query);
    const catMatch = place.category.toLowerCase().includes(query);
    const descMatch = place.description.toLowerCase().includes(query);
    const keywordMatch = place.keywords.some(k => k.toLowerCase().includes(query));
    return nameMatch || catMatch || descMatch || keywordMatch;
  });

  if (matches.length === 0) {
    dom.searchSuggestionsList.innerHTML = `
      <li class="no-sugg-item">
        No locations found matching "<strong>${escapeHtml(query)}</strong>". Try searching for AI Lab, Cafeteria, or Placement.
      </li>
    `;
    dom.searchSuggestionsDropdown.style.display = "block";
    return;
  }

  dom.searchSuggestionsList.innerHTML = matches.map((place, idx) => `
    <li class="suggestion-item ${idx === 0 ? 'highlighted' : ''}" data-place-id="${place.id}" role="option">
      <span class="sugg-icon">${place.icon}</span>
      <div class="sugg-content">
        <div class="sugg-header">
          <span class="sugg-name">${place.name}</span>
          <span class="sugg-cat">${place.category}</span>
        </div>
        <p class="sugg-desc">${place.description}</p>
      </div>
    </li>
  `).join("");

  dom.searchSuggestionsDropdown.style.display = "block";

  // Item click handlers
  dom.searchSuggestionsList.querySelectorAll(".suggestion-item").forEach(item => {
    item.addEventListener("click", () => {
      const placeId = item.getAttribute("data-place-id");
      selectFromSearch(placeId);
    });
  });
}

function selectFromSearch(placeId) {
  dom.searchSuggestionsDropdown.style.display = "none";
  dom.globalSearchInput.value = "";
  dom.clearSearchBtn.style.display = "none";
  handleSelectLocation(placeId, { centerMap: true, userInitiated: true });
  scrollToSection("dashboardMain");
}

function renderPlacesList() {
  const filtered = CAMPUS_LOCATIONS.filter(place => {
    const catMatch = state.activeCategory === "all" || place.category.toLowerCase() === state.activeCategory.toLowerCase();
    const floorMatch = state.activeFloorLevel === "all" || (place.floorLevel === state.activeFloorLevel) || (place.floorLevel === "campus" && state.activeFloorLevel === "L0");
    return catMatch && floorMatch;
  });

  dom.locationCountBadge.textContent = `${filtered.length} Place${filtered.length === 1 ? '' : 's'}`;

  if (filtered.length === 0) {
    dom.placesList.innerHTML = "";
    dom.noPlacesFound.style.display = "block";
    return;
  }

  dom.noPlacesFound.style.display = "none";
  dom.placesList.innerHTML = filtered.map(place => `
    <div class="place-item-card ${state.selectedLocationId === place.id ? 'selected' : ''}" data-id="${place.id}" tabindex="0">
      <div class="place-icon-box">${place.icon}</div>
      <div class="place-info-box">
        <div class="place-title-row">
          <h4 class="place-name">${place.name}</h4>
          <span class="place-category-badge">${place.category}</span>
        </div>
        <p class="place-snippet">${place.description}</p>
        <div class="place-footer-row">
          <span class="place-hours">${place.hours}</span>
          ${place.tourNode ? '<span class="place-access-indicator" style="color:var(--primary-600);font-weight:700;">📷 360° Tour</span>' : '<span class="place-access-indicator">♿ Accessible</span>'}
        </div>
      </div>
    </div>
  `).join("");

  // Place click handlers
  dom.placesList.querySelectorAll(".place-item-card").forEach(card => {
    card.addEventListener("click", () => {
      const placeId = card.getAttribute("data-id");
      handleSelectLocation(placeId, { centerMap: true, userInitiated: true });
    });
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const placeId = card.getAttribute("data-id");
        handleSelectLocation(placeId, { centerMap: true, userInitiated: true });
      }
    });
  });
}

function renderFrequentTags() {
  const frequentList = ["ai_lab", "canteen_cdsimer", "food_truck", "soe_lobby", "placement_wing", "cdsimer", "parking_4w"];
  dom.frequentTagsList.innerHTML = frequentList.map(id => {
    const p = CAMPUS_LOCATIONS.find(l => l.id === id);
    if (!p) return "";
    return `<button class="frequent-chip" data-id="${p.id}">${p.icon} ${p.name}</button>`;
  }).join("");

  dom.frequentTagsList.querySelectorAll(".frequent-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      const placeId = chip.getAttribute("data-id");
      handleSelectLocation(placeId, { centerMap: true, userInitiated: true });
    });
  });
}

function handleSelectLocation(placeId, options = { centerMap: false, userInitiated: false }) {
  const place = CAMPUS_LOCATIONS.find(l => l.id === placeId);
  if (!place) return;

  state.selectedLocationId = placeId;

  // Highlight Card in places list
  dom.placesList.querySelectorAll(".place-item-card").forEach(c => {
    c.classList.toggle("selected", c.getAttribute("data-id") === placeId);
  });

  // Highlight Building on SVG Map
  dom.mapBuildingsLayer.querySelectorAll(".campus-building").forEach(b => {
    const isThis = b.getAttribute("data-id") === placeId;
    b.classList.toggle("is-selected", isThis);
    b.classList.toggle("is-dimmed", !isThis);
  });

  // Update Detail Preview Card
  dom.previewCategoryTag.textContent = place.category;
  if (dom.previewFloorTag) {
    dom.previewFloorTag.textContent = place.floorLevel ? (place.floorLevel === "campus" ? "Ground Campus" : `Level ${place.floorLevel.replace("L","")}`) : "Ground Level";
  }
  dom.previewTitle.textContent = place.name;
  dom.previewDesc.textContent = place.description;
  dom.previewHoursText.textContent = place.hours;
  dom.previewFloorsText.textContent = place.roomNumber ? `${place.floors} • ${place.roomNumber}` : place.floors;
  if (dom.previewDeptText) {
    dom.previewDeptText.textContent = place.dept || place.category;
  }

  // Update 360 Virtual Tour Snapshot
  if (dom.previewTourSnapshot && dom.previewTourImg) {
    if (place.tourImage) {
      dom.previewTourImg.src = place.tourImage;
      if (dom.previewTourLink) {
        dom.previewTourLink.href = `${CAMPUS_CONFIG.virtualTourBaseUrl}#${place.tourNode || ''}`;
      }
      dom.previewTourSnapshot.style.display = "block";
    } else {
      dom.previewTourSnapshot.style.display = "none";
    }
  }

  dom.selectedPlacePreview.style.display = "block";

  // Center map if requested
  if (options.centerMap) {
    centerMapOnLocation(placeId);
  }

  // Update hint banner
  dom.mapHintText.textContent = `Selected: ${place.name} (${place.category}) • Click 'Get Directions' to plan route.`;

  if (options.userInitiated) {
    showToast(`Selected ${place.name}`, place.icon);
  }
}

function filterBuildingsOnMap(category, floorLevel = state.activeFloorLevel) {
  dom.mapBuildingsLayer.querySelectorAll(".campus-building").forEach(b => {
    const placeId = b.getAttribute("data-id");
    const place = CAMPUS_LOCATIONS.find(l => l.id === placeId);
    if (!place) return;

    const catMatch = (category === "all" || place.category.toLowerCase() === category.toLowerCase());
    const floorMatch = (floorLevel === "all" || place.floorLevel === floorLevel || (place.floorLevel === "campus" && floorLevel === "L0"));

    if (catMatch && floorMatch) {
      b.classList.remove("is-dimmed");
    } else {
      b.classList.add("is-dimmed");
    }
  });
}

function unhighlightBuildingsOnMap() {
  dom.mapBuildingsLayer.querySelectorAll(".campus-building").forEach(b => {
    b.classList.remove("is-selected");
    b.classList.remove("is-dimmed");
  });
  dom.mapHintText.textContent = "Click any building to view details, or drag to pan the campus.";
}

/* ============================================================================
   7. ROUTE PLANNER & GUIDED WALK DEMO
   ============================================================================ */

function populateRouteDropdowns() {
  const sorted = [...CAMPUS_LOCATIONS].sort((a, b) => a.name.localeCompare(b.name));
  
  const optionsHtml = sorted.map(loc => 
    `<option value="${loc.id}">${loc.icon} ${loc.name} (${loc.category})</option>`
  ).join("");

  dom.routeOriginSelect.innerHTML = `<option value="">Select Starting Point...</option>` + optionsHtml;
  dom.routeDestSelect.innerHTML = `<option value="">Select Destination...</option>` + optionsHtml;

  // Set initial demo defaults
  dom.routeOriginSelect.value = CAMPUS_CONFIG.defaultOrigin;
  dom.routeDestSelect.value = CAMPUS_CONFIG.defaultDestination;
}

function initRoutePlanner() {
  // Swap Locations Button
  dom.swapLocationsBtn.addEventListener("click", () => {
    const temp = dom.routeOriginSelect.value;
    dom.routeOriginSelect.value = dom.routeDestSelect.value;
    dom.routeDestSelect.value = temp;

    if (dom.routeOriginSelect.value && dom.routeDestSelect.value) {
      calculateAndDisplayRoute();
      showToast("Starting point & destination swapped", "⇄");
    }
  });

  // Accessible Route Toggle
  dom.accessibleOnlyToggle.addEventListener("change", (e) => {
    state.accessibleOnly = e.target.checked;
    if (dom.routeOriginSelect.value && dom.routeDestSelect.value) {
      calculateAndDisplayRoute();
      showToast(state.accessibleOnly ? "Accessible routes mode activated" : "Standard shortest routes mode activated", "♿");
    }
  });

  // Calculate Route Button
  dom.calculateRouteBtn.addEventListener("click", () => {
    calculateAndDisplayRoute();
  });

  // Clear Route Button
  dom.clearRouteBtn.addEventListener("click", () => {
    clearActiveRoute();
    showToast("Active route cleared", "🗑️");
  });

  dom.chipClearRouteBtn.addEventListener("click", () => {
    clearActiveRoute();
  });

  // Quick Plan Demo Button
  dom.quickPlanDemoBtn.addEventListener("click", () => {
    dom.routeOriginSelect.value = "gate";
    dom.routeDestSelect.value = "canteen_cdsimer";
    calculateAndDisplayRoute();
  });

  // Start Guided Navigation Demo
  dom.startNavDemoBtn.addEventListener("click", () => {
    startGuidedWalkDemo();
  });

  dom.nextStepBtn.addEventListener("click", () => {
    advanceNavDemo(1);
  });

  dom.prevStepBtn.addEventListener("click", () => {
    advanceNavDemo(-1);
  });

  dom.stopNavDemoBtn.addEventListener("click", () => {
    stopGuidedWalkDemo();
  });
}

function calculateAndDisplayRoute() {
  const originId = dom.routeOriginSelect.value;
  const destId = dom.routeDestSelect.value;

  if (!originId || !destId) {
    showToast("Please select both origin and destination", "⚠️");
    return;
  }

  if (originId === destId) {
    showToast("Origin and destination are the same building", "ℹ️");
    return;
  }

  const result = findShortestRoute(originId, destId, state.accessibleOnly);

  if (!result.success) {
    showToast(result.error, "⚠️");
    return;
  }

  state.activeRoute = result;
  state.routeOriginId = originId;
  state.routeDestId = destId;

  // Render on SVG Map
  renderActiveRouteOnMap(result);

  // Update Summary Metrics
  dom.routeDistValue.textContent = `${result.totalDistance} m`;
  dom.routeTimeValue.textContent = `${result.walkingTimeMinutes} min`;
  
  if (result.isAccessible) {
    dom.routeAccessBadge.textContent = "✓ 100% Paved & Step-Free";
    dom.routeAccessBadge.style.color = "var(--accent-emerald)";
  } else {
    dom.routeAccessBadge.textContent = "⚠️ Contains Stairs / Steps";
    dom.routeAccessBadge.style.color = "var(--accent-amber)";
  }

  // Render Turn-by-Turn Steps
  dom.stepsCountText.textContent = `${result.steps.length} steps`;
  dom.turnStepsList.innerHTML = result.steps.map((step, idx) => `
    <li class="turn-step-item" id="navStepItem_${idx}">
      <span class="step-num-icon">${idx + 1}</span>
      <div class="step-content">
        <p class="step-instruction">${step.instruction}</p>
        <span class="step-meta">
          ${step.distance} m ${step.accessible ? '• ♿ Accessible Path' : '• ⚠️ Steps'}
        </span>
      </div>
    </li>
  `).join("");

  dom.plannerEmptyState.style.display = "none";
  dom.routeResultCard.style.display = "block";

  // Fit map view to encompass both start & end
  fitMapToRoute(result.path);

  showToast(`Route found: ${result.totalDistance}m (${result.walkingTimeMinutes} min walk)`, "🚶");
}

function clearActiveRoute() {
  state.activeRoute = null;
  state.isDemoNavigating = false;
  dom.mapRouteLayer.innerHTML = "";
  dom.mapPinsLayer.innerHTML = "";
  dom.activeRouteChip.style.display = "none";
  dom.routeResultCard.style.display = "none";
  dom.plannerEmptyState.style.display = "flex";
  stopGuidedWalkDemo();
}

function fitMapToRoute(nodeIds) {
  if (!nodeIds || nodeIds.length === 0) return;

  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (const id of nodeIds) {
    const node = GRAPH_NODES[id];
    if (node) {
      minX = Math.min(minX, node.x);
      maxX = Math.max(maxX, node.x);
      minY = Math.min(minY, node.y);
      maxY = Math.max(maxY, node.y);
    }
  }

  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;

  // Center smoothly
  const targetScale = 1.05;
  state.mapTransform = {
    scale: targetScale,
    x: (600 - centerX) * targetScale,
    y: (400 - centerY) * targetScale
  };
  applyMapTransform();
}

/**
 * Guided Walk Step-by-Step Simulation
 */
function startGuidedWalkDemo() {
  if (!state.activeRoute || !state.activeRoute.steps || state.activeRoute.steps.length === 0) return;

  state.isDemoNavigating = true;
  state.activeDemoStepIndex = 0;

  dom.navDemoControls.style.display = "block";
  dom.startNavDemoBtn.style.display = "none";

  updateNavDemoStepUI();
  showToast("Guided Walk demo active: Use Next/Prev to simulate movement", "🧭");
}

function advanceNavDemo(delta) {
  if (!state.activeRoute) return;
  const newIndex = state.activeDemoStepIndex + delta;
  if (newIndex >= 0 && newIndex < state.activeRoute.steps.length) {
    state.activeDemoStepIndex = newIndex;
    updateNavDemoStepUI();
  }
}

function updateNavDemoStepUI() {
  const steps = state.activeRoute.steps;
  const currIndex = state.activeDemoStepIndex;

  // Update Progress Bar
  const progressPercent = Math.round(((currIndex + 1) / steps.length) * 100);
  dom.demoProgressFill.style.width = `${progressPercent}%`;
  dom.demoStepText.textContent = `Step ${currIndex + 1} of ${steps.length}`;

  // Next / Prev button states
  dom.prevStepBtn.disabled = currIndex === 0;
  dom.nextStepBtn.disabled = currIndex === steps.length - 1;

  // Highlight step in list
  dom.turnStepsList.querySelectorAll(".turn-step-item").forEach((item, idx) => {
    item.classList.toggle("is-current-step", idx === currIndex);
    if (idx === currIndex) {
      item.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  });

  // Move camera to current step node
  const currStep = steps[currIndex];
  const targetNode = GRAPH_NODES[currStep.to];
  if (targetNode) {
    centerMapOnCoordinate(targetNode.x, targetNode.y);
  }
}

function stopGuidedWalkDemo() {
  state.isDemoNavigating = false;
  state.activeDemoStepIndex = 0;
  dom.navDemoControls.style.display = "none";
  dom.startNavDemoBtn.style.display = "flex";

  dom.turnStepsList.querySelectorAll(".turn-step-item").forEach(item => {
    item.classList.remove("is-current-step");
  });
}

function centerMapOnCoordinate(x, y) {
  const scale = 1.25;
  state.mapTransform = {
    scale,
    x: (600 - x) * scale,
    y: (400 - y) * scale
  };
  applyMapTransform();
}

/* ============================================================================
   8. AI CAMPUS ASSISTANT ENGINE (NATURAL LANGUAGE & INTENTS)
   ============================================================================ */

function initAiAssistant() {
  // Tab switching between Route Planner and AI Assistant
  dom.tabDirectionsMode.addEventListener("click", () => {
    dom.tabDirectionsMode.classList.add("active");
    dom.tabDirectionsMode.setAttribute("aria-selected", "true");
    dom.tabAssistantMode.classList.remove("active");
    dom.tabAssistantMode.setAttribute("aria-selected", "false");

    dom.routePanelWrapper.style.display = "flex";
    dom.assistantPanelWrapper.style.display = "none";
  });

  dom.tabAssistantMode.addEventListener("click", () => {
    dom.tabAssistantMode.classList.add("active");
    dom.tabAssistantMode.setAttribute("aria-selected", "true");
    dom.tabDirectionsMode.classList.remove("active");
    dom.tabDirectionsMode.setAttribute("aria-selected", "false");

    dom.assistantPanelWrapper.style.display = "flex";
    dom.routePanelWrapper.style.display = "none";
    dom.chatTextInput.focus();
  });

  // Suggested Prompts
  dom.promptsScroll.addEventListener("click", (e) => {
    const chip = e.target.closest(".prompt-chip");
    if (!chip) return;
    const query = chip.getAttribute("data-query");
    submitUserQuery(query);
  });

  // Chat Form Submission
  dom.chatInputForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const query = dom.chatTextInput.value.trim();
    if (!query) return;
    submitUserQuery(query);
    dom.chatTextInput.value = "";
  });

  // Clear Chat History
  dom.clearChatBtn.addEventListener("click", () => {
    dom.chatMessagesContainer.innerHTML = `
      <div class="chat-msg msg-assistant">
        <div class="msg-avatar-badge">AI</div>
        <div class="msg-bubble">
          <p>Chat cleared! How can I assist you with campus directions or facilities?</p>
          <span class="msg-time">Just now</span>
        </div>
      </div>
    `;
    showToast("Chat history cleared", "🧹");
  });
}

function submitUserQuery(userText) {
  // 1. Append User Message
  appendChatMessage("user", userText);

  // 2. Show Typing Indicator
  dom.chatTypingIndicator.style.display = "flex";
  dom.chatMessagesContainer.scrollTop = dom.chatMessagesContainer.scrollHeight;

  // 3. Process Intent with slight realistic delay (400ms)
  setTimeout(() => {
    dom.chatTypingIndicator.style.display = "none";
    const response = processCampusIntent(userText);
    appendChatMessage("assistant", response.text, response.actions);
    dom.chatMessagesContainer.scrollTop = dom.chatMessagesContainer.scrollHeight;

    // Trigger associated action if any (e.g. routing or highlighting)
    if (response.trigger) {
      response.trigger();
    }
  }, 450);
}

function appendChatMessage(sender, text, actions = []) {
  const msgDiv = document.createElement("div");
  msgDiv.className = `chat-msg msg-${sender}`;

  const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  let actionsMarkup = "";
  if (actions && actions.length > 0) {
    actionsMarkup = `
      <div class="chat-action-pills">
        ${actions.map((act, i) => `<button class="chat-action-btn" data-act-idx="${i}">${act.label}</button>`).join("")}
      </div>
    `;
  }

  msgDiv.innerHTML = `
    <div class="msg-avatar-badge">${sender === 'user' ? 'You' : 'AI'}</div>
    <div class="msg-bubble">
      <div>${text}</div>
      ${actionsMarkup}
      <span class="msg-time">${timeStr}</span>
    </div>
  `;

  // Attach action button clicks
  if (actions && actions.length > 0) {
    const actionBtns = msgDiv.querySelectorAll(".chat-action-btn");
    actionBtns.forEach((btn, idx) => {
      btn.addEventListener("click", () => {
        actions[idx].handler();
      });
    });
  }

  dom.chatMessagesContainer.appendChild(msgDiv);
  dom.chatMessagesContainer.scrollTop = dom.chatMessagesContainer.scrollHeight;
}

/**
 * Natural Language Rule & Intent Parser
 */
function processCampusIntent(rawQuery) {
  const query = rawQuery.toLowerCase();

  // 1. Check for Point A to Point B Directions
  // Patterns like "from X to Y", "to Y from X", "how to reach Y from X", "directions to Y from X"
  const routeIntent = detectRouteIntent(query);
  if (routeIntent) {
    return {
      text: `Certainly! I've calculated the shortest route from <strong>${routeIntent.origin.name}</strong> to <strong>${routeIntent.dest.name}</strong>. The route is displayed on the campus map.`,
      actions: [
        {
          label: "View Turn-by-Turn Steps",
          handler: () => dom.tabDirectionsMode.click()
        },
        {
          label: "Show on Map",
          handler: () => {
            scrollToSection("mapSection");
            centerMapOnLocation(routeIntent.dest.id);
          }
        }
      ],
      trigger: () => {
        dom.routeOriginSelect.value = routeIntent.origin.id;
        dom.routeDestSelect.value = routeIntent.dest.id;
        calculateAndDisplayRoute();
      }
    };
  }

  // 2. Check for Specific Building Location Queries
  // Patterns like "where is the library", "locate cse", "show cafeteria"
  const locationMatch = findLocationInText(query);
  if (locationMatch && (query.includes("where") || query.includes("show") || query.includes("locate") || query.includes("find") || query.includes("how to get to") || query.includes("reach"))) {
    return {
      text: `<strong>${locationMatch.name}</strong> (${locationMatch.category}) is located at coordinates (${locationMatch.x}, ${locationMatch.y}) on campus. ${locationMatch.description}`,
      actions: [
        {
          label: "Highlight on Map",
          handler: () => {
            handleSelectLocation(locationMatch.id, { centerMap: true, userInitiated: true });
            scrollToSection("mapSection");
          }
        },
        {
          label: "Directions From Main Gate",
          handler: () => {
            dom.routeOriginSelect.value = "gate";
            dom.routeDestSelect.value = locationMatch.id;
            dom.tabDirectionsMode.click();
            calculateAndDisplayRoute();
          }
        }
      ],
      trigger: () => {
        handleSelectLocation(locationMatch.id, { centerMap: true, userInitiated: false });
      }
    };
  }

  // 3. AI / Computing Block & Floor Queries
  if (query.includes("ai") || query.includes("artificial intelligence") || query.includes("machine learning") || query.includes("dennis ritchie") || query.includes("data science") || query.includes("gpu")) {
    return {
      text: `The <strong>Dennis M. Ritchie Artificial Intelligence Lab</strong> (Node 19) is located on <strong>Level 1 (First Floor)</strong> in the Computing Wing (B-Block). It houses high-performance GPU workstations for Deep Learning, Computer Vision, and Data Science. Next door on Level 1 is the <strong>John Von Neumann IoT Lab</strong> (Node 13) and <strong>Gordon Moore Microcontroller Lab</strong> (Node 20).`,
      actions: [
        {
          label: "Show AI Lab (Level 1)",
          handler: () => {
            const l1Btn = dom.floorSelectorGroup ? dom.floorSelectorGroup.querySelector('[data-floor="L1"]') : null;
            if (l1Btn) l1Btn.click();
            handleSelectLocation("ai_lab", { centerMap: true, userInitiated: true });
          }
        },
        {
          label: "Directions From Main Gate",
          handler: () => {
            dom.routeOriginSelect.value = "gate";
            dom.routeDestSelect.value = "ai_lab";
            dom.tabDirectionsMode.click();
            calculateAndDisplayRoute();
          }
        }
      ],
      trigger: () => handleSelectLocation("ai_lab", { centerMap: true, userInitiated: false })
    };
  }

  // 4. Food / Dining Queries (Indoor Canteen vs Food Truck)
  if (query.includes("food") || query.includes("eat") || query.includes("hungry") || query.includes("coffee") || query.includes("canteen") || query.includes("cafeteria") || query.includes("lunch") || query.includes("breakfast") || query.includes("dinner") || query.includes("snack") || query.includes("truck")) {
    return {
      text: `You have 3 great dining options on campus:
      <br>• <strong>CDSIMER Cafeteria (Indoor)</strong> (Node 131): Located on the <em>Ground Floor inside the CDSIMER building</em> (07:30 AM – 09:30 PM), serving hygienic hot South & North Indian meals, breakfast, and bakery items.
      <br>• <strong>Campus Food Truck</strong> (Node 193): Outdoor quick-service kiosk on the promenade with sun umbrella patio seating facing the Lawn.
      <br>• <strong>Hospital Staff Canteen</strong> (Node 243): 24/7 express cafeteria in the hospital wing.`,
      actions: [
        {
          label: "Show CDSIMER Indoor Cafeteria",
          handler: () => handleSelectLocation("canteen_cdsimer", { centerMap: true, userInitiated: true })
        },
        {
          label: "Show Campus Food Truck",
          handler: () => handleSelectLocation("food_truck", { centerMap: true, userInitiated: true })
        },
        {
          label: "Directions to Cafeteria",
          handler: () => {
            dom.routeOriginSelect.value = "gate";
            dom.routeDestSelect.value = "canteen_cdsimer";
            dom.tabDirectionsMode.click();
            calculateAndDisplayRoute();
          }
        }
      ],
      trigger: () => handleSelectLocation("canteen_cdsimer", { centerMap: true, userInitiated: false })
    };
  }

  // 5. Parking Queries (4W vs 2W)
  if (query.includes("parking") || query.includes("car") || query.includes("bike") || query.includes("vehicle") || query.includes("scooter") || query.includes("park")) {
    const is2W = query.includes("bike") || query.includes("scooter") || query.includes("2 wheeler") || query.includes("two");
    const targetParking = is2W ? "parking_2w" : "parking_4w";
    return {
      text: `Campus parking infrastructure:
      <br>• <strong>4-Wheeler Main Parking</strong> (Node 178): Located right by the SOE Main Entrance Gate with 150+ dedicated bays for faculty, visitors, and ambulance access.
      <br>• <strong>2-Wheeler Student Parking</strong>: Dedicated surface parking along the west perimeter near the Mechanical complex.`,
      actions: [
        {
          label: is2W ? "Show 2W Parking" : "Show 4W Parking",
          handler: () => handleSelectLocation(targetParking, { centerMap: true, userInitiated: true })
        },
        {
          label: "Route From Main Gate",
          handler: () => {
            dom.routeOriginSelect.value = "gate";
            dom.routeDestSelect.value = targetParking;
            dom.tabDirectionsMode.click();
            calculateAndDisplayRoute();
          }
        }
      ],
      trigger: () => handleSelectLocation(targetParking, { centerMap: true, userInitiated: false })
    };
  }

  // 6. Placement & Career Cell Queries
  if (query.includes("placement") || query.includes("interview") || query.includes("career") || query.includes("job") || query.includes("recruitment")) {
    return {
      text: `The <strong>Corporate Relations & Placement Wing</strong> (Node 22) is situated on <strong>Level 3 (Third Floor)</strong> of the School of Engineering complex, featuring interview suites, executive briefing halls, and student training rooms.`,
      actions: [
        {
          label: "Show Placement Wing (Level 3)",
          handler: () => {
            const l3Btn = dom.floorSelectorGroup ? dom.floorSelectorGroup.querySelector('[data-floor="L3"]') : null;
            if (l3Btn) l3Btn.click();
            handleSelectLocation("placement_wing", { centerMap: true, userInitiated: true });
          }
        }
      ],
      trigger: () => handleSelectLocation("placement_wing", { centerMap: true, userInitiated: false })
    };
  }

  // 7. Accessibility Queries
  if (query.includes("accessible") || query.includes("wheelchair") || query.includes("ramp") || query.includes("disability") || query.includes("elevator")) {
    return {
      text: `<strong>CampusNav AI</strong> supports step-free wheelchair routing across DSU Harohalli Campus. By enabling <strong>'Accessible Route Only'</strong>, navigation avoids stairs and routes via smooth paved ramps into B-Block, SOE Central Atrium, and CDSIMER Medical Complex.`,
      actions: [
        {
          label: "Enable Accessible Mode",
          handler: () => {
            dom.accessibleOnlyToggle.checked = true;
            dom.accessibleOnlyToggle.dispatchEvent(new Event("change"));
            dom.tabDirectionsMode.click();
          }
        }
      ]
    };
  }

  // 8. Generic Place Mention
  if (locationMatch) {
    return {
      text: `Found <strong>${locationMatch.name}</strong> (${locationMatch.category}). Hours: ${locationMatch.hours}. ${locationMatch.description}`,
      actions: [
        {
          label: "Show on Map",
          handler: () => handleSelectLocation(locationMatch.id, { centerMap: true, userInitiated: true })
        },
        {
          label: "Directions to Here",
          handler: () => {
            dom.routeDestSelect.value = locationMatch.id;
            dom.tabDirectionsMode.click();
            calculateAndDisplayRoute();
          }
        }
      ],
      trigger: () => handleSelectLocation(locationMatch.id, { centerMap: true, userInitiated: false })
    };
  }

  // 9. General Help & Fallback
  return {
    text: `I can help you navigate <strong>${CAMPUS_CONFIG.campusName}</strong>! Ask questions such as:
    <br>• <em>"Which floor is the Artificial Intelligence Lab on?"</em>
    <br>• <em>"Where is the indoor canteen inside CDSIMER?"</em>
    <br>• <em>"How do I reach the 4-Wheeler Parking from Main Gate?"</em>
    <br>• <em>"Where is the Placement Wing?"</em>
    <br><br><small style="color:var(--text-muted);">Loaded with official 360° virtual tour data and interactive floor levels.</small>`,
    actions: [
      {
        label: "Take Me to AI Lab (L1)",
        handler: () => {
          dom.routeOriginSelect.value = "gate";
          dom.routeDestSelect.value = "ai_lab";
          dom.tabDirectionsMode.click();
          calculateAndDisplayRoute();
        }
      }
    ]
  };
}

function detectRouteIntent(query) {
  // Check for "from X to Y"
  const fromToMatch = query.match(/from\s+([a-z0-9\s]+?)\s+to\s+([a-z0-9\s]+)/i);
  if (fromToMatch) {
    const origin = findLocationInText(fromToMatch[1]);
    const dest = findLocationInText(fromToMatch[2]);
    if (origin && dest) return { origin, dest };
  }

  // Check for "to Y from X"
  const toFromMatch = query.match(/(?:to|reach|get to)\s+([a-z0-9\s]+?)\s+from\s+([a-z0-9\s]+)/i);
  if (toFromMatch) {
    const dest = findLocationInText(toFromMatch[1]);
    const origin = findLocationInText(toFromMatch[2]);
    if (origin && dest) return { origin, dest };
  }

  return null;
}

function findLocationInText(text) {
  const clean = text.toLowerCase();
  
  // Exact name or ID match first
  for (const place of CAMPUS_LOCATIONS) {
    if (clean.includes(place.name.toLowerCase()) || clean.includes(place.id)) {
      return place;
    }
  }

  // Keyword match
  for (const place of CAMPUS_LOCATIONS) {
    for (const kw of place.keywords) {
      if (clean.includes(kw.toLowerCase())) {
        return place;
      }
    }
  }

  return null;
}

/* ============================================================================
   9. THEME SWITCHER & MOBILE TABS
   ============================================================================ */

function initThemeAndMobile() {
  // Theme Toggle
  const savedTheme = localStorage.getItem("campusnav_theme") || "light";
  setTheme(savedTheme);

  dom.themeToggleBtn.addEventListener("click", () => {
    const newTheme = state.theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    showToast(`Switched to ${newTheme} theme`, newTheme === "dark" ? "🌙" : "☀️");
  });

  // Mobile Tabs
  dom.mobileViewTabs.addEventListener("click", (e) => {
    const btn = e.target.closest(".view-tab-btn");
    if (!btn) return;

    dom.mobileViewTabs.querySelectorAll(".view-tab-btn").forEach(b => {
      b.classList.remove("active");
      b.setAttribute("aria-selected", "false");
    });
    btn.classList.add("active");
    btn.setAttribute("aria-selected", "true");

    const targetId = btn.getAttribute("data-target");
    activateMobilePanel(targetId);
  });

  // Mobile Menu Button
  dom.mobileMenuBtn.addEventListener("click", () => {
    const links = document.getElementById("navLinks");
    const isVisible = links.style.display === "flex";
    links.style.display = isVisible ? "none" : "flex";
    if (!isVisible) {
      links.style.position = "absolute";
      links.style.top = "70px";
      links.style.left = "0";
      links.style.right = "0";
      links.style.backgroundColor = "var(--bg-panel)";
      links.style.flexDirection = "column";
      links.style.padding = "1rem";
      links.style.borderBottom = "1px solid var(--border-color)";
      links.style.boxShadow = "var(--shadow-lg)";
    }
  });

  // Smooth Navigation links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function(e) {
      const targetId = this.getAttribute("href").substring(1);
      const targetElem = document.getElementById(targetId);
      if (targetElem) {
        e.preventDefault();
        targetElem.scrollIntoView({ behavior: "smooth" });
        // In mobile view, activate panel if needed
        if (window.innerWidth <= 860) {
          if (targetId === "explorePanel") activateMobileTab("tabBtnExplore", "explorePanel");
          if (targetId === "mapSection") activateMobileTab("tabBtnMap", "mapSection");
          if (targetId === "plannerPanel") activateMobileTab("tabBtnRoute", "routePanelWrapper");
          if (targetId === "assistantPanel") activateMobileTab("tabBtnAssistant", "assistantPanelWrapper");
        }
      }
    });
  });

  // Ensure desktop panels restore on resize
  window.addEventListener("resize", () => {
    if (window.innerWidth > 860) {
      document.querySelectorAll(".dashboard-grid > .panel").forEach(p => {
        p.style.display = "";
        p.classList.remove("mobile-active");
      });
    }
  });
}

function setTheme(theme) {
  state.theme = theme;
  document.body.className = theme === "dark" ? "theme-dark" : "theme-light";
  localStorage.setItem("campusnav_theme", theme);
}

function activateMobilePanel(targetId) {
  const explorePanel = document.getElementById("explorePanel");
  const mapSection = document.getElementById("mapSection");
  const rightPanel = document.getElementById("rightPanel");

  // Reset
  [explorePanel, mapSection, rightPanel].forEach(p => {
    p.classList.remove("mobile-active");
    p.style.display = "none";
  });

  if (targetId === "explorePanel") {
    explorePanel.classList.add("mobile-active");
    explorePanel.style.display = "flex";
  } else if (targetId === "mapSection") {
    mapSection.classList.add("mobile-active");
    mapSection.style.display = "flex";
    applyMapTransform();
  } else if (targetId === "routePanelWrapper") {
    rightPanel.classList.add("mobile-active");
    rightPanel.style.display = "flex";
    dom.tabDirectionsMode.click();
  } else if (targetId === "assistantPanelWrapper") {
    rightPanel.classList.add("mobile-active");
    rightPanel.style.display = "flex";
    dom.tabAssistantMode.click();
  }
}

function activateMobileTab(tabBtnId, targetPanelId) {
  const btn = document.getElementById(tabBtnId);
  if (btn) btn.click();
}

/* ============================================================================
   10. UTILITY FUNCTIONS & TOAST SYSTEM
   ============================================================================ */

function showToast(message, icon = "✦") {
  const toast = document.createElement("div");
  toast.className = "toast-msg";
  toast.innerHTML = `<span class="toast-icon">${icon}</span> <span>${escapeHtml(message)}</span>`;

  dom.toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("toast-exit");
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 250);
  }, 3200);
}

function getPlaceName(placeId) {
  const p = CAMPUS_LOCATIONS.find(l => l.id === placeId);
  return p ? p.name : placeId;
}

function scrollToSection(sectionId) {
  const el = document.getElementById(sectionId);
  if (el) {
    el.scrollIntoView({ behavior: "smooth" });
  }
}

function escapeHtml(str) {
  if (!str) return "";
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/* ============================================================================
   11. APPLICATION INITIALIZATION
   ============================================================================ */

document.addEventListener("DOMContentLoaded", () => {
  initDomReferences();
  renderCampusSvgBase();
  initMapInteractions();
  initExploreAndSearch();
  initRoutePlanner();
  initAiAssistant();
  initThemeAndMobile();

  // Set initial chat timestamp
  if (dom.initialChatTime) {
    dom.initialChatTime.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  // Pre-calculate demo default route for an immediate visual wow factor
  setTimeout(() => {
    calculateAndDisplayRoute();
  }, 200);
});

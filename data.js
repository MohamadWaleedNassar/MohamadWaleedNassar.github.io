/* ------------------------------------------------------------------
   All site content lives here. Edit text, numbers and links in this
   file only; no build step is needed. Every figure comes from your
   CV (Oct 2026 version): make sure you can defend each one.
------------------------------------------------------------------- */

window.SITE = {
  name: "Mohamad Waleed Nassar",
  email: "mohammadwaleednassar@gmail.com",
  linkedin: "https://www.linkedin.com/in/mohamad-waleed-nassar",
  github: "https://github.com/MohamadWaleedNassar",
  cv: "assets/Mohamad-Waleed-Nassar-CV.pdf"
};

/* Numbers shown in the hero strip (count up on load) */
window.STATS = [
  { value: 14,   suffix: "",  label: "ECUs diagnosed at end of line" },
  { value: 200,  suffix: "+", label: "recurring EOL failures resolved" },
  { value: 3000, suffix: "+", label: "vehicles with ECU records in the Aftersales portal" },
  { value: 4,    suffix: "",  label: "PY1B variants validated" }
];

/* Rotating role line in the hero */
window.ROLES = [
  "UDS over CAN diagnostics",
  "SIDIS and VEP end-of-line validation",
  "Python and API tooling for production",
  "new-model launch readiness"
];

/* Nodes of the interactive system map. `case` links to a case file id. */
window.MAP = {
  nodes: [
    { id: "ecu",   col: 0, row: 1, label: "Vehicle ECUs",        sub: "14 ECUs, 4 variants",
      text: "The ECUs on every PY1B vehicle: the source of every DTC, configuration identifier and software version the rest of the chain depends on." },
    { id: "vep",   col: 1, row: 1, label: "VEP end-of-line",     sub: "UDS over CAN",
      text: "The Vehicle Electronic Process reads and writes ECU data over UDS on CAN at the end of the line: DTC read/clear, DID read/write and routine control.", case: "vep" },
    { id: "sidis", col: 2, row: 1, label: "SIDIS database",      sub: "Python + APIs",
      text: "Every processed vehicle lands in the SIDIS database. Python services and APIs turn that raw record into something other teams can query.", case: "dashboard" },
    { id: "dash",  col: 3, row: 0, label: "VEP Mega Dashboard",  sub: "Production + Engineering",
      text: "Live VEP status per vehicle, DTC alerts, history, and an Arabic-English troubleshooting dictionary for the shop floor.", case: "dashboard" },
    { id: "sync",  col: 3, row: 1, label: "PVEDsync",            sub: "Production Control",
      text: "Checks vehicle sequence, variant and processing state against the production plan, and flags mismatches.", case: "pvedsync" },
    { id: "after", col: 3, row: 2, label: "Aftersales portal",   sub: "Dealer-side service",
      text: "Gives authorized Aftersales staff ECU configuration, software and programming records captured at the factory.", case: "portal" }
  ],
  links: [["ecu","vep"],["vep","sidis"],["sidis","dash"],["sidis","sync"],["sidis","after"]]
};

/* Detailed case files (Nissan Egypt). Facts only from the CV. */
window.CASES = [
  {
    id: "vep", title: "VEP end-of-line validation", period: "Aug 2025 – Present", where: "Nissan Egypt, PY1B launch",
    summary: "Replaced legacy end-of-line validation for the PY1B launch with the SIDIS-based Vehicle Electronic Process.",
    context: "PY1B was a new model. Assembly needed one consistent way to prove each vehicle's electronics were healthy before it left the line.",
    built: [
      "Deployed the hardware and software, wrote SOSs, work instructions and training material for operators, team leaders and engineers.",
      "Ran a four-variant validation trial covering function checks, MIC screen logic and DTC behavior.",
      "Root-caused recurring failures by reading UDS-over-CAN diagnostic traffic: DTC read/clear, DID read/write and routine control.",
      "Worked with Siemens, NML Japan, RNTBCI India and Renault to close 6 main integration issues and fix the operating parameters."
    ],
    result: [
      ["200+", "recurring EOL failures resolved"],
      ["14", "ECUs covered"],
      ["30%", "fewer EOL re-tests"],
      ["4", "variants validated"]
    ],
    stack: ["UDS (ISO 14229)", "CAN", "SIDIS", "DTC analysis", "SOS / work instructions"],
    note: "Selected for two weeks of SIDIS/VEP training at Nissan Motor UK in May 2026."
  },
  {
    id: "dashboard", title: "VEP Mega Dashboard", period: "May 2026 – Present", where: "Nissan Egypt, MSPO",
    summary: "One screen for live VEP status, diagnostic alerts and history, built on top of the SIDIS database.",
    context: "Vehicle electronics knowledge was scattered: the data in SIDIS, the fixes in people's heads. Shop-floor teams escalated recurring concerns to engineering.",
    built: [
      "Python backend services and APIs that read the SIDIS database and expose it to a purpose-built frontend.",
      "Real-time monitoring of produced vehicles and their VEP processing status.",
      "An Arabic-English dictionary of previously seen issues and DTCs, with corrective guidance.",
      "Alerts, historical comparison and analysis modules for engineering follow-up."
    ],
    result: [
      ["70%", "fewer engineering escalations"],
      ["Live", "status per vehicle"],
      ["2", "languages in the DTC dictionary"]
    ],
    stack: ["Python", "REST APIs", "SIDIS", "Frontend", "Diagnostics"],
    note: ""
  },
  {
    id: "pvedsync", title: "PVEDsync", period: "Aug 2026 – Present", where: "Nissan Egypt, MSPO",
    summary: "A link between the VEP system and Production Control that shows when the build disagrees with the plan.",
    context: "Production Control tracks the planned sequence and variants; VEP knows what was actually processed. Nobody saw both side by side.",
    built: [
      "Python scripts and APIs that pull data from the vehicle electronics data server.",
      "Consolidated vehicle identification, variant and processing state into one view.",
      "Checks of actual progression against intended sequence and variant requirements.",
      "A friendly interface for Production Control staff."
    ],
    result: [
      ["10+", "sequence and variant mismatches eliminated"]
    ],
    stack: ["Python", "REST APIs", "Production Control", "Vehicle tracking"],
    note: ""
  },
  {
    id: "portal", title: "Aftersales traceability portal", period: "Sep 2026 – Present", where: "Nissan Egypt",
    summary: "Controlled access to the ECU records captured during manufacturing, for dealer-side troubleshooting.",
    context: "When a vehicle reaches a dealer, the first question is often what software and configuration its ECUs left the factory with.",
    built: [
      "An API-based portal that exposes ECU software versions, configuration identifiers and calibration file identifiers.",
      "Connected manufacturing programming records to Aftersales troubleshooting needs.",
      "Restricted sensitive service information to designated personnel.",
      "An interface that finds the right vehicle record quickly."
    ],
    result: [
      ["3000+", "vehicles with ECU records available"]
    ],
    stack: ["REST APIs", "ECU traceability", "Access control", "Aftersales"],
    note: ""
  },
  {
    id: "marshaling", title: "PY1B Marshaling List", period: "Aug 2025 – Feb 2026", where: "Nissan Egypt, PE Assembly",
    summary: "Station-level documentation of every Trim & Chassis operation for the new model.",
    context: "A new model launch needs every operation, part, quantity and tool assigned to a station before the first PT build.",
    built: [
      "Documented each new-model operation along Trim & Chassis and checked installation feasibility per station.",
      "Assigned and verified part numbers, quantities, tool requirements and installation sequences.",
      "Confirmed material availability and ergonomics with SCM, Production and PE.",
      "Kept the list current through V5+ revisions during PT builds as design and process changes arrived."
    ],
    result: [
      ["1000+", "operations documented"],
      ["24", "stations"],
      ["60%", "fewer part-shortage or line-stop events"]
    ],
    stack: ["New-model launch", "Process engineering", "SCM coordination", "Change management"],
    note: ""
  },
  {
    id: "npw", title: "NPW gap closure", period: "May 2026 – Present", where: "Nissan Egypt, MSPO",
    summary: "Led foremen through gap analysis against Nissan Production Way requirements and turned the gaps into Kaizen plans.",
    context: "NPW audits measure how closely each shop follows the Nissan standard. The gaps needed owners and plans, not just a list.",
    built: [
      "Gap analysis against NPW requirements across 4 plant shops.",
      "Kaizen plans per gap, led together with 4 foremen.",
      "Follow-up on corrective actions until the gaps were closed."
    ],
    result: [
      ["9", "NPW gaps closed"],
      ["80% → 95%", "audit score"]
    ],
    stack: ["NPW", "Kaizen", "Audit", "Team leadership"],
    note: ""
  }
];

/* Career timeline */
window.TIMELINE = [
  { when: "May 2026 – now", org: "Nissan Motor Egypt", role: "NPW Specialist Engineer and Vehicle Electronics (VEP/SIDIS) Owner, MSPO",
    points: ["Built the VEP Mega Dashboard, PVEDsync and the Aftersales traceability portal.", "Closed 9 NPW gaps across 4 shops; audit score 80% to 95%.", "Two weeks of SIDIS/VEP training at Nissan Motor UK (May 2026)."] },
  { when: "Jul 2025 – May 2026", org: "Nissan Motor Egypt", role: "PE Assembly Engineer",
    points: ["Launched VEP end-of-line validation for PY1B; 200+ recurring failures resolved across 14 ECUs.", "Built the Marshaling List: 1000+ operations at 24 stations."] },
  { when: "Oct 2024 – Jun 2025", org: "Ejad", role: "Graduation project: BLE localization in vehicles",
    points: ["Wrote the CAN driver in C: 5 ms latency, 2% message loss.", "Particle-filter sensor fusion of RSSI from multiple BLE anchors: 5 cm accuracy."] },
  { when: "Jul – Dec 2024", org: "Nissan Motor Egypt", role: "Production Engineering Intern",
    points: ["Integrated Atlas Copco tightening tools with PLCs (QART): 40% fewer manual interventions."] },
  { when: "Aug – Sep 2023", org: "LEONI Egypt", role: "Production Concept Intern",
    points: ["Analyzed optimization opportunities behind a floor-area reduction across 10 factories."] }
];

/* Project archive. `case` marks those that have a full case file above. */
window.PROJECTS = [
  { id: "vep-sidis", title: "VEP / SIDIS deployment", category: "Vehicle electronics", period: "Aug 2025 – Present", case: "vep",
    description: "End-of-line vehicle electronics validation for PY1B.", tags: ["UDS", "CAN", "SIDIS", "DTC"], featured: true },
  { id: "mega-dashboard", title: "VEP Mega Dashboard", category: "Vehicle electronics", period: "May 2026 – Present", case: "dashboard",
    description: "Live VEP monitoring, DTC alerts and a bilingual troubleshooting dictionary.", tags: ["Python", "APIs", "SIDIS"], featured: true },
  { id: "pvedsync", title: "PVEDsync", category: "Vehicle electronics", period: "Aug 2026 – Present", case: "pvedsync",
    description: "Sequence and status visibility between VEP and Production Control.", tags: ["Python", "APIs"], featured: true },
  { id: "portal", title: "Aftersales traceability portal", category: "Vehicle electronics", period: "Sep 2026 – Present", case: "portal",
    description: "ECU configuration, software and programming records for dealers.", tags: ["APIs", "ECU traceability"], featured: true },
  { id: "marshaling", title: "PY1B Marshaling List", category: "Manufacturing", period: "Aug 2025 – Feb 2026", case: "marshaling",
    description: "Station-level documentation of Trim & Chassis operations.", tags: ["New-model launch", "SCM"], featured: false },
  { id: "ble", title: "Phone as a Key using BLE", category: "Embedded systems", period: "Oct 2024 – Jun 2025",
    description: "Graduation project with Ejad: BLE 5.3 vehicle access and localization. I wrote the CAN driver in C and built parts of the particle-filter fusion; also contributed to OSEK task management and ESP32 server connectivity.",
    tags: ["BLE", "CAN", "C", "OSEK", "Sensor fusion"], link: "https://drive.google.com/drive/folders/1vYyYIdfKYcxuHxEYt_WeEz9QgY3mjdyV?usp=drive_link", featured: true },
  { id: "qart", title: "QART: automated car tracking", category: "Automation", period: "Jul – Dec 2024",
    description: "Integrated Atlas Copco torque tools with PLCs and control circuits in the Assembly shop; 40% fewer manual interventions.",
    tags: ["PLC", "IPMS", "Quality control"], link: "https://drive.google.com/drive/folders/1EuTGvkGQRcarmFUCkxBMCEnFNXdETVW-?usp=drive_link", featured: true },
  { id: "rtos-window", title: "RTOS car window control", category: "Embedded systems", period: "May – Jul 2024",
    description: "Window controller on Tiva C and FreeRTOS with child lock, obstruction detection and automatic reverse.",
    tags: ["FreeRTOS", "Tiva C", "Safety"], link: "https://drive.google.com/drive/folders/1f-JLDC_S7wb2SQo3CZVm7m4tlcC-W4kW?usp=drive_link" },
  { id: "jeremy", title: "JEREMY Cart", category: "Robotics", period: "Feb – Jun 2024",
    description: "Autonomous line-following supermarket cart: mechanical design, Raspberry Pi vision, custom PCB, PID motor control and obstacle avoidance.",
    tags: ["Raspberry Pi", "Computer vision", "PCB", "PID"], link: "https://drive.google.com/drive/folders/1YFk4bWR5x9J3uWYPOxrnAbupPir1O8rA?usp=drive_link" },
  { id: "face", title: "Face recognition with AI", category: "AI and vision", period: "Oct 2024 – Jan 2025",
    description: "Optimizer comparison (SGD, RMSProp, Nadam) and VAE/CAE encoder-decoder networks on CIFAR-10 and CASIA-WebFace.",
    tags: ["TensorFlow", "Deep learning", "VAE"], link: "https://drive.google.com/drive/folders/1Cn6U5U0f3aIuZyoBoL8iZVIYWm_Q27W0?usp=drive_link" },
  { id: "image-class", title: "Image classification analysis", category: "AI and vision", period: "Oct 2024 – Jan 2025",
    description: "Traditional (HOG, LBP, SVM, KNN) versus CNN approaches across a 100-class dataset.",
    tags: ["OpenCV", "CNN", "SVM"], link: "https://drive.google.com/drive/folders/1c5GxBq_kn3OjoUcDvJDMGjKZplY3KUPu?usp=drive_link" },
  { id: "plc-line", title: "Automated production line", category: "Automation", period: "Feb – Jun 2024",
    description: "Eight-plus station line on a Siemens S7-1212C, programmed in TIA Portal and simulated in Factory I/O.",
    tags: ["Siemens PLC", "TIA Portal", "Factory I/O"], link: "https://drive.google.com/drive/folders/1Q5TyETMhpnO4vyJ5g16OzOJixtF_31h1?usp=drive_link" },
  { id: "lifi", title: "Home security with Li-Fi", category: "Embedded systems", period: "Nov 2023 – Feb 2024",
    description: "Smoke, intrusion and motion sensing on a Tiva C, with Li-Fi communication to an Arduino and LCD alerts.",
    tags: ["IoT", "Li-Fi", "Tiva C", "Arduino"], link: "https://drive.google.com/drive/folders/1LlKm5QPNDuxxqc26-xmGFZIjD0PhLH96?usp=drive_link" },
  { id: "6dof", title: "6-DOF robotic manipulator", category: "Robotics", period: "Mar – Jun 2024",
    description: "URDF model in ROS, Gazebo simulation, MoveIt trajectory planning in RViz and a Python control script.",
    tags: ["ROS", "MoveIt", "Gazebo", "Python"], link: "https://drive.google.com/drive/folders/1FRTPXrmK8JrQfW94owPrRgSHeOyklKxw?usp=drive_link" },
  { id: "prismatic", title: "Prismatic robotic arm line", category: "Robotics", period: "Feb – Jun 2023",
    description: "Automated sorting line with pneumatic feeding, metal/plastic classification, vacuum pick-and-place, FreeRTOS and a fabricated PCB.",
    tags: ["FreeRTOS", "Arduino", "PCB", "MATLAB"], link: "https://drive.google.com/drive/folders/1JCHI3VhD-zwG9C5ebHoPoAbMx1ThAyE0?usp=drive_link" },
  { id: "bt-car", title: "Bluetooth-driven car", category: "Embedded systems", period: "Feb – Jun 2023",
    description: "A car built from scratch: custom chassis, wire braking, rack-and-pinion steering and NEMA 23 steppers; carried a 120 kg load.",
    tags: ["Bluetooth", "Mobile app", "Mechanical design"], link: "https://drive.google.com/drive/folders/1NPjoij79ZwJybCyseTwIGl09Ws3dGkW8?usp=drive_link" },
  { id: "game", title: "Children's interactive game", category: "Robotics", period: "Sep – Dec 2022",
    description: "One-cubic-metre mechatronic game with shooting, ball lifting, colour sorting and two-player LCD scoring.",
    tags: ["Mechatronics", "Electronics"], link: "https://drive.google.com/drive/folders/1nQ3keKUnunjxcRLHtOSmCjuDQZSZUovF?usp=drive_link" },
  { id: "leoni", title: "Factory space optimization", category: "Manufacturing", period: "Jul – Sep 2023",
    description: "Space-utilization analysis for LEONI's area-reduction project; built a custom PFAR tool and applied lean principles.",
    tags: ["Lean", "Layout", "Process optimization"], link: "https://drive.google.com/drive/folders/1iht74pNUVAFxndcbi_Mopd7VlNhnb3nR?usp=drive_link" }
];

/* Skills grouped by what they are used for */
window.SKILLS = [
  { group: "Vehicle diagnostics", items: ["UDS (ISO 14229)", "CAN", "DTC analysis", "ECU traceability", "SIDIS", "End-of-line validation", "Root-cause analysis"] },
  { group: "Software and data", items: ["Python", "REST APIs", "C / C++", "Java", "HTML and CSS", "Power BI", "MATLAB"] },
  { group: "Embedded and automation", items: ["AVR", "Tiva C", "FreeRTOS", "OSEK", "AUTOSAR basics", "BLE", "PLC (TIA Portal)", "ROS"] },
  { group: "Manufacturing", items: ["New-model launch", "Kaizen", "NPW audits", "SOS and work instructions", "Marshaling / station allocation"] },
  { group: "Design and simulation", items: ["SolidWorks", "Autodesk Inventor", "AutoCAD", "ANSYS", "Proteus", "Factory I/O"] }
];

window.EDUCATION = [
  { title: "B.Sc. Mechatronics and Automation Engineering", org: "Ain Shams University and University of East London", when: "2020 – Jun 2025",
    text: "Embedded systems, automation, robotics and control; microcontrollers, PLC programming and full mechatronic system design." },
  { title: "Data Science Diploma (14 months)", org: "ALX", when: "May 2023 – Sep 2024",
    text: "Python, data wrangling, statistics, machine learning, visualization and predictive modeling on real datasets." },
  { title: "Embedded Systems Diploma", org: "AMIT", when: "Jun – Dec 2023",
    text: "Microcontroller architecture; complete drivers, memory-mapped interfaces and AVR projects." },
  { title: "AUTOSAR basics", org: "Garraio", when: "2024 – 2025",
    text: "Layered architecture, application and service layers, ECU abstraction." },
  { title: "ROS for Robotics Development", org: "Ain Shams University", when: "Jul – Aug 2023",
    text: "Nodes, topics, launch files, Gazebo simulation and MoveIt motion planning." },
  { title: "Basic Automation Systems using PLC", org: "Schneider Electric", when: "Jul – Aug 2022",
    text: "Ladder programming and a simulated factory line to validate PLC logic." }
];

window.LEADERSHIP = [
  { role: "Vice President and Head of Finance and Legalities", org: "AIESEC in Ain Shams University", when: "Feb 2024 – Feb 2026" },
  { role: "Head of Multimedia", org: "IEEE ASUSB", when: "Jun 2023 – Dec 2024" },
  { role: "Head of Multimedia Department", org: "ASU Racing Team", when: "Sep 2021 – Oct 2022" }
];

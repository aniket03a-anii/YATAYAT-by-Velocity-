# Nagpur Traffic AI — Intelligent Traffic Management & Decision Support System (I²TMS)

[![Vite](https://img.shields.io/badge/Vite-5.0+-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18.3+-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5+-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0+-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Leaflet](https://img.shields.io/badge/Leaflet-GIS_Map-199900?logo=leaflet&logoColor=white)](https://leafletjs.com/)

> **Nagpur Smart and Sustainable City Development Corporation Limited (NSSCDCL)** & **Nagpur City Traffic Police**
> Intelligent Integrated Traffic Management System (I²TMS) & AI Decision Support Console.

---

## 🚦 Overview

**Nagpur Traffic AI** is an end-to-end command and decision-support prototype built for the **Nagpur Integrated Command and Control Centre (ICCC)**. It fuses real-time telemetry from across Nagpur’s arterial corridors (including the **Wardha Road IT Corridor**, **Central Avenue**, **Amravati Road**, and **Ring Road**) to detect risk hotspots, coordinate police beat patrols, orchestrate emergency green corridors, and dynamically optimize traffic flow.

---

## 🌟 Key Features

### 1. Executive ICCC Primary Console
- **Corridor Telemetry**: Real-time tracking of average travel times, estimated vehicles on road, and queue lengths across major junctions (Sitabuldi, Zero Mile, RBI Square, Rahate Colony, Chhatrapati Square).
- **Executive KPIs**: Live counters for active CAD emergencies, ANPR/Speed sensor violations, and police SLA response compliance.
- **Active Incidents Queue**: Prioritized CAD triage feed with instant dispatch links and status updates.

### 2. GIS Risk Heatmap & Arterial Corridors
- **Interactive Multi-Layer Map**: Color-coded risk nodes (Low, Medium, High, Critical), accident blackspots (MoRTH/KDE clusters), and arterial corridor overlays.
- **Critical Infrastructure & Hospital Beds**: Real-time tracking of emergency trauma beds at **AIIMS Nagpur (MIHAN)** and **Government Medical College (GMC)**.
- **Live Unit GPS Tracking**: Real-time positions and availability of police patrol units and beat constables across all 5 zones.

### 3. Explainable AI (XAI) & Dynamic Redeployment Engine
- **Mathematical Risk Decomposition**: Breakdowns of accident risk, congestion density, weather impacts, and violation rates with SHAP-inspired factor weights.
- **19-Step Simulation Lab**: Test dynamic redeployment scenarios during heavy monsoon downpours and multi-vehicle collisions at Sitabuldi Interchange.
- **Human-in-the-Loop Override**: Officer dispatch recommendations with mandatory supervisor audit logging and reasoning capture.

### 4. Emergency Green Corridor CAD (108 Ambulance Protocol)
- **Signal Preemption**: Synchronized signal clearance along transit routes between critical healthcare facilities.
- **Hospital Trauma Unit Coordination**: Live countdowns, traffic diversion telemetry, and officer escort status.

### 5. Adaptive Traffic Signal Control (ATCS)
- **Dynamic Split Adjustments**: Live cycle time modulation based on queue length and sensor-detected vehicle volume.
- **Signal Blackout Alerts**: Automatic detection and reporting of signal defects and power interruptions.

### 6. Citizen Grievance & Mobility Portal
- **Direct Reporting**: Interface for citizens to report potholes, waterlogging hazards, signal defects, and illegal parking directly to the ICCC queue.
- **Public Traffic Advisories**: Real-time broadcast of municipal diversions, monsoon underpass waterlogging alerts, and construction notices.

---

## 👥 Role-Based Access & Personas

The application includes built-in persona switching for testing:

| Persona | Role | Primary Workspace |
|---|---|---|
| **Dr. Abhijeet Chaudhari** | Municipal Commissioner | Executive City Analytics & Policy Overview |
| **Amitesh Kumar, IPS** | Commissioner of Police | CAD Incident Triage & Patrol Deployment |
| **Pooja Deshmukh** | Senior CAD Dispatcher | Active Emergency Triage & Signal Preemption |
| **Vikram Shinde** | Field Beat Constable | Mobile Field Unit App & Dispatch Confirmations |
| **Rajesh Sharma** | Citizen / Daily Commuter | Mobility Advisories & Grievance Reporting |

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Mapping & GIS**: Leaflet.js, React-Leaflet, OpenStreetMap
- **Icons & Visuals**: Lucide React
- **Animations**: Canvas Confetti, CSS Animations
- **Build Tool**: Vite

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm or bun

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/aniket03a-anii/velocity-.git
   cd velocity-
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

---

## 📂 Project Structure

```
├── src/
│   ├── components/
│   │   ├── ai/             # Explainable AI modals & recommendation cards
│   │   ├── analytics/      # Corridor analytics & predictive graphs
│   │   ├── auth/           # Login portal & persona selection
│   │   ├── citizen/        # Citizen mobility & grievance reporting portal
│   │   ├── common/         # TopHeader & Sidebar navigation components
│   │   ├── corridor/       # Emergency Green Corridor (CAD 108) manager
│   │   ├── dashboard/      # OverviewDashboard & 6 KPI metric cards
│   │   ├── incidents/      # Computer-Aided Dispatch (CAD) & incident triage
│   │   ├── map/            # Leaflet GIS Map & Junction inspection modals
│   │   ├── mobile/         # Field officer responsive interface
│   │   ├── officers/       # Police command center & unit dispatchers
│   │   ├── reports/        # Municipal & police audit compliance archive
│   │   ├── signals/        # Adaptive Traffic Signal Control (ATCS) view
│   │   ├── simulation/     # 19-Step dynamic incident redeployment lab
│   │   ├── system/         # Server telemetry, system health & architecture
│   │   └── violations/     # ANPR & speed sensor violation ledgers
│   ├── data/               # Nagpur junctions, landmarks, officers, and personas
│   ├── services/           # Risk calculation engine & deployment optimizer
│   ├── types.ts            # Global TypeScript definitions
│   ├── App.tsx             # Root routing and application coordinator
│   └── main.tsx            # Application entry point
├── package.json
└── vite.config.ts
```

---

## 📜 License

This project is released under the **MIT License**.
Built for demonstration and research in intelligent municipal traffic operations.

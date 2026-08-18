import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import {
  Junction,
  PoliceOfficer,
  Incident,
  AccidentBlackspot,
  RiskCategory,
} from '../../types';
import { ACCIDENT_BLACKSPOTS } from '../../data/nagpurData';
import { getRiskColor } from '../../services/riskEngine';
import {
  Layers,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Shield,
  AlertTriangle,
  Flame,
  Radio,
  Eye,
  Crosshair,
  Car,
  MapPin,
  Search,
  Video,
  CloudRain,
  Compass,
  Maximize2,
  Minimize2,
  Sparkles,
  Zap,
  Users,
  Navigation,
  CheckCircle2,
  X,
  ExternalLink,
} from 'lucide-react';

interface NagpurRiskMapProps {
  junctions: Junction[];
  officers: PoliceOfficer[];
  incidents: Incident[];
  blackspots?: AccidentBlackspot[];
  selectedJunction: Junction | null;
  onSelectJunction: (junction: Junction) => void;
  onSelectOfficer?: (officer: PoliceOfficer) => void;
  onOpenExplainableAi?: (junction: Junction) => void;
  activeSimulationPath?: {
    from: { lat: number; lng: number; name?: string };
    to: { lat: number; lng: number; name?: string };
    officerBadge: string;
    progress: number;
  } | null;
  activeFilterRisk?: 'ALL' | RiskCategory;
  activeFilterZone?: 'ALL' | string;
}

// Tile Layer Options
type MapTileStyle = 'dark' | 'satellite' | 'street';

// Nagpur Real Arterial Road Corridors Coordinates
const NAGPUR_CORRIDORS = [
  {
    id: 'corridor-wardha-rd',
    name: 'Wardha Road (Metro Line 1 Corridor)',
    zone: 'Central-South',
    coordinates: [
      [21.1525, 79.0845], // Samvidhan / RBI Sq
      [21.1498, 79.0806], // Zero Mile
      [21.1466, 79.0825], // Sitabuldi Interchange
      [21.1245, 79.0745], // Rahate Colony
      [21.1124, 79.0682], // Chhatrapati Sq
      [21.0945, 79.0785], // Manish Nagar RUB
      [21.0650, 79.0550], // Airport / MIHAN Link
    ] as [number, number][],
    baseSpeed: 24,
    congestionLevel: 'HIGH',
  },
  {
    id: 'corridor-central-ave',
    name: 'Central Avenue (CA Road / Metro Line 2)',
    zone: 'East',
    coordinates: [
      [21.1466, 79.0825], // Sitabuldi
      [21.1542, 79.0988], // Agrasen Sq
      [21.1512, 79.1124], // Gandhibagh Sq
      [21.1585, 79.1245], // Itwari Railway Sq
      [21.1450, 79.1320], // Telephone Exchange
      [21.1568, 79.1425], // Prajapati Nagar
      [21.1520, 79.1580], // Pardi Naka (HB Town)
    ] as [number, number][],
    baseSpeed: 18,
    congestionLevel: 'CRITICAL',
  },
  {
    id: 'corridor-amravati-rd',
    name: 'Amravati Road (NH-53 Corridor)',
    zone: 'West',
    coordinates: [
      [21.1466, 79.0825], // Sitabuldi
      [21.1432, 79.0765], // Variety Sq
      [21.1448, 79.0552], // Law College Sq
      [21.1490, 79.0350], // Ravi Nagar Sq
      [21.1485, 79.0125], // Wadi Naka
    ] as [number, number][],
    baseSpeed: 28,
    congestionLevel: 'MEDIUM',
  },
  {
    id: 'corridor-great-nag-rd',
    name: 'Great Nag Road & Medical Spine',
    zone: 'Central-East',
    coordinates: [
      [21.1432, 79.0765], // Variety Sq
      [21.1425, 79.0910], // Cotton Market
      [21.1325, 79.0985], // Medical Sq (GMC)
      [21.1265, 79.1082], // Reshimbagh Sq
      [21.1210, 79.1190], // Sakkardara Sq
    ] as [number, number][],
    baseSpeed: 20,
    congestionLevel: 'HIGH',
  },
  {
    id: 'corridor-whc-rd',
    name: 'West High Court (WHC) & Ambazari Road',
    zone: 'West',
    coordinates: [
      [21.1448, 79.0552], // Law College Sq
      [21.1342, 79.0588], // Shankar Nagar Sq
      [21.1250, 79.0520], // VNIT Gate / Laxminagar
      [21.1120, 79.0285], // Hingna T-Point
    ] as [number, number][],
    baseSpeed: 30,
    congestionLevel: 'LOW',
  },
  {
    id: 'corridor-ring-road',
    name: 'Nagpur Outer Ring Road Trunk (NH-44)',
    zone: 'Outer Arc',
    coordinates: [
      [21.1985, 79.0952], // Automotive Sq
      [21.1765, 79.0924], // Indora Sq
      [21.1645, 79.0885], // Kadbi Chowk
      [21.1525, 79.0845], // Samvidhan Sq
      [21.1466, 79.0825], // Sitabuldi
      [21.1124, 79.0682], // Chhatrapati Sq
      [21.0825, 79.1012], // Besa - Pipla Sq
      [21.1520, 79.1580], // Pardi Naka
    ] as [number, number][],
    baseSpeed: 35,
    congestionLevel: 'MEDIUM',
  },
];

// Key Nagpur Geographic Landmarks
const NAGPUR_LANDMARKS = [
  {
    name: 'Zero Mile Stone (Center of India)',
    marathi: 'झिरो माईल स्मारक',
    lat: 21.1498,
    lng: 79.0806,
    type: 'HISTORIC',
    description: 'National geographical reference point & heritage site.',
  },
  {
    name: 'Deekshabhoomi Stupa',
    marathi: 'दीक्षाभूमी',
    lat: 21.1280,
    lng: 79.0667,
    type: 'CULTURAL',
    description: 'Sacred monument of Dr. B.R. Ambedkar; peak festival transit point.',
  },
  {
    name: 'Sitabuldi Fort & Metro Interchange',
    marathi: 'सीताबर्डी किल्ला',
    lat: 21.1472,
    lng: 79.0842,
    type: 'TRANSIT',
    description: 'Nagpur Metro Aqua & Orange Line central confluence.',
  },
  {
    name: 'Ambazari Lake & Garden',
    marathi: 'अंबाजारी तलाव',
    lat: 21.1310,
    lng: 79.0380,
    type: 'WATERBODY',
    description: 'Nag River origin basin; monsoon runoff check zone.',
  },
  {
    name: 'Futala Lake Musical Fountain',
    marathi: 'फुटाळा तलाव',
    lat: 21.1530,
    lng: 79.0430,
    type: 'WATERBODY',
    description: 'Major evening tourist & recreational traffic corridor.',
  },
  {
    name: 'AIIMS Nagpur (MIHAN Campus)',
    marathi: 'एम्स नागपूर',
    lat: 21.0540,
    lng: 79.0290,
    type: 'HOSPITAL',
    description: 'Emergency Green Corridor destination for Wardha Road ambulances.',
  },
  {
    name: 'Nagpur Central Railway Station',
    marathi: 'नागपूर रेल्वे स्टेशन',
    lat: 21.1528,
    lng: 79.0885,
    type: 'TRANSIT',
    description: 'Diamond Crossing major junction; continuous multi-modal influx.',
  },
  {
    name: 'Dr. Babasaheb Ambedkar International Airport',
    marathi: 'डॉ. बाबासाहेब आंबेडकर आंतरराष्ट्रीय विमानतळ',
    lat: 21.0922,
    lng: 79.0472,
    type: 'TRANSIT',
    description: 'VIP convoy route & freight air-cargo transit connector.',
  },
];

export const NagpurRiskMap: React.FC<NagpurRiskMapProps> = ({
  junctions,
  officers,
  incidents,
  blackspots = ACCIDENT_BLACKSPOTS,
  selectedJunction,
  onSelectJunction,
  onSelectOfficer,
  onOpenExplainableAi,
  activeSimulationPath,
  activeFilterRisk = 'ALL',
  activeFilterZone = 'ALL',
}) => {
  // Map Container & Instance Ref
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const layerGroupsRef = useRef<{
    heatmaps: L.LayerGroup;
    corridors: L.LayerGroup;
    junctions: L.LayerGroup;
    officers: L.LayerGroup;
    incidents: L.LayerGroup;
    blackspots: L.LayerGroup;
    landmarks: L.LayerGroup;
    simulation: L.LayerGroup;
  }>({
    heatmaps: L.layerGroup(),
    corridors: L.layerGroup(),
    junctions: L.layerGroup(),
    officers: L.layerGroup(),
    incidents: L.layerGroup(),
    blackspots: L.layerGroup(),
    landmarks: L.layerGroup(),
    simulation: L.layerGroup(),
  });

  // State Management
  const [mapStyle, setMapStyle] = useState<MapTileStyle>('street');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedZone, setSelectedZone] = useState<string>(activeFilterZone);
  const [selectedRisk, setSelectedRisk] = useState<'ALL' | RiskCategory>(activeFilterRisk);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [inspectingJunction, setInspectingJunction] = useState<Junction | null>(selectedJunction);

  // Layer Toggles
  const [showHeatmap, setShowHeatmap] = useState<boolean>(true);
  const [showCorridors, setShowCorridors] = useState<boolean>(true);
  const [showIncidents, setShowIncidents] = useState<boolean>(true);
  const [showOfficers, setShowOfficers] = useState<boolean>(true);
  const [showCoverageGaps, setShowCoverageGaps] = useState<boolean>(true);
  const [showBlackspots, setShowBlackspots] = useState<boolean>(true);
  const [showLandmarks, setShowLandmarks] = useState<boolean>(true);
  const [showCctvBadges, setShowCctvBadges] = useState<boolean>(true);

  // Sync selected junction prop
  useEffect(() => {
    if (selectedJunction) {
      setInspectingJunction(selectedJunction);
      if (mapInstanceRef.current && selectedJunction.lat && selectedJunction.lng) {
        mapInstanceRef.current.flyTo([selectedJunction.lat, selectedJunction.lng], 15, {
          duration: 0.8,
        });
      }
    }
  }, [selectedJunction]);

  // Sync zone and risk filters when prop updates
  useEffect(() => {
    setSelectedZone(activeFilterZone);
  }, [activeFilterZone]);

  useEffect(() => {
    setSelectedRisk(activeFilterRisk);
  }, [activeFilterRisk]);

  // 1. Initialize Leaflet Map Instance Once
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Nagpur Center: Lat 21.1458, Lng 79.0882
    const map = L.map(mapContainerRef.current, {
      center: [21.1458, 79.0882],
      zoom: 13,
      minZoom: 11,
      maxZoom: 18,
      zoomControl: false,
      attributionControl: false,
    });

    // Custom attribution
    L.control
      .attribution({
        position: 'bottomright',
        prefix: '<span class="text-sky-700 font-mono text-[9px]">NAGPUR GIS • ICCC v3.4</span>',
      })
      .addTo(map);

    // Initial Base Tile Layer (CartoDB Voyager/Light)
    const baseTiles = L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      {
        subdomains: 'abcd',
        maxZoom: 19,
      }
    );
    baseTiles.addTo(map);
    tileLayerRef.current = baseTiles;

    // Attach Layer Groups
    Object.values(layerGroupsRef.current).forEach((lg: L.LayerGroup) => {
      lg.addTo(map);
    });

    mapInstanceRef.current = map;

    // Responsive Resize Observer
    const resizeObserver = new ResizeObserver(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    });

    if (mapContainerRef.current) {
      resizeObserver.observe(mapContainerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // 2. Handle Tile Layer Style Switching
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    let url = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
    let subdomains = 'abcd';
    let maxZoom = 19;

    if (mapStyle === 'satellite') {
      url = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      subdomains = 'abc';
      maxZoom = 18;
    } else if (mapStyle === 'dark') {
      url = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
      subdomains = 'abcd';
      maxZoom = 19;
    } else if (mapStyle === 'street') {
      url = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
      subdomains = 'abcd';
      maxZoom = 19;
    }

    const newTileLayer = L.tileLayer(url, { subdomains, maxZoom });
    newTileLayer.addTo(map);
    tileLayerRef.current = newTileLayer;
  }, [mapStyle]);

  // 3. Render and Update Dynamic Layers on Map
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const {
      heatmaps,
      corridors,
      junctions: junctionGroup,
      officers: officerGroup,
      incidents: incidentGroup,
      blackspots: blackspotGroup,
      landmarks: landmarkGroup,
      simulation: simulationGroup,
    } = layerGroupsRef.current;

    // Clear all layers before rebuilding
    heatmaps.clearLayers();
    corridors.clearLayers();
    junctionGroup.clearLayers();
    officerGroup.clearLayers();
    incidentGroup.clearLayers();
    blackspotGroup.clearLayers();
    landmarkGroup.clearLayers();
    simulationGroup.clearLayers();

    // Filter Junctions based on Zone and Risk
    const filteredJunctions = junctions.filter((j) => {
      if (selectedZone !== 'ALL' && j.zone !== selectedZone) return false;
      if (selectedRisk !== 'ALL' && j.riskCategory !== selectedRisk) return false;
      if (
        searchQuery &&
        !j.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !j.marathiName.includes(searchQuery) &&
        !j.roads.some((r) => r.toLowerCase().includes(searchQuery.toLowerCase()))
      ) {
        return false;
      }
      return true;
    });

    // -------------------------------------------------------------
    // LAYER A: NAGPUR ARTERIAL CORRIDORS (Polylines)
    // -------------------------------------------------------------
    if (showCorridors) {
      NAGPUR_CORRIDORS.forEach((corridor) => {
        let color = '#0ea5e9'; // Cyan/Blue default
        let weight = 4.5;
        let opacity = 0.8;

        if (corridor.congestionLevel === 'CRITICAL') {
          color = '#ef4444'; // Red
          weight = 5.5;
        } else if (corridor.congestionLevel === 'HIGH') {
          color = '#f97316'; // Orange
          weight = 5;
        } else if (corridor.congestionLevel === 'MEDIUM') {
          color = '#f59e0b'; // Amber
          weight = 4;
        }

        // Road Outer Glow casing
        const glowLine = L.polyline(corridor.coordinates, {
          color: '#0f172a',
          weight: weight + 4,
          opacity: 0.9,
          lineCap: 'round',
          lineJoin: 'round',
        });
        corridors.addLayer(glowLine);

        // Main Traffic Flow Line
        const polyline = L.polyline(corridor.coordinates, {
          color,
          weight,
          opacity,
          dashArray: corridor.congestionLevel === 'CRITICAL' ? '6, 6' : undefined,
          lineCap: 'round',
          lineJoin: 'round',
        });

        polyline.bindTooltip(
          `<div class="p-1 text-xs">
            <strong class="text-cyan-300">${corridor.name}</strong>
            <div class="text-[10px] text-slate-300 mt-0.5">Status: <span class="font-bold text-${color === '#ef4444' ? 'red-400' : 'amber-400'}">${corridor.congestionLevel}</span> • Avg Speed: ${corridor.baseSpeed} km/h</div>
          </div>`,
          { sticky: true, className: 'leaflet-dark-tooltip' }
        );

        corridors.addLayer(polyline);
      });
    }

    // -------------------------------------------------------------
    // LAYER B: RISK HEATMAP RADIAL CIRCLES
    // -------------------------------------------------------------
    if (showHeatmap) {
      filteredJunctions.forEach((j) => {
        if (!j.lat || !j.lng) return;

        let circleColor = '#10b981';
        let radius = 250;
        let fillOpacity = 0.25;

        if (j.riskCategory === 'CRITICAL') {
          circleColor = '#f43f5e';
          radius = 550;
          fillOpacity = 0.4;
        } else if (j.riskCategory === 'HIGH') {
          circleColor = '#f97316';
          radius = 450;
          fillOpacity = 0.32;
        } else if (j.riskCategory === 'MEDIUM') {
          circleColor = '#f59e0b';
          radius = 320;
          fillOpacity = 0.25;
        }

        const circle = L.circle([j.lat, j.lng], {
          color: circleColor,
          fillColor: circleColor,
          fillOpacity,
          radius,
          weight: j.riskCategory === 'CRITICAL' ? 2 : 1,
          dashArray: j.riskCategory === 'CRITICAL' ? '4, 4' : undefined,
        });

        heatmaps.addLayer(circle);
      });
    }

    // -------------------------------------------------------------
    // LAYER C: ACCIDENT BLACKSPOTS (KDE Clusters)
    // -------------------------------------------------------------
    if (showBlackspots && blackspots) {
      blackspots.forEach((b) => {
        const matched = junctions.find((j) =>
          j.name.toLowerCase().includes(b.locationName.slice(0, 7).toLowerCase())
        );
        if (!matched || !matched.lat || !matched.lng) return;

        const blackspotCircle = L.circle([matched.lat, matched.lng], {
          color: '#eab308',
          fillColor: '#eab308',
          fillOpacity: 0.15,
          radius: b.gisClusterRadiusMeters || 200,
          weight: 1.5,
          dashArray: '3, 4',
        });

        blackspotCircle.bindTooltip(
          `<div class="p-1 text-xs">
            <div class="text-amber-300 font-bold">★ Blackspot #${b.rank}: ${b.locationName}</div>
            <div class="text-[10px] text-slate-300 mt-0.5">${b.accidentCountPastYear} crashes past year • ${b.fatalities} fatalities</div>
          </div>`,
          { sticky: true }
        );

        blackspotGroup.addLayer(blackspotCircle);
      });
    }

    // -------------------------------------------------------------
    // LAYER D: NAGPUR LANDMARKS
    // -------------------------------------------------------------
    if (showLandmarks) {
      NAGPUR_LANDMARKS.forEach((lm) => {
        const landmarkIcon = L.divIcon({
          className: 'custom-leaflet-landmark-icon',
          html: `
            <div class="flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-900/90 border border-slate-700 shadow-md backdrop-blur-sm text-[10px] text-slate-300 hover:border-cyan-500 hover:text-cyan-200 transition-all cursor-pointer">
              <span class="w-2 h-2 rounded-full ${lm.type === 'HOSPITAL' ? 'bg-emerald-400' : lm.type === 'WATERBODY' ? 'bg-blue-400' : 'bg-amber-400'}"></span>
              <span class="font-medium whitespace-nowrap">${lm.name.split('(')[0].trim()}</span>
            </div>
          `,
          iconSize: [120, 24],
          iconAnchor: [60, 12],
        });

        const marker = L.marker([lm.lat, lm.lng], { icon: landmarkIcon });
        marker.bindPopup(`
          <div class="p-3 bg-slate-900 text-slate-100 text-xs rounded-xl border border-slate-800 space-y-1.5 max-w-xs">
            <div class="font-bold text-cyan-400 flex items-center gap-1">
              <MapPin class="w-3.5 h-3.5" /> ${lm.name}
            </div>
            <div class="text-[11px] text-slate-300 font-serif">${lm.marathi}</div>
            <p class="text-[11px] text-slate-400 leading-relaxed">${lm.description}</p>
          </div>
        `);
        landmarkGroup.addLayer(marker);
      });
    }

    // -------------------------------------------------------------
    // LAYER E: POLICE PATROL OFFICERS
    // -------------------------------------------------------------
    if (showOfficers) {
      officers.forEach((officer) => {
        if (!officer.lat || !officer.lng) return;

        const isAvailable = officer.status === 'AVAILABLE';
        const color = isAvailable ? '#06b6d4' : '#3b82f6';

        const officerIcon = L.divIcon({
          className: 'custom-leaflet-officer-icon',
          html: `
            <div class="relative group cursor-pointer">
              <div class="w-7 h-7 rounded-full bg-slate-950 border-2 ${isAvailable ? 'border-cyan-400' : 'border-blue-500'} flex items-center justify-center text-white shadow-lg transform transition-transform hover:scale-125">
                <svg class="w-3.5 h-3.5 ${isAvailable ? 'text-cyan-400' : 'text-blue-400'}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <div class="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full ${isAvailable ? 'bg-emerald-400 animate-ping' : 'bg-blue-400'}"></div>
              <div class="absolute top-7 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded bg-slate-900/95 border border-slate-800 text-[9px] font-mono font-bold text-cyan-200 whitespace-nowrap shadow-md pointer-events-none">
                ${officer.badgeNumber}
              </div>
            </div>
          `,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });

        const marker = L.marker([officer.lat, officer.lng], { icon: officerIcon });
        marker.on('click', () => {
          if (onSelectOfficer) onSelectOfficer(officer);
        });

        marker.bindTooltip(
          `<div class="p-1.5 text-xs">
            <strong class="text-cyan-300">${officer.rank} ${officer.name} (${officer.badgeNumber})</strong>
            <div class="text-[10px] text-slate-300 mt-0.5">Status: <span class="font-bold text-${isAvailable ? 'emerald-400' : 'blue-400'}">${officer.status}</span> • Zone: ${officer.zone}</div>
            <div class="text-[10px] text-slate-400">Vehicle: ${officer.vehicleType} (${officer.vehicleNumber})</div>
          </div>`,
          { sticky: true }
        );

        officerGroup.addLayer(marker);
      });
    }

    // -------------------------------------------------------------
    // LAYER F: ACTIVE EMERGENCY INCIDENTS
    // -------------------------------------------------------------
    if (showIncidents) {
      incidents
        .filter((inc) => inc.status !== 'RESOLVED')
        .forEach((incident) => {
          if (!incident.lat || !incident.lng) return;

          const incidentIcon = L.divIcon({
            className: 'custom-leaflet-incident-icon',
            html: `
              <div class="relative cursor-pointer animate-bounce">
                <div class="w-8 h-8 rounded-full bg-rose-600 border-2 border-white flex items-center justify-center text-white shadow-xl shadow-rose-600/50">
                  <svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                </div>
                <div class="absolute -inset-1 rounded-full border-2 border-rose-500 animate-ping opacity-75"></div>
                <div class="absolute top-8 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded bg-rose-950 border border-rose-600 text-[9px] font-bold text-rose-200 uppercase whitespace-nowrap shadow-lg pointer-events-none">
                  ${incident.type}
                </div>
              </div>
            `,
            iconSize: [32, 32],
            iconAnchor: [16, 16],
          });

          const marker = L.marker([incident.lat, incident.lng], { icon: incidentIcon });
          marker.on('click', () => {
            const targetJunc = junctions.find((j) => j.id === incident.junctionId);
            if (targetJunc) {
              onSelectJunction(targetJunc);
              setInspectingJunction(targetJunc);
            }
          });

          marker.bindTooltip(
            `<div class="p-2 text-xs max-w-xs">
              <div class="text-rose-400 font-bold flex items-center gap-1">🚨 ${incident.type} (${incident.severity})</div>
              <div class="text-slate-200 mt-1">${incident.description}</div>
              <div class="text-[10px] text-slate-400 mt-1">Location: ${incident.junctionName} • ${incident.timeAgo}</div>
            </div>`,
            { sticky: true }
          );

          incidentGroup.addLayer(marker);
        });
    }

    // -------------------------------------------------------------
    // LAYER G: DYNAMIC REDEPLOYMENT SIMULATION PATH
    // -------------------------------------------------------------
    if (activeSimulationPath) {
      const line = L.polyline(
        [
          [activeSimulationPath.from.lat, activeSimulationPath.from.lng],
          [activeSimulationPath.to.lat, activeSimulationPath.to.lng],
        ],
        {
          color: '#38bdf8',
          weight: 4,
          dashArray: '8, 8',
          opacity: 0.9,
        }
      );
      simulationGroup.addLayer(line);

      // Moving police unit icon along route
      const curLat =
        activeSimulationPath.from.lat +
        (activeSimulationPath.to.lat - activeSimulationPath.from.lat) *
          activeSimulationPath.progress;
      const curLng =
        activeSimulationPath.from.lng +
        (activeSimulationPath.to.lng - activeSimulationPath.from.lng) *
          activeSimulationPath.progress;

      const movingIcon = L.divIcon({
        className: 'custom-leaflet-moving-icon',
        html: `
          <div class="relative">
            <div class="w-8 h-8 rounded-full bg-cyan-500 border-2 border-white flex items-center justify-center text-slate-950 font-bold shadow-xl animate-spin">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
            </div>
            <div class="absolute -top-6 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-cyan-950 border border-cyan-400 text-[10px] font-bold text-cyan-200 whitespace-nowrap shadow-xl">
              ${activeSimulationPath.officerBadge} DISPATCHING (ETA 3.4m)
            </div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const movingMarker = L.marker([curLat, curLng], { icon: movingIcon });
      simulationGroup.addLayer(movingMarker);
    }

    // -------------------------------------------------------------
    // LAYER H: NAGPUR KEY JUNCTIONS (Primary Interactive Pins)
    // -------------------------------------------------------------
    filteredJunctions.forEach((j) => {
      if (!j.lat || !j.lng) return;

      const isSelected = inspectingJunction?.id === j.id;
      const colorInfo = getRiskColor(j.riskCategory);
      const isCritical = j.riskCategory === 'CRITICAL';
      const hasGap = j.hasCoverageGap && showCoverageGaps;

      // Custom High-Tech Tactical HTML Pin
      const junctionIcon = L.divIcon({
        className: 'custom-leaflet-junction-icon',
        html: `
          <div id="marker-node-${j.id}" class="relative group cursor-pointer flex flex-col items-center">
            ${
              hasGap
                ? `<div class="absolute -inset-2 rounded-full border-2 border-rose-500 animate-ping opacity-60 pointer-events-none"></div>`
                : ''
            }
            ${
              isCritical
                ? `<div class="absolute -inset-1.5 rounded-full bg-rose-500/30 animate-pulse pointer-events-none"></div>`
                : ''
            }
            ${
              isSelected
                ? `<div class="absolute -inset-2.5 rounded-full border-2 border-cyan-400 border-dashed animate-spin pointer-events-none"></div>`
                : ''
            }

            <!-- Main Score Pill -->
            <div class="px-2.5 py-1 rounded-lg bg-slate-950/95 border-2 shadow-2xl backdrop-blur-md flex items-center gap-1.5 transition-all duration-200 group-hover:scale-110 ${
              isSelected
                ? 'border-cyan-400 ring-4 ring-cyan-500/20'
                : `border-[${colorInfo.hex}]`
            }" style="border-color: ${colorInfo.hex};">
              <span class="w-2.5 h-2.5 rounded-full shadow-sm" style="background-color: ${colorInfo.hex};"></span>
              <span class="font-mono font-black text-xs text-white">${j.riskScore}</span>
              ${
                hasGap
                  ? `<span class="px-1 py-0.2 rounded bg-rose-500/20 text-rose-300 text-[8px] font-bold">GAP</span>`
                  : ''
              }
            </div>

            <!-- Junction Label & Marathi Name -->
            <div class="mt-1 px-2 py-0.5 rounded-md bg-slate-900/90 border border-slate-800 text-[10px] font-semibold text-slate-200 shadow-md whitespace-nowrap pointer-events-none max-w-[140px] truncate">
              ${j.name.split('(')[0].replace('Square', 'Sq').trim()}
            </div>
          </div>
        `,
        iconSize: [120, 50],
        iconAnchor: [60, 20],
      });

      const marker = L.marker([j.lat, j.lng], { icon: junctionIcon, zIndexOffset: isSelected ? 1000 : 100 });

      marker.on('click', () => {
        onSelectJunction(j);
        setInspectingJunction(j);
      });

      marker.bindTooltip(
        `<div class="p-2 text-xs max-w-xs space-y-1">
          <div class="font-bold text-slate-100 flex items-center justify-between gap-2">
            <span>${j.name}</span>
            <span class="font-mono px-1.5 py-0.5 rounded text-[10px] font-bold ${colorInfo.badge}">${j.riskScore}/100 • ${j.riskCategory}</span>
          </div>
          <div class="text-[10px] text-slate-400 font-serif">${j.marathiName}</div>
          <div class="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] text-slate-300 pt-1 border-t border-slate-800">
            <div>Accidents: <span class="font-medium text-slate-100">${j.accidentRisk}%</span></div>
            <div>Congestion: <span class="font-medium text-slate-100">${j.congestionRisk}%</span></div>
            <div>Officers: <span class="${j.hasCoverageGap ? 'text-rose-400 font-bold' : 'text-emerald-400'}">${j.assignedOfficerIds.length}/${j.requiredOfficers}</span></div>
            <div>Speed: <span class="font-medium text-slate-100">${j.avgSpeedKmph} km/h</span></div>
          </div>
        </div>`,
        { sticky: true }
      );

      junctionGroup.addLayer(marker);
    });
  }, [
    junctions,
    officers,
    incidents,
    blackspots,
    selectedZone,
    selectedRisk,
    searchQuery,
    inspectingJunction,
    showHeatmap,
    showCorridors,
    showIncidents,
    showOfficers,
    showCoverageGaps,
    showBlackspots,
    showLandmarks,
    activeSimulationPath,
  ]);

  // Handlers for Map Controls
  const handleZoomIn = () => mapInstanceRef.current?.zoomIn();
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut();
  const handleResetNagpurView = () => {
    mapInstanceRef.current?.flyTo([21.1458, 79.0882], 13, { duration: 1 });
    setSelectedZone('ALL');
    setSelectedRisk('ALL');
    setSearchQuery('');
  };

  const handleFocusCriticalZones = () => {
    const critical = junctions.find((j) => j.riskCategory === 'CRITICAL') || junctions[0];
    if (critical?.lat && critical?.lng) {
      mapInstanceRef.current?.flyTo([critical.lat, critical.lng], 15, { duration: 1 });
      setInspectingJunction(critical);
      onSelectJunction(critical);
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    setTimeout(() => mapInstanceRef.current?.invalidateSize(), 200);
  };

  return (
    <div
      id="nagpur-leaflet-command-map"
      className={`relative w-full bg-slate-100 rounded-2xl border border-slate-200 overflow-hidden select-none shadow-md flex flex-col transition-all duration-300 ${
        isFullscreen ? 'fixed inset-4 z-50 h-[calc(100vh-32px)]' : 'h-[580px] lg:h-[680px]'
      }`}
    >
      {/* ------------------------------------------------------------- */}
      {/* TOP TACTICAL CONTROL BAR (Search, Filters, Map Styles) */}
      {/* ------------------------------------------------------------- */}
      <div className="absolute top-3 left-3 right-3 z-[1000] flex flex-wrap items-center justify-between gap-2.5 pointer-events-none">
        {/* Left Side: Search Bar & Zone Filters */}
        <div className="pointer-events-auto flex flex-wrap items-center gap-2">
          {/* Quick Junction Search */}
          <div className="relative flex items-center">
            <Search className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Nagpur square / road..."
              className="w-48 sm:w-64 pl-9 pr-7 py-1.5 rounded-xl bg-white/95 backdrop-blur-md border border-slate-200 text-xs text-slate-900 placeholder-slate-400 shadow-md focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 text-slate-400 hover:text-slate-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Zone Selector Chips */}
          <div className="hidden sm:flex items-center gap-1 p-1 rounded-xl bg-white/90 backdrop-blur-md border border-slate-200 shadow-md text-xs">
            <span className="px-2 py-0.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Zone:
            </span>
            {['ALL', 'Central', 'West', 'South', 'North', 'East'].map((z) => (
              <button
                key={z}
                onClick={() => setSelectedZone(z)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  selectedZone === z
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {z}
              </button>
            ))}
          </div>
        </div>

        {/* Right Side: Map Tiles & View Actions */}
        <div className="pointer-events-auto flex items-center gap-2">
          {/* Map Tile Style Selector */}
          <div className="flex items-center p-1 rounded-xl bg-white/90 backdrop-blur-md border border-slate-200 shadow-md text-xs">
            <button
              onClick={() => setMapStyle('street')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                mapStyle === 'street'
                  ? 'bg-slate-100 text-sky-700 border border-sky-300 font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Streets
            </button>
            <button
              onClick={() => setMapStyle('satellite')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                mapStyle === 'satellite'
                  ? 'bg-slate-100 text-sky-700 border border-sky-300 font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Satellite
            </button>
            <button
              onClick={() => setMapStyle('dark')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                mapStyle === 'dark'
                  ? 'bg-slate-100 text-sky-700 border border-sky-300 font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Dark
            </button>
          </div>

          {/* Quick Focus Actions */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-white/90 backdrop-blur-md border border-slate-200 shadow-md">
            <button
              onClick={handleFocusCriticalZones}
              className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold flex items-center gap-1.5"
              title="Focus on Most Critical Junction"
            >
              <Zap className="w-3.5 h-3.5 text-rose-600" />
              <span className="hidden sm:inline">Critical Zone</span>
            </button>
            <button
              onClick={handleResetNagpurView}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900 text-xs flex items-center gap-1"
              title="Center Nagpur (Zero Mile)"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Reset</span>
            </button>
            <button
              onClick={toggleFullscreen}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Map'}
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5 text-sky-600" />}
            </button>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* SECONDARY LAYER TOGGLE BAR */}
      {/* ------------------------------------------------------------- */}
      <div className="absolute top-16 left-3 right-3 z-[900] flex flex-wrap items-center gap-1.5 pointer-events-none">
        <div className="pointer-events-auto flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-white/90 backdrop-blur-md border border-slate-200 shadow-md text-[11px]">
          <button
            onClick={() => setShowHeatmap(!showHeatmap)}
            className={`px-2 py-0.5 rounded-md flex items-center gap-1 transition-all ${
              showHeatmap
                ? 'bg-rose-50 text-rose-700 border border-rose-200 font-medium'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Flame className="w-3 h-3 text-rose-500" /> Heatmap
          </button>
          <button
            onClick={() => setShowCorridors(!showCorridors)}
            className={`px-2 py-0.5 rounded-md flex items-center gap-1 transition-all ${
              showCorridors
                ? 'bg-amber-50 text-amber-700 border border-amber-200 font-medium'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Car className="w-3 h-3 text-amber-500" /> Corridors (6)
          </button>
          <button
            onClick={() => setShowIncidents(!showIncidents)}
            className={`px-2 py-0.5 rounded-md flex items-center gap-1 transition-all ${
              showIncidents
                ? 'bg-red-50 text-red-700 border border-red-200 font-medium'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <AlertTriangle className="w-3 h-3 text-red-500" /> Incidents ({incidents.filter((i) => i.status !== 'RESOLVED').length})
          </button>
          <button
            onClick={() => setShowOfficers(!showOfficers)}
            className={`px-2 py-0.5 rounded-md flex items-center gap-1 transition-all ${
              showOfficers
                ? 'bg-sky-50 text-sky-700 border border-sky-200 font-medium'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Shield className="w-3 h-3 text-sky-600" /> Officers ({officers.length})
          </button>
          <button
            onClick={() => setShowCoverageGaps(!showCoverageGaps)}
            className={`px-2 py-0.5 rounded-md flex items-center gap-1 transition-all ${
              showCoverageGaps
                ? 'bg-purple-50 text-purple-700 border border-purple-200 font-medium animate-pulse'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Radio className="w-3 h-3 text-purple-600" /> Coverage Gaps ({junctions.filter((j) => j.hasCoverageGap).length})
          </button>
          <button
            onClick={() => setShowBlackspots(!showBlackspots)}
            className={`px-2 py-0.5 rounded-md flex items-center gap-1 transition-all ${
              showBlackspots
                ? 'bg-yellow-50 text-yellow-800 border border-yellow-200 font-medium'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Crosshair className="w-3 h-3 text-yellow-600" /> Blackspots
          </button>
          <button
            onClick={() => setShowLandmarks(!showLandmarks)}
            className={`px-2 py-0.5 rounded-md flex items-center gap-1 transition-all ${
              showLandmarks
                ? 'bg-blue-50 text-blue-700 border border-blue-200 font-medium'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MapPin className="w-3 h-3 text-blue-600" /> Landmarks
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* LEAFLET MAP DOM MOUNT ELEMENT */}
      {/* ------------------------------------------------------------- */}
      <div
        ref={mapContainerRef}
        id="nagpur-leaflet-canvas"
        className="w-full h-full z-10"
      />

      {/* ------------------------------------------------------------- */}
      {/* FLOATING ZOOM CONTROLS (Bottom Right) */}
      {/* ------------------------------------------------------------- */}
      <div className="absolute right-4 bottom-14 z-[900] flex flex-col gap-1.5">
        <button
          onClick={handleZoomIn}
          className="w-9 h-9 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-sky-600 flex items-center justify-center shadow-md transition-all"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          className="w-9 h-9 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-sky-600 flex items-center justify-center shadow-md transition-all"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* BOTTOM STATUS & RISK SCALE FOOTER */}
      {/* ------------------------------------------------------------- */}
      <div className="absolute bottom-2 left-2 right-2 z-[900] flex flex-wrap items-center justify-between gap-2 p-2 px-3 rounded-xl bg-white/95 backdrop-blur-md border border-slate-200 text-xs shadow-md">
        {/* Risk Scale Legend */}
        <div className="flex items-center gap-3">
          <span className="text-slate-600 font-bold text-[11px] hidden sm:inline">Risk Scale:</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-xs" />
            <span className="text-slate-600 text-[11px]">0-20 Low</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-xs" />
            <span className="text-slate-600 text-[11px]">21-50 Medium</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-xs" />
            <span className="text-slate-600 text-[11px]">51-80 High</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-xs" />
            <span className="text-slate-600 text-[11px]">81-100 Critical</span>
          </div>
        </div>

        {/* Live Nagpur Telemetry Summary */}
        <div className="flex items-center gap-3 text-slate-600 text-[11px]">
          <span className="flex items-center gap-1 text-sky-700 font-medium">
            <Shield className="w-3.5 h-3.5" /> {officers.filter((o) => o.status === 'AVAILABLE').length} Avail. Officers
          </span>
          <span className="flex items-center gap-1 text-rose-600 font-medium">
            <Radio className="w-3.5 h-3.5" /> {junctions.filter((j) => j.hasCoverageGap).length} Gaps
          </span>
          <span className="flex items-center gap-1 text-blue-700 font-mono text-[10px] hidden md:inline">
            <CloudRain className="w-3 h-3" /> Nagpur 28°C • Monsoon Radar Active
          </span>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* SLIDE-OVER JUNCTION INSPECTION HUD (Drawer) */}
      {/* ------------------------------------------------------------- */}
      {inspectingJunction && (
        <div
          id="junction-inspect-hud"
          className="absolute right-3 top-28 bottom-16 z-[1000] w-80 sm:w-96 rounded-2xl bg-white/98 backdrop-blur-xl border border-slate-200 shadow-2xl p-4 flex flex-col space-y-3 overflow-y-auto animate-fade-in text-xs"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm text-slate-900 leading-tight">
                  {inspectingJunction.name}
                </h3>
              </div>
              <p className="text-[11px] text-slate-500 font-serif mt-0.5">
                {inspectingJunction.marathiName} • Zone: <span className="text-sky-700 font-bold">{inspectingJunction.zone}</span>
              </p>
            </div>

            <button
              onClick={() => setInspectingJunction(null)}
              className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Risk Score Highlight */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-slate-500 uppercase font-semibold">Calculated Risk Index</div>
              <div className="text-2xl font-mono font-black text-slate-900 flex items-baseline gap-1.5">
                <span style={{ color: getRiskColor(inspectingJunction.riskCategory).hex }}>
                  {inspectingJunction.riskScore}
                </span>
                <span className="text-xs text-slate-400 font-normal">/100</span>
              </div>
            </div>

            <div className="text-right space-y-1">
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${getRiskColor(inspectingJunction.riskCategory).badge}`}>
                {inspectingJunction.riskCategory}
              </span>
              <div className="text-[10px] text-slate-500">
                {inspectingJunction.trafficCondition} Flow
              </div>
            </div>
          </div>

          {/* Simulated CCTV Camera Feed Preview */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5 text-sky-600" />
                Live Edge CCTV Stream
              </span>
              <span className="font-mono text-[10px] text-emerald-600 flex items-center gap-1 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                {inspectingJunction.cctvStreamId}
              </span>
            </div>

            <div className="relative h-28 rounded-xl bg-slate-900 border border-slate-800 overflow-hidden flex items-center justify-center group">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/40 z-10 pointer-events-none"></div>
              {/* Simulated traffic footage grid */}
              <div className="w-full h-full bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>

              {/* Bounding box simulation */}
              <div className="absolute top-4 left-6 w-16 h-10 border border-cyan-400/80 bg-cyan-500/10 rounded flex items-start p-0.5">
                <span className="text-[8px] font-mono bg-cyan-950 text-cyan-300 px-1 rounded">Car 98%</span>
              </div>
              <div className="absolute bottom-4 right-8 w-20 h-12 border border-rose-400/80 bg-rose-500/10 rounded flex items-start p-0.5">
                <span className="text-[8px] font-mono bg-rose-950 text-rose-300 px-1 rounded">Bus (Slow)</span>
              </div>

              <div className="absolute bottom-2 left-2 z-20 font-mono text-[9px] text-slate-200">
                REC • {inspectingJunction.avgSpeedKmph} km/h • {inspectingJunction.vehicleCountPerHour} veh/hr
              </div>
            </div>
          </div>

          {/* Contributing Multi-Factor Breakdown */}
          <div className="space-y-2">
            <div className="text-[11px] font-bold text-slate-800">XAI Risk Factor Breakdown:</div>
            <div className="space-y-1.5">
              <div>
                <div className="flex justify-between text-[10px] text-slate-600 mb-0.5">
                  <span>Accident Blackspot Index (25%)</span>
                  <span className="font-mono font-bold text-slate-800">{inspectingJunction.accidentRisk}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-rose-500 rounded-full"
                    style={{ width: `${inspectingJunction.accidentRisk}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[10px] text-slate-600 mb-0.5">
                  <span>Congestion & Queue Delay (25%)</span>
                  <span className="font-mono font-bold text-slate-800">{inspectingJunction.congestionRisk}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full"
                    style={{ width: `${inspectingJunction.congestionRisk}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[10px] text-slate-600 mb-0.5">
                  <span>Monsoon Waterlogging & Rain Impact (10%)</span>
                  <span className="font-mono font-bold text-slate-800">{inspectingJunction.weatherImpact}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${inspectingJunction.weatherImpact}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Police Deployment Status & Actions */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-600">Police Manning Status:</span>
              <span
                className={`font-bold ${
                  inspectingJunction.hasCoverageGap ? 'text-rose-600' : 'text-emerald-600'
                }`}
              >
                {inspectingJunction.assignedOfficerIds.length} / {inspectingJunction.requiredOfficers} Units On Duty
              </span>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => {
                  if (onOpenExplainableAi) onOpenExplainableAi(inspectingJunction);
                }}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-sky-700 border border-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                Explain AI Score
              </button>

              <button
                onClick={() => onSelectJunction(inspectingJunction)}
                className="px-3 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm shadow-sky-500/20"
              >
                <Shield className="w-3.5 h-3.5 fill-current" />
                Deploy Patrol
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NagpurRiskMap;

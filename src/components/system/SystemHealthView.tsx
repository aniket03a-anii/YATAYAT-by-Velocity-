import React from 'react';
import { Junction, PoliceOfficer, Incident } from '../../types';
import {
  Activity,
  Server,
  Database,
  Cpu,
  Wifi,
  CheckCircle,
  Download,
  Code,
  Layers,
  Radio,
  FileCode,
} from 'lucide-react';

interface SystemHealthViewProps {
  junctions: Junction[];
  officers: PoliceOfficer[];
  incidents: Incident[];
}

export const SystemHealthView: React.FC<SystemHealthViewProps> = ({
  junctions,
  officers,
  incidents,
}) => {
  const handleExportJson = () => {
    const data = {
      version: '2.6.0',
      city: 'Nagpur',
      timestamp: new Date().toISOString(),
      junctions,
      officers,
      incidents,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nagpur_traffic_ai_telemetry_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const feeds = [
    {
      name: 'Nagpur ICCC CCTV Edge Streams',
      count: '24 Nodes (1080p 30fps)',
      latency: '38 ms',
      status: 'OPERATIONAL',
      protocol: 'RTSP / WebRTC Stream',
    },
    {
      name: 'ANPR & Red Light Violation Detectors',
      count: '18 Sensor Arrays',
      latency: '12 ms',
      status: 'OPERATIONAL',
      protocol: 'MQTT / JSON Payload',
    },
    {
      name: 'IMD Weather & Monsoon Radar (Nagpur Airport)',
      count: '1 Feed (Precipitation & Wind)',
      latency: '450 ms',
      status: 'OPERATIONAL',
      protocol: 'RESTful Polling',
    },
    {
      name: 'Police Fleet GPS Transponders',
      count: '40 Active Mobile Units',
      latency: '22 ms',
      status: 'OPERATIONAL',
      protocol: 'WebSocket Push',
    },
  ];

  return (
    <div id="system-health-panel" className="space-y-6 text-slate-900">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-teal-600" />
            System Telemetry & Data Pipeline Integrity
          </h2>
          <p className="text-xs text-slate-500">
            Real-time health monitoring of edge camera feeds, AI inference latency, and data persistence.
          </p>
        </div>

        <button
          onClick={handleExportJson}
          className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-sky-800 border border-slate-200 text-xs font-semibold flex items-center gap-2 transition-all shadow-xs"
        >
          <Download className="w-4 h-4" />
          EXPORT FULL TELEMETRY JSON
        </button>
      </div>

      {/* Latency & Server Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="text-slate-500 text-xs flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-sky-600" /> AI Risk Inference Latency
          </div>
          <div className="text-2xl font-mono font-black text-sky-700">42 ms</div>
          <div className="text-[10px] text-emerald-700 font-semibold">Sub-100ms real-time target met</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="text-slate-500 text-xs flex items-center gap-1.5">
            <Server className="w-4 h-4 text-emerald-600" /> Dispatch Optimization Compute
          </div>
          <div className="text-2xl font-mono font-black text-emerald-700">18 ms</div>
          <div className="text-[10px] text-slate-500">Hungarian / Dijkstra algorithm</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="text-slate-500 text-xs flex items-center gap-1.5">
            <Wifi className="w-4 h-4 text-purple-600" /> Fleet GPS Sync Frequency
          </div>
          <div className="text-2xl font-mono font-black text-purple-700">2.0 sec</div>
          <div className="text-[10px] text-slate-500">40 Mobile Patrol Transponders</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="text-slate-500 text-xs flex items-center gap-1.5">
            <Database className="w-4 h-4 text-amber-600" /> Telemetry Data Ingestion
          </div>
          <div className="text-2xl font-mono font-black text-amber-700">1.4k msg/s</div>
          <div className="text-[10px] text-emerald-700 font-semibold">0 dropped packets</div>
        </div>
      </div>

      {/* Sensor Ingestion Pipeline Feeds */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
          <Radio className="w-4 h-4 text-sky-600" />
          Nagpur Smart City Connected Data Feeds (Status)
        </h3>

        <div className="space-y-2.5">
          {feeds.map((f, i) => (
            <div
              key={i}
              className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-0.5">
                <div className="font-bold text-slate-900">{f.name}</div>
                <div className="text-slate-500 text-[11px]">
                  {f.count} • Protocol: <span className="font-mono text-sky-700">{f.protocol}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="font-mono text-slate-500 text-[11px]">
                  Latency: <strong className="text-slate-800">{f.latency}</strong>
                </span>
                <span className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
                  {f.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Schema & Tech Stack Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
          <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-sky-600" /> Technology Architecture Stack
          </h4>
          <ul className="space-y-1.5 text-xs text-slate-700">
            <li className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Frontend Core:</span>
              <span className="font-mono text-sky-800">React 19 + TypeScript + Tailwind CSS</span>
            </li>
            <li className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Mapping & GIS:</span>
              <span className="font-mono text-sky-800">Vector SVG GIS Engine + Coordinate Mapping</span>
            </li>
            <li className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Data Visualization:</span>
              <span className="font-mono text-sky-800">Recharts Responsive Visualizer</span>
            </li>
            <li className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Risk Algorithm:</span>
              <span className="font-mono text-sky-800">Multi-Factor Weighted Risk Scoring Model</span>
            </li>
            <li className="flex justify-between py-1">
              <span className="text-slate-500">Optimization:</span>
              <span className="font-mono text-sky-800">Constrained Nearest-Neighbor Fleet Dispatch</span>
            </li>
          </ul>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
          <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
            <FileCode className="w-4 h-4 text-emerald-600" /> Data Entity Summary
          </h4>
          <ul className="space-y-1.5 text-xs text-slate-700">
            <li className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Nagpur Junctions Monitored:</span>
              <span className="font-mono font-bold text-slate-900">{junctions.length} Intersections</span>
            </li>
            <li className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Active Police Fleet Officers:</span>
              <span className="font-mono font-bold text-slate-900">{officers.length} Personnel</span>
            </li>
            <li className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Active Incidents Tracked:</span>
              <span className="font-mono font-bold text-slate-900">{incidents.length} Live Records</span>
            </li>
            <li className="flex justify-between py-1">
              <span className="text-slate-500">Simulation Engine State:</span>
              <span className="font-mono text-emerald-700 font-bold">READY (9-Step Interactive)</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

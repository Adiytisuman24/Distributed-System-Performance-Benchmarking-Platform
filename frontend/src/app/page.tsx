"use client";

import React, { useState, useEffect } from "react";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from "recharts";
import { 
  Activity, Zap, ShieldAlert, Cpu, Database, CloudLightning, Gauge, BarChart3, Settings2 
} from "lucide-react";

// Mock data generator for initial state
const generateData = () => {
  return Array.from({ length: 20 }, (_, i) => ({
    time: i,
    rps: Math.floor(Math.random() * 500) + 200,
    latency: Math.floor(Math.random() * 50) + 10,
    cpu: Math.floor(Math.random() * 40) + 20,
  }));
};

export default function Dashboard() {
  const [data, setData] = useState(generateData());
  const [activeChaos, setActiveChaos] = useState<string[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => {
        const newData = [...prev.slice(1), {
          time: prev[prev.length - 1].time + 1,
          rps: Math.floor(Math.random() * 500) + (activeChaos.includes("CPU") ? 100 : 400),
          latency: Math.floor(Math.random() * 50) + (activeChaos.includes("DB") ? 200 : 10),
          cpu: Math.floor(Math.random() * 40) + (activeChaos.includes("CPU") ? 50 : 20),
        }];
        return newData;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [activeChaos]);

  const toggleChaos = (type: string) => {
    setActiveChaos(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  return (
    <main className="min-h-screen p-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 glow-text">
            Aura Benchmark CLI
          </h1>
          <p className="text-gray-400 mt-2">Observing: distributed-core-v2</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 glass-card px-4 py-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium">System Healthy</span>
          </div>
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-semibold transition-all shadow-lg hover:shadow-purple-500/20">
            Export Report
          </button>
        </div>
      </div>

      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard title="Requests / sec" value="2.4k" trend="+12%" icon={<Zap className="text-yellow-400" />} />
        <KPICard title="P99 Latency" value="42ms" trend="-5%" icon={<Gauge className="text-purple-400" />} color="text-purple-400" />
        <KPICard title="Error Rate" value="0.02%" trend="Stable" icon={<ShieldAlert className="text-red-400" />} />
        <KPICard title="CPU Load" value="48%" trend="+2%" icon={<Cpu className="text-blue-400" />} />
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card p-6 space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Activity className="w-5 h-5 text-purple-500" /> Live Throughput & Latency
            </h2>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorRps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="time" hide />
                <YAxis stroke="#666" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111', border: '1px solid #333' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="rps" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorRps)" strokeWidth={2} />
                <Line type="monotone" dataKey="latency" stroke="#ec4899" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chaos Control Side Panel */}
        <div className="glass-card p-6 space-y-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Settings2 className="w-5 h-5 text-pink-500" /> Chaos Engine
          </h2>
          <div className="space-y-4">
            <ChaosToggle 
              active={activeChaos.includes("DB")} 
              onClick={() => toggleChaos("DB")}
              title="DB Latency Projection" 
              desc="Inject 200ms sleep on query plan"
              icon={<Database />}
            />
            <ChaosToggle 
              active={activeChaos.includes("Redis")} 
              onClick={() => toggleChaos("Redis")}
              title="Redis Saturation" 
              desc="Simulate high eviction pressure"
              icon={<BarChart3 />}
            />
            <ChaosToggle 
              active={activeChaos.includes("CPU")} 
              onClick={() => toggleChaos("CPU")}
              title="CPU Throttling" 
              desc="Cap system compute to 20%"
              icon={<CloudLightning />}
            />
          </div>
        </div>
      </div>
    </main>
  );
}

function KPICard({ title, value, trend, icon, color = "text-white" }: any) {
  return (
    <div className="glass-card p-6 hover:bg-white/[0.05] transition-colors cursor-pointer group">
      <div className="flex justify-between items-start">
        {icon}
        <span className="text-xs font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded">{trend}</span>
      </div>
      <div className="mt-4">
        <p className="text-sm text-gray-400">{title}</p>
        <h3 className={`text-2xl font-bold mt-1 ${color}`}>{value}</h3>
      </div>
    </div>
  );
}

function ChaosToggle({ title, desc, icon, active, onClick }: any) {
  return (
    <div 
      onClick={onClick}
      className={`p-4 rounded-xl border transition-all cursor-pointer ${
        active 
        ? "bg-pink-500/10 border-pink-500/50" 
        : "bg-white/5 border-white/10 hover:border-white/20"
      }`}
    >
      <div className="flex items-center gap-4">
        <div className={`p-2 rounded-lg ${active ? "bg-pink-500 text-white" : "bg-gray-800 text-gray-400"}`}>
          {icon}
        </div>
        <div>
          <h4 className="font-medium text-sm">{title}</h4>
          <p className="text-xs text-gray-400">{desc}</p>
        </div>
      </div>
    </div>
  );
}

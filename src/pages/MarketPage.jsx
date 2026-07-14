import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useFarm } from '../context/FarmContext';
import cropsData from '../data/crops.json';
import marketData from '../data/marketData.json';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { 
  TrendingUp, CircleDollarSign, BarChart2, ShieldCheck, 
  ArrowLeft, BrainCircuit, Landmark, ArrowUpRight, ArrowDownRight, Activity
} from 'lucide-react';

export const MarketPage = () => {
  const { t, language } = useLanguage();
  const { activeFarm } = useFarm();
  const [selectedCropId, setSelectedCropId] = useState('rice');

  // Find active crop statistics
  const activeMarket = marketData.find(m => m.cropId === selectedCropId) || marketData[0];
  const activeCrop = cropsData.find(c => c.id === selectedCropId) || cropsData[0];
  const activeCropName = activeCrop.name[language] || activeCrop.name['en'];

  // Calculate sparkline points for SVG rendering
  const chartPoints = activeMarket.historicalPrices || [];
  const maxPrice = Math.max(...chartPoints.map(p => p.price));
  const minPrice = Math.min(...chartPoints.map(p => p.price));
  const range = maxPrice - minPrice || 1;

  // Render SVG path coordinates based on the price data
  const chartWidth = 500;
  const chartHeight = 150;
  const padding = 20;

  const pointsString = chartPoints.map((point, index) => {
    const x = padding + (index / (chartPoints.length - 1)) * (chartWidth - padding * 2);
    // Invert y because SVG y goes down
    const y = chartHeight - padding - ((point.price - minPrice) / range) * (chartHeight - padding * 2);
    return `${x},${y}`;
  }).join(' ');

  // SVG Area coordinates to fill gradient under the line
  const areaPointsString = `${padding},${chartHeight - padding} ${pointsString} ${chartWidth - padding},${chartHeight - padding}`;

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 md:px-8 space-y-8 animate-fade-in">
      
      {/* Header */}
      <div>
        <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white mb-2 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Dashboard
        </Link>
        <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-wide">
          AI Market Intelligence 📈
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Review local mandi rates, minimum support thresholds, and buy-sell forecasts.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Mandi Prices List Panel (Left) */}
        <div className="lg:col-span-1 space-y-4">
          <Card title="Live Mandi Price Board" subtitle="Select a crop to review historical price charts.">
            <div className="space-y-2">
              {marketData.map((marketItem) => {
                const c = cropsData.find(cr => cr.id === marketItem.cropId);
                if (!c) return null;
                const isSelected = selectedCropId === marketItem.cropId;
                const name = c.name[language] || c.name['en'];
                const isUp = marketItem.priceTrend === 'up';
                const isStable = marketItem.priceTrend === 'stable';

                return (
                  <button
                    key={marketItem.cropId}
                    onClick={() => setSelectedCropId(marketItem.cropId)}
                    className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-all text-xs font-semibold
                      ${isSelected 
                        ? 'bg-farm-500/10 border-farm-500 text-white' 
                        : 'bg-slate-900/40 border-white/5 text-slate-300 hover:bg-white/5'
                      }`}
                  >
                    <span className="flex items-center gap-2">
                      <CircleDollarSign className={`w-4 h-4 ${isSelected ? 'text-farm-400' : 'text-slate-500'}`} />
                      {name}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-200 font-bold">₹{marketItem.currentPrice}</span>
                      {isUp ? (
                        <ArrowUpRight className="w-4 h-4 text-farm-400" />
                      ) : isStable ? (
                        <span className="text-[10px] text-slate-500 uppercase font-extrabold tracking-wider">STB</span>
                      ) : (
                        <ArrowDownRight className="w-4 h-4 text-rose-400" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>

          {/* AGMARKNET / eNAM Future Integrations info */}
          <div className="bg-slate-900/20 border border-white/5 rounded-2xl p-4 text-[10px] font-semibold text-slate-400 space-y-2">
            <span className="text-farm-400 uppercase tracking-widest block font-bold mb-1">Scale Scope (Future)</span>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-farm-500 shrink-0 mt-1" />
              <span>Direct AGMARKNET integration for daily state mandi rate streams.</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-farm-500 shrink-0 mt-1" />
              <span>eNAM API connection enabling direct bidding and trade from dashboard.</span>
            </div>
          </div>
        </div>

        {/* Detailed Chart & Forecast (Right) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Main price card details */}
          <Card 
            title={`Market Analysis: ${activeCropName}`}
            hoverGlow={true}
            variant="green"
            headerActions={
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-widest
                ${activeMarket.sellingAdvice === 'HOLD' 
                  ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' 
                  : 'text-farm-400 bg-farm-500/10 border-farm-500/20'
                }`}
              >
                AI Advice: {activeMarket.sellingAdvice}
              </span>
            }
          >
            <div className="space-y-6">
              
              {/* Financial values row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-950/40 border border-white/5 rounded-xl p-3">
                  <span className="text-[9px] text-slate-500 font-bold block uppercase tracking-wider mb-0.5">Current Rate</span>
                  <span className="text-lg font-black text-white">{formatCurrency(activeMarket.currentPrice)} <span className="text-[10px] text-slate-400 font-normal">/ Qtl</span></span>
                </div>
                <div className="bg-slate-950/40 border border-white/5 rounded-xl p-3">
                  <span className="text-[9px] text-slate-500 font-bold block uppercase tracking-wider mb-0.5">Projected Rate</span>
                  <span className="text-lg font-black text-amber-400">{formatCurrency(activeMarket.projectedPrice)} <span className="text-[10px] text-slate-400 font-normal">/ Qtl</span></span>
                </div>
                <div className="bg-slate-950/40 border border-white/5 rounded-xl p-3">
                  <span className="text-[9px] text-slate-500 font-bold block uppercase tracking-wider mb-0.5">Govt MSP Limit</span>
                  <span className="text-lg font-black text-emerald-400">
                    {activeMarket.minSupportPrice > 0 ? formatCurrency(activeMarket.minSupportPrice) : 'Not Applicable'}
                  </span>
                </div>
              </div>

              {/* Price Line Chart SVG */}
              <div className="bg-slate-950/40 border border-white/5 rounded-2xl p-4">
                <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider mb-4 flex items-center gap-1">
                  <BarChart2 className="w-3.5 h-3.5 text-farm-500" />
                  Price Trend History (Last 6 Months)
                </span>
                
                {/* SVG Graph wrapper */}
                <div className="w-full overflow-x-auto">
                  <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto min-w-[400px]">
                    <defs>
                      <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#22c55e" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#22c55e" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Horizontal background grid lines */}
                    <line x1={padding} y1={padding} x2={chartWidth - padding} y2={padding} stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                    <line x1={padding} y1={chartHeight / 2} x2={chartWidth - padding} y2={chartHeight / 2} stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                    <line x1={padding} y1={chartHeight - padding} x2={chartWidth - padding} y2={chartHeight - padding} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />

                    {/* Gradient Area under curve */}
                    <polygon points={areaPointsString} fill="url(#chartGradient)" />

                    {/* Trend Line path */}
                    <polyline
                      fill="none"
                      stroke="#22c55e"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      points={pointsString}
                    />

                    {/* Data circle points */}
                    {chartPoints.map((point, index) => {
                      const x = padding + (index / (chartPoints.length - 1)) * (chartWidth - padding * 2);
                      const y = chartHeight - padding - ((point.price - minPrice) / range) * (chartHeight - padding * 2);
                      return (
                        <g key={index} className="group cursor-pointer">
                          <circle cx={x} cy={y} r="5" fill="#16a34a" stroke="#fff" strokeWidth="1.5" />
                          <text x={x} y={y - 10} fill="#a7f3d0" fontSize="9" fontWeight="bold" textAnchor="middle" className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 duration-150">
                            ₹{point.price}
                          </text>
                        </g>
                      );
                    })}

                    {/* X-Axis labels */}
                    {chartPoints.map((point, index) => {
                      const x = padding + (index / (chartPoints.length - 1)) * (chartWidth - padding * 2);
                      return (
                        <text key={index} x={x} y={chartHeight - 4} fill="#64748b" fontSize="8" fontWeight="bold" textAnchor="middle">
                          {point.month}
                        </text>
                      );
                    })}

                  </svg>
                </div>
              </div>

              {/* AI Selling Recommendation */}
              <div className="bg-farm-950/20 border border-farm-500/20 rounded-2xl p-5">
                <h4 className="text-xs font-bold text-white tracking-wide uppercase flex items-center gap-1.5 mb-2">
                  <Activity className="w-4 h-4 text-farm-400 animate-pulse" />
                  AI Intelligence Report
                </h4>
                <p className="text-xs text-slate-200 leading-relaxed font-semibold">
                  "{activeMarket.aiReasoning[language] || activeMarket.aiReasoning['en']}"
                </p>
              </div>

            </div>
          </Card>

        </div>

      </div>

    </div>
  );
};

export default MarketPage;

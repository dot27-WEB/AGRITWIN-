import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useFarm } from '../context/FarmContext';
import farmingCalendarData from '../data/farmingCalendar.json';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { 
  CalendarDays, CheckCircle2, Circle, BrainCircuit, 
  ArrowLeft, Tractor, Sprout, Layers, Activity, Shield, Sparkles, TrendingUp
} from 'lucide-react';

export const FarmingCalendarPage = () => {
  const { t, language } = useLanguage();
  const { activeFarm, computedMetrics, toggleCalendarTask } = useFarm();

  if (!activeFarm || !computedMetrics) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center text-center p-6">
        <BrainCircuit className="w-16 h-16 text-slate-600 mb-4 animate-pulse" />
        <h3 className="text-xl font-bold text-white mb-2">{t('noActiveTwin')}</h3>
        <Link to="/create-twin">
          <Button variant="primary">Create Twin</Button>
        </Link>
      </div>
    );
  }

  // Fetch the schedule timeline for active farm crop
  // Fallback to Rice timeline if crop calendar isn't explicitly defined
  const cropCalendar = farmingCalendarData.find(c => c.cropId === activeFarm.currentCrop) || farmingCalendarData[0];
  const timeline = cropCalendar.timeline;
  const completedTasks = activeFarm.calendarCompletedTasks || [];

  const getIcon = (iconName) => {
    switch (iconName) {
      case 'Tractor': return Tractor;
      case 'Sprout': return Sprout;
      case 'Layers': return Layers;
      case 'Activity': return Activity;
      case 'Shield': return Shield;
      case 'Sparkles': return Sparkles;
      case 'TrendingUp': return TrendingUp;
      default: return CalendarDays;
    }
  };

  const completionPercentage = timeline.length > 0 
    ? Math.round((completedTasks.length / timeline.length) * 100) 
    : 0;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 md:px-8 space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white mb-2 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Dashboard
          </Link>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-wide">
            Interactive Operations Calendar 📅
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Season milestones checklist for crop twin: <strong className="text-farm-400 uppercase">{activeFarm.currentCrop}</strong>
          </p>
        </div>

        {/* Progress Display */}
        <div className="bg-slate-900/40 border border-white/5 px-4 py-2 rounded-xl shrink-0 text-center sm:text-left flex items-center gap-3">
          <div className="text-left">
            <span className="text-[9px] text-slate-500 font-bold block uppercase tracking-wider">Season progress</span>
            <span className="text-sm font-black text-farm-400">{completionPercentage}% Completed</span>
          </div>
          <div className="h-9 w-9 rounded-full bg-slate-950 flex items-center justify-center border border-white/5 font-mono text-[10px] text-slate-200 font-bold">
            {completedTasks.length}/{timeline.length}
          </div>
        </div>
      </div>

      {/* Timeline Steps Card Wrapper */}
      <Card hoverGlow={false}>
        <div className="relative pl-6 sm:pl-10 space-y-8">
          
          {/* Vertical axis line connecting nodes */}
          <div className="absolute left-[37px] sm:left-[53px] top-6 bottom-6 w-[2px] bg-slate-800/80 z-0" />

          {timeline.map((step, index) => {
            const isCompleted = completedTasks.includes(step.id);
            const IconComp = getIcon(step.icon);
            const phaseTitle = step.phase[language] || step.phase['en'];
            const timeframe = step.timeframe[language] || step.timeframe['en'];
            const activityDesc = step.activity[language] || step.activity['en'];

            return (
              <div 
                key={step.id} 
                className={`relative flex items-start gap-4 transition-all duration-300 z-10
                  ${isCompleted ? 'opacity-100' : 'opacity-70 hover:opacity-100'}`}
              >
                
                {/* Complete Action Checkbox (Leftmost) */}
                <button
                  onClick={() => toggleCalendarTask(activeFarm.id, step.id)}
                  className="mt-2 text-slate-500 hover:text-farm-400 transition-colors shrink-0 outline-none"
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-farm-500 fill-farm-500/10 glowing-badge rounded-full" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-700 hover:text-slate-400" />
                  )}
                </button>

                {/* Styled Phase Icon */}
                <div 
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-all duration-300
                    ${isCompleted 
                      ? 'bg-farm-950/20 border-farm-500/30 text-farm-400' 
                      : 'bg-slate-950 border-white/5 text-slate-500'
                    }`}
                >
                  <IconComp className="w-4 h-4" />
                </div>

                {/* Operational Details Card */}
                <div className="flex-1 bg-slate-950/40 border border-white/5 hover:border-white/10 rounded-2xl p-4 transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-2">
                    <h4 className={`text-xs font-black tracking-wider uppercase
                      ${isCompleted ? 'text-farm-400' : 'text-slate-200'}`}>
                      {phaseTitle}
                    </h4>
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest bg-slate-900 border border-white/5 px-2 py-0.5 rounded">
                      {timeframe}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-relaxed font-semibold">
                    {activityDesc}
                  </p>
                </div>

              </div>
            );
          })}

        </div>
      </Card>

    </div>
  );
};

export default FarmingCalendarPage;

import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useFarm } from '../context/FarmContext';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { 
  Landmark, ShieldCheck, ShieldX, HelpCircle, 
  ArrowLeft, BrainCircuit, LandmarkIcon, CheckCircle2 
} from 'lucide-react';
import { checkSchemeEligibility } from '../utils/schemeEligibility';

export const GovernmentSchemesPage = () => {
  const { t, language } = useLanguage();
  const { activeFarm, computedMetrics } = useFarm();

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

  // Live scheme eligibility calculations
  const eligibleSchemes = checkSchemeEligibility(activeFarm);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 md:px-8 space-y-8 animate-fade-in">
      
      {/* Header */}
      <div>
        <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white mb-2 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Dashboard
        </Link>
        <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-wide">
          Government Schemes Matcher 🏛️
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Automatically checks policy eligibility thresholds based on your digital farm profile variables.
        </p>
      </div>

      {/* Schemes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {eligibleSchemes.map((scheme) => {
          const name = scheme.name[language] || scheme.name['en'];
          const desc = scheme.description[language] || scheme.description['en'];
          const benefits = scheme.benefits[language] || scheme.benefits['en'];
          const eligibilityText = scheme.eligibility[language] || scheme.eligibility['en'];
          const reason = scheme.reason[language] || scheme.reason['en'];

          return (
            <Card 
              key={scheme.id}
              hoverGlow={true}
              variant={scheme.eligible ? "green" : "standard"}
              title={
                <div className="flex items-center justify-between w-full">
                  <span className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                    <LandmarkIcon className={`w-5 h-5 ${scheme.eligible ? 'text-farm-400' : 'text-slate-500'}`} />
                    {name.split(' (')[0]}
                  </span>
                  
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase tracking-widest flex items-center gap-1
                    ${scheme.eligible 
                      ? 'text-farm-400 bg-farm-500/10 border-farm-500/20' 
                      : 'text-rose-400 bg-rose-500/10 border-rose-500/20'
                    }`}
                  >
                    {scheme.eligible ? <ShieldCheck className="w-3 h-3" /> : <ShieldX className="w-3 h-3" />}
                    {scheme.eligible ? 'Eligible' : 'Ineligible'}
                  </span>
                </div>
              }
            >
              <div className="space-y-4">
                
                {/* Benefits Banner */}
                {scheme.eligible && (
                  <div className="bg-farm-950/20 border border-farm-500/20 rounded-xl p-3 flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-bold">Estimated Benefits:</span>
                    <span className="text-farm-400 font-black tracking-wide">{scheme.estimatedBenefit}</span>
                  </div>
                )}

                {/* Scheme details */}
                <div className="space-y-2">
                  <div>
                    <span className="text-[9px] text-slate-500 font-bold block uppercase tracking-wider">Description</span>
                    <p className="text-xs text-slate-300 leading-relaxed font-semibold mt-0.5">
                      {desc}
                    </p>
                  </div>

                  <div>
                    <span className="text-[9px] text-slate-500 font-bold block uppercase tracking-wider">Direct Coverage Advantages</span>
                    <p className="text-xs text-slate-300 leading-relaxed font-semibold mt-0.5">
                      {benefits}
                    </p>
                  </div>
                </div>

                {/* Eligibility criteria */}
                <div className="bg-slate-950/40 border border-white/5 rounded-xl p-3 text-[11px] font-semibold text-slate-400">
                  <span className="text-slate-500 block text-[9px] font-bold uppercase tracking-wider mb-1">Standard Criteria</span>
                  {eligibilityText}
                </div>

                {/* Live eligibility audit reason */}
                <div className={`p-3.5 rounded-xl border text-[11.px] font-semibold italic
                  ${scheme.eligible 
                    ? 'bg-farm-950/10 border-farm-500/10 text-farm-400' 
                    : 'bg-rose-950/15 border-rose-500/10 text-rose-300'
                  }`}
                >
                  <span className="text-[9px] text-slate-500 font-bold block uppercase tracking-wider mb-1 not-italic flex items-center gap-1">
                    <HelpCircle className="w-3.5 h-3.5" />
                    AI Eligibility Audit
                  </span>
                  "{reason}"
                </div>

              </div>
            </Card>
          );
        })}
      </div>

    </div>
  );
};

export default GovernmentSchemesPage;

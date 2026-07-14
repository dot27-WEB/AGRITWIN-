import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useFarm } from '../context/FarmContext';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import cropsData from '../data/crops.json';
import { 
  Tractor, Droplets, History, Save, ArrowLeft, ArrowRight, 
  MapPin, Maximize2, Cpu, FileText, CheckCircle2 
} from 'lucide-react';
import '../styles/forms.css';

export const CreateFarmTwinPage = () => {
  const { t, language } = useLanguage();
  const { addFarm, profile } = useFarm();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    farmerName: profile?.name || 'Ramesh Kumar',
    village: 'Kurnool District',
    landSize: '4',
    soilType: 'Loamy',
    waterAvailability: 'Borewell',
    irrigationMethod: 'Drip',
    currentCrop: 'rice',
    previousCrop: 'groundnut',
    prev2Crop: 'wheat',
    fertilizersUsed: ['Manure', 'NPK']
  });

  const soilTypes = ['Clayey', 'Loamy', 'Sandy', 'Black', 'Red'];
  const waterSources = ['Well', 'Borewell', 'Canal', 'Rainfed'];
  const irrigationMethods = ['Drip', 'Sprinkler', 'Flood', 'Manual'];
  const fertilizerOptions = ['Manure', 'Urea', 'NPK', 'Potash'];

  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (option) => {
    setFormData(prev => {
      const active = prev.fertilizersUsed || [];
      const updated = active.includes(option)
        ? active.filter(item => item !== option)
        : [...active, option];
      return { ...prev, fertilizersUsed: updated };
    });
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const handleAssembleTwin = (e) => {
    e.preventDefault();
    addFarm(formData);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-[85vh] py-10 px-4 md:px-8 relative">
      <div className="absolute top-10 left-10 w-96 h-96 bg-farm-500/5 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-500/5 rounded-full filter blur-3xl pointer-events-none" />

      <div className="max-w-2xl mx-auto relative z-10 animate-fade-in">
        
        {/* Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-farm-500/10 border border-farm-500/20 text-farm-400 text-xs font-semibold mb-3">
            <Cpu className="w-4 h-4 animate-spin-slow" />
            VIRTUAL ENGINE INITIALIZER
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-wide">
            Assemble Your Digital Farm Twin 🌾
          </h2>
          <p className="text-xs text-slate-400 mt-2 max-w-md mx-auto">
            Input soil, irrigation, and crop history variables to construct your virtual twin profile.
          </p>
        </div>

        {/* Stepper Wizard Indicator */}
        <div className="flex items-center justify-between mb-8 px-8 relative">
          <div className="absolute left-10 right-10 top-5 h-[2px] bg-slate-800 z-0" />
          
          <div className="z-10 flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs border-2 transition-all step-indicator
              ${step === 1 ? 'step-indicator active border-transparent text-white' : 'bg-slate-900 border-slate-800 text-slate-400'}`}>
              1
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-2">Farm Basics</span>
          </div>

          <div className="z-10 flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs border-2 transition-all step-indicator
              ${step === 2 ? 'step-indicator active border-transparent text-white' : 'bg-slate-900 border-slate-800 text-slate-400'}`}>
              2
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-2">Soil & Water</span>
          </div>

          <div className="z-10 flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs border-2 transition-all step-indicator
              ${step === 3 ? 'step-indicator active border-transparent text-white' : 'bg-slate-900 border-slate-800 text-slate-400'}`}>
              3
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-2">Crop History</span>
          </div>
        </div>

        {/* Card Form container */}
        <Card hoverGlow={false} className="border-white/10">
          <form onSubmit={handleAssembleTwin} className="space-y-6">
            
            {/* STEP 1: FARM BASICS */}
            {step === 1 && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center gap-2 mb-2 border-b border-white/5 pb-2 text-farm-400">
                  <Tractor className="w-5 h-5" />
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">Step 1: Location & Land Scale</h4>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Farmer Profile Name</label>
                  <input
                    type="text"
                    name="farmerName"
                    required
                    value={formData.farmerName}
                    onChange={handleTextChange}
                    className="glass-input w-full px-4 py-3 rounded-xl text-xs text-slate-200"
                    placeholder="Farmer Name"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">{t('location')}</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      name="village"
                      required
                      value={formData.village}
                      onChange={handleTextChange}
                      className="glass-input w-full pl-11 pr-4 py-3 rounded-xl text-xs text-slate-200"
                      placeholder="Village Name, State"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">{t('landSize')}</label>
                  <div className="relative">
                    <Maximize2 className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
                    <input
                      type="number"
                      name="landSize"
                      required
                      min="0.5"
                      max="100"
                      step="0.5"
                      value={formData.landSize}
                      onChange={handleTextChange}
                      className="glass-input w-full pl-11 pr-4 py-3 rounded-xl text-xs text-slate-200"
                      placeholder="Acre size (e.g. 5)"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: SOIL & WATER */}
            {step === 2 && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center gap-2 mb-2 border-b border-white/5 pb-2 text-farm-400">
                  <Droplets className="w-5 h-5" />
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">Step 2: Soil & Irrigation Variables</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">{t('soilType')}</label>
                    <select
                      name="soilType"
                      value={formData.soilType}
                      onChange={handleTextChange}
                      className="glass-input w-full px-4 py-3 rounded-xl text-xs text-slate-200"
                    >
                      {soilTypes.map(soil => (
                        <option key={soil} value={soil}>{soil} Soil</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">{t('waterAvailability')}</label>
                    <select
                      name="waterAvailability"
                      value={formData.waterAvailability}
                      onChange={handleTextChange}
                      className="glass-input w-full px-4 py-3 rounded-xl text-xs text-slate-200"
                    >
                      {waterSources.map(src => (
                        <option key={src} value={src}>{src}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">{t('irrigationMethod')}</label>
                  <select
                    name="irrigationMethod"
                    value={formData.irrigationMethod}
                    onChange={handleTextChange}
                    className="glass-input w-full px-4 py-3 rounded-xl text-xs text-slate-200"
                  >
                    {irrigationMethods.map(method => (
                      <option key={method} value={method}>{method} System</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* STEP 3: CROPPING HISTORY */}
            {step === 3 && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center gap-2 mb-2 border-b border-white/5 pb-2 text-farm-400">
                  <History className="w-5 h-5" />
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">Step 3: Rotational Crops & Fertilizer History</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-2">{t('currentCrop')}</label>
                    <select
                      name="currentCrop"
                      value={formData.currentCrop}
                      onChange={handleTextChange}
                      className="glass-input w-full px-3 py-2.5 rounded-xl text-[11px] text-slate-200"
                    >
                      {cropsData.map(c => (
                        <option key={c.id} value={c.id}>{c.name[language] || c.name['en']}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-2">{t('previousCrop')}</label>
                    <select
                      name="previousCrop"
                      value={formData.previousCrop}
                      onChange={handleTextChange}
                      className="glass-input w-full px-3 py-2.5 rounded-xl text-[11px] text-slate-200"
                    >
                      {cropsData.map(c => (
                        <option key={c.id} value={c.id}>{c.name[language] || c.name['en']}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-2">{t('prev2Crop')}</label>
                    <select
                      name="prev2Crop"
                      value={formData.prev2Crop}
                      onChange={handleTextChange}
                      className="glass-input w-full px-3 py-2.5 rounded-xl text-[11px] text-slate-200"
                    >
                      {cropsData.map(c => (
                        <option key={c.id} value={c.id}>{c.name[language] || c.name['en']}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Fertilizers used multi-check */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                    {t('fertilizerUsed')}
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {fertilizerOptions.map((opt) => {
                      const isChecked = formData.fertilizersUsed.includes(opt);
                      return (
                        <button
                          type="button"
                          key={opt}
                          onClick={() => handleCheckboxChange(opt)}
                          className={`flex items-center justify-between px-4 py-3 rounded-xl border text-xs transition-all font-semibold
                            ${isChecked 
                              ? 'bg-farm-500/10 border-farm-500 text-farm-400 shadow-lg shadow-farm-900/10'
                              : 'bg-slate-900/40 border-white/5 text-slate-400 hover:bg-white/5'
                            }`}
                        >
                          {opt}
                          {isChecked && <CheckCircle2 className="w-4 h-4 text-farm-500" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Stepper Actions footer */}
            <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-6">
              {step > 1 ? (
                <Button 
                  variant="secondary" 
                  onClick={prevStep}
                  icon={ArrowLeft}
                  className="text-xs py-2 px-4"
                >
                  {t('buttonBack')}
                </Button>
              ) : (
                <div />
              )}

              {step < 3 ? (
                <Button
                  variant="primary"
                  onClick={nextStep}
                  icon={ArrowRight}
                  className="text-xs py-2 px-5 ml-auto"
                >
                  {t('buttonNext')}
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="accent"
                  icon={Save}
                  className="text-xs py-2 px-5 ml-auto font-bold"
                >
                  {t('buttonSaveTwin')}
                </Button>
              )}
            </div>

          </form>
        </Card>

      </div>
    </div>
  );
};

export default CreateFarmTwinPage;

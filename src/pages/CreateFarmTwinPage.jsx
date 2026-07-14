import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useFarm } from '../context/FarmContext';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import cropsData from '../data/crops.json';
import { 
  Tractor, Droplets, History, Save, ArrowLeft, ArrowRight, 
  MapPin, Maximize2, Cpu, FileText, CheckCircle2,
  Navigation, Search, Loader2, Edit2, AlertTriangle, Check
} from 'lucide-react';
import '../styles/forms.css';

export const CreateFarmTwinPage = () => {
  const { t, language } = useLanguage();
  const { addFarm, profile } = useFarm();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    farmerName: profile?.name || 'Ramesh Kumar',
    village: '',
    landSize: '4',
    soilType: 'Loamy',
    waterAvailability: 'Borewell',
    irrigationMethod: 'Drip',
    currentCrop: 'rice',
    previousCrop: 'groundnut',
    prev2Crop: 'wheat',
    fertilizersUsed: ['Manure', 'NPK'],
    
    // Geolocation fields
    latitude: null,
    longitude: null,
    mandal: '',
    district: '',
    state: '',
    country: 'India',
    postalCode: '',
    locationSource: '' // 'GPS' or 'Manual'
  });

  // Location UI States
  const [locationMode, setLocationMode] = useState(null); // null | 'gps' | 'manual' | 'confirmed'
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [autocompleteSuggestions, setAutocompleteSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [manualInputs, setManualInputs] = useState({
    village: '',
    mandal: '',
    district: '',
    state: '',
    country: 'India',
    postalCode: ''
  });

  useEffect(() => {
    const handleOutsideClick = () => {
      setShowSuggestions(false);
    };
    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  const handleUseGPS = () => {
    setLocationLoading(true);
    setLocationError(null);
    setLocationMode('gps');

    if (!navigator.geolocation) {
      setLocationError("Location permission was not granted. Please enter your farm location manually.");
      setLocationLoading(false);
      setLocationMode('manual');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
            { headers: { 'Accept-Language': 'en' } }
          );
          if (!response.ok) throw new Error("Reverse geocoding failed");
          const data = await response.json();
          const addr = data.address || {};
          
          const villageName = addr.village || addr.town || addr.city || addr.hamlet || addr.suburb || addr.neighbourhood || '';
          const mandalName = addr.subdistrict || addr.tehsil || addr.taluk || addr.mandal || '';
          const districtName = addr.district || addr.state_district || addr.county || '';
          const stateName = addr.state || '';
          const countryName = addr.country || 'India';
          const postCode = addr.postcode || '';

          setFormData(prev => ({
            ...prev,
            latitude,
            longitude,
            village: villageName,
            mandal: mandalName,
            district: districtName,
            state: stateName,
            country: countryName,
            postalCode: postCode,
            locationSource: 'GPS'
          }));

          setManualInputs({
            village: villageName,
            mandal: mandalName,
            district: districtName,
            state: stateName,
            country: countryName,
            postalCode: postCode
          });
        } catch (err) {
          console.error(err);
          setFormData(prev => ({
            ...prev,
            latitude,
            longitude,
            locationSource: 'GPS'
          }));
          setLocationError("Could not automatically retrieve address details. Please fill in the details manually below.");
        } finally {
          setLocationLoading(false);
        }
      },
      (error) => {
        console.warn("GPS access error:", error);
        setLocationError("Location permission was not granted. Please enter your farm location manually.");
        setLocationLoading(false);
        setLocationMode('manual');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleManualSearch = async (query) => {
    setManualInputs(prev => ({ ...prev, village: query }));
    if (!query || query.trim().length < 3) {
      setAutocompleteSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=in&addressdetails=1&limit=5`,
        { headers: { 'Accept-Language': 'en' } }
      );
      if (response.ok) {
        const data = await response.json();
        setAutocompleteSuggestions(data);
        setShowSuggestions(true);
      }
    } catch (err) {
      console.warn("Autocomplete fetch error:", err);
    }
  };

  const handleSelectSuggestion = (suggestion) => {
    const addr = suggestion.address || {};
    const villageName = addr.village || addr.town || addr.city || addr.hamlet || addr.suburb || addr.neighbourhood || '';
    const mandalName = addr.subdistrict || addr.tehsil || addr.taluk || addr.mandal || '';
    const districtName = addr.district || addr.state_district || addr.county || '';
    const stateName = addr.state || '';
    const countryName = addr.country || 'India';
    const postCode = addr.postcode || '';

    setManualInputs({
      village: villageName || suggestion.name || '',
      mandal: mandalName,
      district: districtName,
      state: stateName,
      country: countryName,
      postalCode: postCode
    });

    setFormData(prev => ({
      ...prev,
      latitude: parseFloat(suggestion.lat) || null,
      longitude: parseFloat(suggestion.lon) || null,
      locationSource: 'Manual'
    }));

    setAutocompleteSuggestions([]);
    setShowSuggestions(false);
  };

  const handleConfirmLocation = () => {
    if (!manualInputs.state || !manualInputs.district || !manualInputs.village) {
      setLocationError("Please fill out State, District, and Village/Town fields.");
      return;
    }

    setFormData(prev => ({
      ...prev,
      village: manualInputs.village,
      mandal: manualInputs.mandal,
      district: manualInputs.district,
      state: manualInputs.state,
      country: manualInputs.country || 'India',
      postalCode: manualInputs.postalCode,
      locationSource: formData.locationSource || 'Manual'
    }));

    setLocationMode('confirmed');
    setLocationError(null);
  };

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

  const nextStep = () => {
    if (step === 1 && locationMode !== 'confirmed') {
      setLocationError("Please select and confirm your farm location before proceeding.");
      return;
    }
    setStep(prev => Math.min(prev + 1, 3));
  };
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const handleAssembleTwin = (e) => {
    e.preventDefault();
    if (locationMode !== 'confirmed') {
      setLocationError("Please select and confirm your farm location before proceeding.");
      return;
    }
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

                {/* Farm Location Selection Card */}
                <div className="border border-white/10 rounded-2xl p-5 bg-slate-900/40 space-y-4">
                  <div className="flex items-center gap-2 border-b border-white/5 pb-2 text-farm-400">
                    <MapPin className="w-4.5 h-4.5" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Farm Location</span>
                  </div>

                  {locationError && (
                    <div className="bg-rose-950/20 border border-rose-500/20 text-rose-300 rounded-xl p-3 text-xs flex items-start gap-2 font-medium">
                      <AlertTriangle className="w-4.5 h-4.5 text-rose-400 shrink-0 mt-0.5" />
                      <span>{locationError}</span>
                    </div>
                  )}

                  {locationMode === 'confirmed' ? (
                    /* Confirmation Card Display */
                    <div className="space-y-4 animate-fade-in text-left">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-950/30 p-4 rounded-xl border border-white/5">
                        <div className="space-y-1">
                          <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Village / Town</span>
                          <span className="font-semibold text-slate-200">{formData.village || 'N/A'}</span>
                        </div>
                        {formData.mandal && (
                          <div className="space-y-1">
                            <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Mandal / Taluk</span>
                            <span className="font-semibold text-slate-200">{formData.mandal}</span>
                          </div>
                        )}
                        <div className="space-y-1">
                          <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">District</span>
                          <span className="font-semibold text-slate-200">{formData.district || 'N/A'}</span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">State</span>
                          <span className="font-semibold text-slate-200">{formData.state || 'N/A'}</span>
                        </div>
                        {formData.postalCode && (
                          <div className="space-y-1">
                            <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">Postal Code</span>
                            <span className="font-semibold text-slate-200">{formData.postalCode}</span>
                          </div>
                        )}
                        {formData.latitude && formData.longitude && (
                          <div className="space-y-1 sm:col-span-2">
                            <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-wider">GPS Coordinates</span>
                            <span className="font-semibold text-slate-400 font-mono text-[11px]">
                              {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between bg-farm-950/20 border border-farm-500/20 rounded-xl p-3.5">
                        <div className="flex items-center gap-2">
                          <Check className="w-5 h-5 text-farm-400 shrink-0" />
                          <div className="text-left">
                            <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Location Status</span>
                            <span className="text-xs font-bold text-farm-400">
                              {formData.locationSource === 'GPS' ? '✔ Verified using GPS' : '✔ Entered Manually'}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setLocationMode(null);
                            setManualInputs(prev => ({
                              ...prev,
                              village: formData.village || '',
                              mandal: formData.mandal || '',
                              district: formData.district || '',
                              state: formData.state || '',
                              postalCode: formData.postalCode || ''
                            }));
                          }}
                          className="px-3 py-1.5 rounded-lg bg-slate-900 border border-white/10 hover:border-white/20 text-[10px] font-bold text-slate-300 hover:text-white transition-all cursor-pointer flex items-center gap-1"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Change</span>
                        </button>
                      </div>
                    </div>
                  ) : locationMode === 'gps' || locationMode === 'manual' ? (
                    /* Input Address Details (Manual entry / GPS edit view) */
                    <div className="space-y-4 animate-fade-in text-left">
                      {locationLoading ? (
                        <div className="flex flex-col items-center justify-center py-6 space-y-2 text-slate-400 text-xs">
                          <Loader2 className="w-6 h-6 animate-spin text-farm-400" />
                          <span>Accessing device GPS and reverse geocoding address...</span>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {/* Village Input with Autocomplete search (only when in manual mode) */}
                          <div className="relative">
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Village / Town *</label>
                            <input
                              type="text"
                              value={manualInputs.village}
                              onChange={(e) => {
                                if (locationMode === 'manual') {
                                  handleManualSearch(e.target.value);
                                } else {
                                  setManualInputs(prev => ({ ...prev, village: e.target.value }));
                                }
                              }}
                              onFocus={(e) => {
                                if (locationMode === 'manual' && autocompleteSuggestions.length > 0) {
                                  e.stopPropagation();
                                  setShowSuggestions(true);
                                }
                              }}
                              className="glass-input w-full px-3 py-2.5 rounded-lg text-xs text-slate-200"
                              placeholder="Type village/town name..."
                              required
                            />
                            
                            {locationMode === 'manual' && showSuggestions && autocompleteSuggestions.length > 0 && (
                              <div className="absolute left-0 right-0 mt-1 bg-slate-950 border border-white/10 rounded-lg shadow-xl max-h-48 overflow-y-auto z-50">
                                {autocompleteSuggestions.map((s, idx) => (
                                  <div
                                    key={idx}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleSelectSuggestion(s);
                                    }}
                                    className="px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-900 cursor-pointer transition-colors border-b border-white/5 last:border-0"
                                  >
                                    {s.display_name}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Mandal / Taluk</label>
                              <input
                                type="text"
                                value={manualInputs.mandal}
                                onChange={(e) => setManualInputs(prev => ({ ...prev, mandal: e.target.value }))}
                                className="glass-input w-full px-3 py-2.5 rounded-lg text-xs text-slate-200"
                                placeholder="Mandal or Taluk"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">District *</label>
                              <input
                                type="text"
                                value={manualInputs.district}
                                onChange={(e) => setManualInputs(prev => ({ ...prev, district: e.target.value }))}
                                className="glass-input w-full px-3 py-2.5 rounded-lg text-xs text-slate-200"
                                placeholder="District Name"
                                required
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">State *</label>
                              <input
                                type="text"
                                value={manualInputs.state}
                                onChange={(e) => setManualInputs(prev => ({ ...prev, state: e.target.value }))}
                                className="glass-input w-full px-3 py-2.5 rounded-lg text-xs text-slate-200"
                                placeholder="State Name"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Pincode (Optional)</label>
                              <input
                                type="text"
                                value={manualInputs.postalCode}
                                onChange={(e) => setManualInputs(prev => ({ ...prev, postalCode: e.target.value }))}
                                className="glass-input w-full px-3 py-2.5 rounded-lg text-xs text-slate-200"
                                placeholder="e.g. 500001"
                              />
                            </div>
                          </div>

                          <div className="pt-3 flex gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setLocationMode(null);
                                setAutocompleteSuggestions([]);
                                setShowSuggestions(false);
                              }}
                              className="flex-grow py-2 rounded-xl bg-slate-900 border border-white/5 text-slate-400 text-xs font-bold hover:bg-white/5 hover:text-white transition-all cursor-pointer"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={handleConfirmLocation}
                              className="flex-grow py-2 rounded-xl bg-farm-600 hover:bg-farm-500 text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1"
                            >
                              <Check className="w-4 h-4" />
                              <span>Confirm Location</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Initial Location Options Display */
                    <div className="space-y-4 py-2">
                      <div className="space-y-2">
                        <button
                          type="button"
                          onClick={handleUseGPS}
                          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-farm-500 bg-farm-500/10 hover:bg-farm-500/20 text-farm-400 hover:text-farm-300 text-xs font-bold transition-all shadow-lg shadow-farm-900/10 cursor-pointer group"
                        >
                          <Navigation className="w-4 h-4 text-farm-400 group-hover:animate-pulse" />
                          <span>📍 Use Current Location (Recommended)</span>
                        </button>
                        <p className="text-[10px] text-slate-500 leading-normal font-medium">
                          Retrieves exact coordinates and address using your device's browser GPS.
                        </p>
                      </div>

                      <div className="relative flex py-2 items-center">
                        <div className="flex-grow border-t border-white/5"></div>
                        <span className="flex-shrink mx-4 text-[10px] font-bold text-slate-600 tracking-wider uppercase">OR</span>
                        <div className="flex-grow border-t border-white/5"></div>
                      </div>

                      <div className="space-y-2">
                        <button
                          type="button"
                          onClick={() => setLocationMode('manual')}
                          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-white/5 bg-slate-900/40 hover:bg-white/5 text-slate-300 hover:text-white text-xs font-bold transition-all cursor-pointer"
                        >
                          <Search className="w-4 h-4 text-slate-400" />
                          <span>✍️ Enter Farm Location Manually</span>
                        </button>
                        <p className="text-[10px] text-slate-500 leading-normal font-medium">
                          Enter State, District, and Village/Town manually with typeahead lookup.
                        </p>
                      </div>
                    </div>
                  )}
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

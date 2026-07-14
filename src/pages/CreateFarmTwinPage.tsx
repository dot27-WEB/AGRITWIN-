import React, { useState, useEffect } from "react";
import { useFarm, FarmProfile } from "../context/FarmContext";
import { useLanguage } from "../context/LanguageContext";
import { Card } from "../components/common/Card";
import { Button } from "../components/common/Button";
import { 
  Sprout, Save, ArrowLeft, Info, HelpCircle,
  MapPin, AlertTriangle, Loader2, Navigation, Search, Check, Edit2
} from "lucide-react";

interface ManualInputs {
  village: string;
  mandal: string;
  district: string;
  state: string;
  country: string;
  postalCode: string;
}

export const CreateFarmTwinPage: React.FC = () => {
  const { profile, createOrUpdateProfile, navigateTo } = useFarm();
  const { t } = useLanguage();

  const [form, setForm] = useState<FarmProfile>({
    farmerName: profile?.farmerName || "",
    village: profile?.village || "",
    landSize: profile?.landSize || 5,
    soilType: profile?.soilType || "Black Soil / Clayey",
    waterAvailability: profile?.waterAvailability || "Borewell + Canal",
    currentCrop: profile?.currentCrop || "Paddy (Rice)",
    prevCrop: profile?.prevCrop || "Paddy (Rice)",
    prevPrevCrop: profile?.prevPrevCrop || "Groundnut",
    irrigationMethod: profile?.irrigationMethod || "Flood Irrigation",
    fertilizersUsed: profile?.fertilizersUsed || "NPK Chemical + Urea",
    
    // Geolocation fields
    latitude: null,
    longitude: null,
    mandal: "",
    district: "",
    state: "",
    country: "India",
    postalCode: "",
    locationSource: ""
  });

  // Location UI States
  const [locationMode, setLocationMode] = useState<'gps' | 'manual' | 'confirmed' | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [autocompleteSuggestions, setAutocompleteSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [manualInputs, setManualInputs] = useState<ManualInputs>({
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

          setForm(prev => ({
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
          setForm(prev => ({
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

  const handleManualSearch = async (query: string) => {
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

  const handleSelectSuggestion = (suggestion: any) => {
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

    setForm(prev => ({
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

    setForm(prev => ({
      ...prev,
      village: manualInputs.village,
      mandal: manualInputs.mandal,
      district: manualInputs.district,
      state: manualInputs.state,
      country: manualInputs.country || 'India',
      postalCode: manualInputs.postalCode,
      locationSource: form.locationSource || 'Manual'
    }));

    setLocationMode('confirmed');
    setLocationError(null);
  };

  const soilTypes = ["Black Soil / Clayey", "Loamy / Clay loam", "Alluvial / Sandy loam", "Sandy loam / Red sandy"];
  const waterSources = ["Borewell + Canal", "Rainfed / Dryland", "Canal Water only", "Borewell only"];
  const crops = ["Paddy (Rice)", "Wheat", "Cotton", "Maize (Corn)", "Chilli", "Groundnut"];
  const irrigationMethods = ["Flood Irrigation", "Drip Irrigation", "Sprinkler System", "Rain Guns / Rainfed"];
  const fertilizers = ["NPK Chemical + Urea", "Organic Compost + Manure", "Neem-coated Urea only", "Mixed (Chemical + Organic)", "None / Natural Farming"];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const name = e.target.name as keyof FarmProfile;
    const value = e.target.value;
    setForm(prev => ({
      ...prev,
      [name]: name === "landSize" ? parseFloat(value) || 0 : value
    } as FarmProfile));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (locationMode !== 'confirmed') {
      setLocationError("Please select and confirm your farm location before proceeding.");
      return;
    }
    createOrUpdateProfile(form);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back button */}
      <button
        onClick={() => navigateTo("dashboard")}
        className="inline-flex items-center space-x-1.5 text-xs font-bold text-gray-500 hover:text-emerald-600 transition-colors mb-6 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Dashboard</span>
      </button>

      <div className="flex items-center space-x-3 mb-8">
        <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
          <Sprout className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
            Configure Digital Farm Twin
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Provide precise agricultural parameters to generate high-fidelity virtual simulations of your field.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Form Fields */}
          <div className="lg:col-span-8">
            <Card className="p-6 sm:p-8 space-y-6">
              <h2 className="text-base font-bold text-gray-800 dark:text-gray-200 border-b border-gray-100 dark:border-slate-800 pb-3">
                Field & Farm Parameters
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Farmer Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    {t("farmerName")}
                  </label>
                  <input
                    type="text"
                    name="farmerName"
                    required
                    value={form.farmerName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl text-sm font-semibold text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  />
                </div>

                {/* Farm Location Selection Card */}
                <div className="sm:col-span-2 border border-gray-200 dark:border-slate-800 rounded-2xl p-5 bg-gray-50/50 dark:bg-slate-900/40 space-y-4 text-left">
                  <div className="flex items-center gap-2 border-b border-gray-100 dark:border-slate-800 pb-2 text-emerald-600 dark:text-emerald-400">
                    <MapPin className="w-4.5 h-4.5" />
                    <span className="text-xs font-bold text-gray-800 dark:text-white uppercase tracking-wider">Farm Location</span>
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
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-gray-100/50 dark:bg-slate-950/30 p-4 rounded-xl border border-gray-200 dark:border-white/5">
                        <div className="space-y-1">
                          <span className="text-[10px] text-gray-500 font-bold block uppercase tracking-wider">Village / Town</span>
                          <span className="font-semibold text-gray-800 dark:text-slate-200">{form.village || 'N/A'}</span>
                        </div>
                        {form.mandal && (
                          <div className="space-y-1">
                            <span className="text-[10px] text-gray-500 font-bold block uppercase tracking-wider">Mandal / Taluk</span>
                            <span className="font-semibold text-gray-800 dark:text-slate-200">{form.mandal}</span>
                          </div>
                        )}
                        <div className="space-y-1">
                          <span className="text-[10px] text-gray-500 font-bold block uppercase tracking-wider">District</span>
                          <span className="font-semibold text-gray-800 dark:text-slate-200">{form.district || 'N/A'}</span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] text-gray-500 font-bold block uppercase tracking-wider">State</span>
                          <span className="font-semibold text-gray-800 dark:text-slate-200">{form.state || 'N/A'}</span>
                        </div>
                        {form.postalCode && (
                          <div className="space-y-1">
                            <span className="text-[10px] text-gray-500 font-bold block uppercase tracking-wider">Postal Code</span>
                            <span className="font-semibold text-gray-800 dark:text-slate-200">{form.postalCode}</span>
                          </div>
                        )}
                        {form.latitude && form.longitude && (
                          <div className="space-y-1 sm:col-span-2">
                            <span className="text-[10px] text-gray-500 font-bold block uppercase tracking-wider">GPS Coordinates</span>
                            <span className="font-semibold text-gray-400 font-mono text-[11px]">
                              {form.latitude.toFixed(6)}, {form.longitude.toFixed(6)}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between bg-emerald-50/50 dark:bg-farm-950/20 border border-emerald-200 dark:border-farm-500/20 rounded-xl p-3.5">
                        <div className="flex items-center gap-2">
                          <Check className="w-5 h-5 text-emerald-600 dark:text-farm-400 shrink-0" />
                          <div className="text-left">
                            <span className="text-[10px] text-gray-500 dark:text-slate-400 font-bold block uppercase tracking-wider">Location Status</span>
                            <span className="text-xs font-bold text-emerald-600 dark:text-farm-400">
                              {form.locationSource === 'GPS' ? '✔ Verified using GPS' : '✔ Entered Manually'}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setLocationMode(null);
                            setManualInputs({
                              village: form.village || '',
                              mandal: form.mandal || '',
                              district: form.district || '',
                              state: form.state || '',
                              country: form.country || 'India',
                              postalCode: form.postalCode || ''
                            });
                          }}
                          className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 text-[10px] font-bold text-gray-700 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white transition-all cursor-pointer flex items-center gap-1"
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
                        <div className="flex flex-col items-center justify-center py-6 space-y-2 text-gray-500 dark:text-slate-400 text-xs">
                          <Loader2 className="w-6 h-6 animate-spin text-emerald-500 dark:text-farm-400" />
                          <span>Accessing device GPS and reverse geocoding address...</span>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {/* Village Input with Autocomplete search (only when in manual mode) */}
                          <div className="relative">
                            <label className="block text-[10px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-1">Village / Town *</label>
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
                              className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl text-sm font-semibold text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                              placeholder="Type village/town name..."
                              required
                            />
                            
                            {locationMode === 'manual' && showSuggestions && autocompleteSuggestions.length > 0 && (
                              <div className="absolute left-0 right-0 mt-1 bg-white dark:bg-slate-950 border border-gray-200 dark:border-white/10 rounded-lg shadow-xl max-h-48 overflow-y-auto z-50">
                                {autocompleteSuggestions.map((s, idx) => (
                                  <div
                                    key={idx}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleSelectSuggestion(s);
                                    }}
                                    className="px-3 py-2 text-xs text-gray-700 dark:text-slate-300 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-900 cursor-pointer transition-colors border-b border-gray-100 dark:border-white/5 last:border-0"
                                  >
                                    {s.display_name}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[10px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-1">Mandal / Taluk</label>
                              <input
                                type="text"
                                value={manualInputs.mandal}
                                onChange={(e) => setManualInputs(prev => ({ ...prev, mandal: e.target.value }))}
                                className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl text-sm font-semibold text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                                placeholder="Mandal or Taluk"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-1">District *</label>
                              <input
                                type="text"
                                value={manualInputs.district}
                                onChange={(e) => setManualInputs(prev => ({ ...prev, district: e.target.value }))}
                                className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl text-sm font-semibold text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                                placeholder="District Name"
                                required
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[10px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-1">State *</label>
                              <input
                                type="text"
                                value={manualInputs.state}
                                onChange={(e) => setManualInputs(prev => ({ ...prev, state: e.target.value }))}
                                className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl text-sm font-semibold text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                                placeholder="State Name"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-1">Pincode (Optional)</label>
                              <input
                                type="text"
                                value={manualInputs.postalCode}
                                onChange={(e) => setManualInputs(prev => ({ ...prev, postalCode: e.target.value }))}
                                className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl text-sm font-semibold text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
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
                              className="flex-grow py-2 rounded-xl bg-gray-100 dark:bg-slate-900 border border-gray-200 dark:border-white/5 text-gray-600 dark:text-slate-400 text-xs font-bold hover:bg-gray-200 dark:hover:bg-white/5 hover:text-black dark:hover:text-white transition-all cursor-pointer"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={handleConfirmLocation}
                              className="flex-grow py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1"
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
                          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-emerald-500 bg-emerald-50 dark:bg-emerald-950/10 hover:bg-emerald-100 dark:hover:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 text-xs font-bold transition-all shadow-sm cursor-pointer group"
                        >
                          <Navigation className="w-4 h-4 text-emerald-600 dark:text-emerald-400 group-hover:animate-pulse" />
                          <span>📍 Use Current Location (Recommended)</span>
                        </button>
                        <p className="text-[10px] text-gray-500 dark:text-slate-500 leading-normal font-medium text-center">
                          Retrieves exact coordinates and address using your device's browser GPS.
                        </p>
                      </div>

                      <div className="relative flex py-2 items-center">
                        <div className="flex-grow border-t border-gray-200 dark:border-white/5"></div>
                        <span className="flex-shrink mx-4 text-[10px] font-bold text-gray-400 dark:text-slate-600 tracking-wider uppercase">OR</span>
                        <div className="flex-grow border-t border-gray-200 dark:border-white/5"></div>
                      </div>

                      <div className="space-y-2">
                        <button
                          type="button"
                          onClick={() => setLocationMode('manual')}
                          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-slate-900/40 hover:bg-gray-100 dark:hover:bg-white/5 text-gray-700 dark:text-slate-300 hover:text-black dark:hover:text-white text-xs font-bold transition-all cursor-pointer"
                        >
                          <Search className="w-4 h-4 text-gray-500 dark:text-slate-400" />
                          <span>✍️ Enter Farm Location Manually</span>
                        </button>
                        <p className="text-[10px] text-gray-500 dark:text-slate-500 leading-normal font-medium text-center">
                          Enter State, District, and Village/Town manually with typeahead lookup.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Land Size */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    {t("landSize")}
                  </label>
                  <input
                    type="number"
                    name="landSize"
                    step="0.1"
                    min="0.1"
                    required
                    value={form.landSize}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl text-sm font-semibold text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  />
                </div>

                {/* Soil Type */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    {t("soilType")}
                  </label>
                  <select
                    name="soilType"
                    value={form.soilType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl text-sm font-semibold text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  >
                    {soilTypes.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>

                {/* Water Availability */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    {t("waterAvailability")}
                  </label>
                  <select
                    name="waterAvailability"
                    value={form.waterAvailability}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl text-sm font-semibold text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  >
                    {waterSources.map((ws) => (
                      <option key={ws} value={ws}>{ws}</option>
                    ))}
                  </select>
                </div>

                {/* Irrigation Method */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    {t("irrigationMethod")}
                  </label>
                  <select
                    name="irrigationMethod"
                    value={form.irrigationMethod}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl text-sm font-semibold text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  >
                    {irrigationMethods.map((im) => (
                      <option key={im} value={im}>{im}</option>
                    ))}
                  </select>
                </div>

                {/* Current Crop */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    {t("currentCrop")}
                  </label>
                  <select
                    name="currentCrop"
                    value={form.currentCrop}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl text-sm font-semibold text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  >
                    {crops.map((cr) => (
                      <option key={cr} value={cr}>{cr}</option>
                    ))}
                  </select>
                </div>

                {/* Fertilizers Used */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    {t("fertilizerUsed")}
                  </label>
                  <select
                    name="fertilizersUsed"
                    value={form.fertilizersUsed}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl text-sm font-semibold text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  >
                    {fertilizers.map((ft) => (
                      <option key={ft} value={ft}>{ft}</option>
                    ))}
                  </select>
                </div>
              </div>

              <h2 className="text-base font-bold text-gray-800 dark:text-gray-200 border-b border-gray-100 dark:border-slate-800 pt-4 pb-3">
                Cropping History (Required for Rotation & Fertility)
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Prev Crop */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    {t("prevCrop")}
                  </label>
                  <select
                    name="prevCrop"
                    value={form.prevCrop}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl text-sm font-semibold text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  >
                    <option value="None">None / Fallow</option>
                    {crops.map((cr) => (
                      <option key={cr} value={cr}>{cr}</option>
                    ))}
                  </select>
                </div>

                {/* Prev Prev Crop */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    {t("prevPrevCrop")}
                  </label>
                  <select
                    name="prevPrevCrop"
                    value={form.prevPrevCrop}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl text-sm font-semibold text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  >
                    <option value="None">None / Fallow</option>
                    {crops.map((cr) => (
                      <option key={cr} value={cr}>{cr}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end">
                <Button type="submit" className="px-6 py-3 space-x-1.5 cursor-pointer">
                  <Save className="w-4.5 h-4.5" />
                  <span>{t("save")}</span>
                </Button>
              </div>
            </Card>
          </div>

          {/* Guidelines Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="bg-emerald-50/50 dark:bg-emerald-950/15 border-emerald-100/10 p-5 space-y-4">
              <h3 className="text-sm font-bold text-emerald-800 dark:text-emerald-400 flex items-center">
                <Info className="w-4 h-4 mr-1.5 shrink-0" />
                How AgriTwin Simulation Works
              </h3>
              <ul className="space-y-3 text-xs text-gray-600 dark:text-gray-400 font-medium leading-relaxed">
                <li className="flex items-start">
                  <span className="text-emerald-500 mr-2">✦</span>
                  <span><strong>Soil Fertility:</strong> Your choice of previous crops adjusts nitrogen (N). Legumes boost it while Paddy depletes it.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-500 mr-2">✦</span>
                  <span><strong>Farm Risks:</strong> Monoculture (sequentially sowing Paddy after Paddy) spikes pest/disease risks. Shifting irrigation to drip reduces water risk.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-500 mr-2">✦</span>
                  <span><strong>Estimated Profits:</strong> Higher soil fertility adds up to a 15% yield bonus; high-risk scores invoke a crop loss penalty.</span>
                </li>
              </ul>
            </Card>

            <Card className="p-5 border-dashed border-gray-200 dark:border-slate-800/80 bg-transparent flex items-center space-x-3.5">
              <HelpCircle className="w-10 h-10 text-gray-400 dark:text-gray-600 shrink-0" />
              <div className="text-xs">
                <p className="font-bold text-gray-700 dark:text-gray-300">Need Soil Testing?</p>
                <p className="text-gray-500 mt-0.5 leading-normal font-medium">Link with government soil health card directly via digital twin dashboard APIs.</p>
              </div>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
};

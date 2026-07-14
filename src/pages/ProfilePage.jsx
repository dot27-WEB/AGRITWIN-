import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useFarm } from '../context/FarmContext';
import cropsData from '../data/crops.json';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { 
  User, Phone, Calendar, Trash2, SwitchCamera, 
  ArrowLeft, BrainCircuit, ShieldAlert, LogOut, CheckCircle2 
} from 'lucide-react';

export const ProfilePage = () => {
  const { t, language } = useLanguage();
  const { 
    profile, 
    farms, 
    activeFarmId, 
    setActiveFarmId, 
    deleteFarm, 
    logoutFarmer 
  } = useFarm();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutFarmer();
    navigate('/');
  };

  const handleDelete = (id, event) => {
    event.stopPropagation(); // prevent setting as active farm
    if (confirm("Are you sure you want to delete this digital twin profile? This action is irreversible.")) {
      deleteFarm(id);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 md:px-8 space-y-8 animate-fade-in">
      
      {/* Header */}
      <div>
        <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white mb-2 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Dashboard
        </Link>
        <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-wide">
          Farmer Twin Controls ⚙️
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Review active credentials, switch active virtual clones, or wipe twin memories.
        </p>
      </div>

      {profile && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Farmer Profile Card (Left) */}
          <div className="md:col-span-1">
            <Card hoverGlow={false} className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-farm-500/10 border border-farm-500/20 flex items-center justify-center text-farm-400 mx-auto mb-4">
                <User className="w-8 h-8" />
              </div>
              <h3 className="text-base font-extrabold text-white">{profile.name}</h3>
              <p className="text-[10px] text-slate-400 font-semibold mt-1 flex items-center justify-center gap-1">
                <Phone className="w-3 h-3 text-farm-500" />
                {profile.phone}
              </p>

              <div className="border-t border-white/5 my-4 pt-4">
                <span className="text-[9px] text-slate-500 font-bold block uppercase tracking-wider">Session Registered</span>
                <span className="text-[10px] font-semibold text-slate-300">
                  {new Date(profile.loggedInAt).toLocaleString('en-IN')}
                </span>
              </div>

              <Button 
                variant="danger" 
                size="sm" 
                onClick={handleLogout}
                className="w-full mt-2"
                icon={LogOut}
              >
                {t('buttonLogout')}
              </Button>
            </Card>
          </div>

          {/* Active Twins Grid (Right) */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
              <SwitchCamera className="w-4 h-4 text-farm-500" />
              Manage Digital Twins
            </h4>

            {farms.length === 0 ? (
              <div className="text-center py-10 bg-slate-900/15 border border-dashed border-white/10 rounded-3xl">
                <p className="text-xs text-slate-500">No active twins registered to this profile yet.</p>
                <Link to="/create-twin" className="mt-4 inline-block">
                  <Button variant="primary" size="sm">{t('buttonCreateTwin')}</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {farms.map((farm, index) => {
                  const isActive = farm.id === activeFarmId;
                  const crop = cropsData.find(c => c.id === farm.currentCrop);
                  const cropLabel = crop ? (crop.name[language] || crop.name['en']) : farm.currentCrop;

                  return (
                    <div
                      key={farm.id}
                      onClick={() => setActiveFarmId(farm.id)}
                      className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer hover:shadow-lg
                        ${isActive 
                          ? 'bg-farm-950/20 border-farm-500 shadow-glow-green' 
                          : 'bg-slate-900/40 border-white/5 hover:border-white/10'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        {isActive ? (
                          <CheckCircle2 className="w-5 h-5 text-farm-500 shrink-0" />
                        ) : (
                          <div className="w-5 h-5 rounded-full border border-slate-700 shrink-0" />
                        )}
                        <div>
                          <h5 className="text-xs font-bold text-white uppercase tracking-wider">
                            Twin #{index + 1}: {farm.village}
                          </h5>
                          <span className="text-[10px] text-slate-400 mt-0.5 block font-medium">
                            {farm.landSize} Acres • {farm.soilType} Soil • Crop: <strong className="text-farm-400">{cropLabel}</strong>
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={(e) => handleDelete(farm.id, e)}
                        className="p-2 rounded-xl bg-slate-950/50 hover:bg-rose-950/30 text-slate-500 hover:text-rose-400 border border-white/5 hover:border-rose-500/20 transition-all"
                        title="Delete Twin"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
};

export default ProfilePage;

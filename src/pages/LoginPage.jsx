import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useFarm } from '../context/FarmContext';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { UserCheck, ShieldCheck, Phone, Lock, Sprout } from 'lucide-react';

export const LoginPage = () => {
  const { t } = useLanguage();
  const { loginFarmer, farms } = useFarm();
  const navigate = useNavigate();
  
  const [phone, setPhone] = useState('9876543210');
  const [passcode, setPasscode] = useState('1234');
  const [farmerName, setFarmerName] = useState('Ramesh Kumar');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!phone || !passcode || !farmerName) {
      setError('Please fill in all details.');
      return;
    }
    
    // Simulate authentication
    const profile = {
      name: farmerName,
      phone: phone,
      passcode: passcode,
      loggedInAt: new Date().toISOString()
    };

    loginFarmer(profile);

    // If there are already farms created, go straight to dashboard.
    // Otherwise, direct them to create their first twin profile!
    if (farms.length > 0) {
      navigate('/dashboard');
    } else {
      navigate('/create-twin');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 relative">
      
      {/* Background glow lights */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-farm-500/10 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-emerald-500/10 rounded-full filter blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        
        {/* Logo Badge */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-farm-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-farm-900/30 mb-2">
            <Sprout className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-wide">
            {t('appName')} 🌾
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-medium text-center">
            {t('loginText')}
          </p>
        </div>

        {/* Card Form */}
        <Card hoverGlow={true} className="border-white/10">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Header info */}
            <div className="bg-farm-950/20 border border-farm-500/10 rounded-xl p-3 flex items-start gap-2.5 mb-2">
              <ShieldCheck className="w-4 h-4 text-farm-400 shrink-0 mt-0.5" />
              <div className="text-[10px] text-slate-400 leading-relaxed font-medium">
                <span className="text-farm-400 font-bold block uppercase mb-0.5">EVALUATION DEMO MODE</span>
                Pre-filled default credentials are ready for testing. Simply click **Verify & Enter** to log in.
              </div>
            </div>

            {error && (
              <div className="bg-rose-950/20 border border-rose-500/20 text-rose-300 rounded-xl p-3 text-xs text-center font-medium">
                {error}
              </div>
            )}

            {/* Farmer Name */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Farmer Full Name
              </label>
              <div className="relative">
                <UserCheck className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="Enter name (e.g., Ramesh Kumar)"
                  value={farmerName}
                  onChange={(e) => setFarmerName(e.target.value)}
                  className="glass-input w-full pl-11 pr-4 py-3 rounded-xl text-xs text-slate-200"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                {t('phoneNumber')}
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
                <input
                  type="tel"
                  required
                  pattern="[0-9]{10}"
                  placeholder="10-digit Mobile Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="glass-input w-full pl-11 pr-4 py-3 rounded-xl text-xs text-slate-200"
                />
              </div>
            </div>

            {/* PIN/Passcode */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                {t('passcode')}
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  required
                  placeholder="4-digit Passcode"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="glass-input w-full pl-11 pr-4 py-3 rounded-xl text-xs text-slate-200"
                />
              </div>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              variant="primary"
              className="w-full py-3 text-xs font-bold tracking-wider uppercase mt-4"
            >
              {t('submitLogin')}
            </Button>

          </form>
        </Card>
      </div>

    </div>
  );
};

export default LoginPage;

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useFarm } from '../../context/FarmContext';
import { 
  Sprout, Menu, X, Globe, User, LogOut, PlusCircle, 
  LayoutDashboard, HeartPulse, Droplets, Landmark, CalendarDays, TrendingUp
} from 'lucide-react';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const { profile, activeFarm, logoutFarmer } = useFarm();
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);

  const navItems = [
    { name: t('navDashboard'), path: '/dashboard', icon: LayoutDashboard },
    { name: t('navCrops'), path: '/crops', icon: Sprout },
    { name: t('navDisease'), path: '/disease', icon: HeartPulse },
    { name: t('navIrrigation'), path: '/irrigation', icon: Droplets },
    { name: t('navMarket'), path: '/market', icon: TrendingUp },
    { name: t('navSchemes'), path: '/schemes', icon: Landmark },
    { name: t('navCalendar'), path: '/calendar', icon: CalendarDays },
    { name: t('navAnalysis') || 'Analysis', path: '/analysis', icon: TrendingUp }
  ];

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'te', label: 'తెలుగు (Telugu)' },
    { code: 'hi', label: 'हिन्दी (Hindi)' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-[#040814]/80 backdrop-blur-lg border-b border-white/5 py-4 px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-farm-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-farm-900/30 group-hover:scale-105 transition-transform duration-300">
            <Sprout className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-white group-hover:text-farm-400 transition-colors">
              AgriTwin <span className="text-farm-500 font-extrabold">AI</span>
            </span>
            <span className="block text-[9px] text-slate-400 font-medium -mt-1 tracking-wider uppercase">
              {t('tagline')}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-1.5">
          {profile && navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium tracking-wide transition-all duration-200
                ${isActive(item.path)
                  ? 'bg-farm-500/10 text-farm-400 border border-farm-500/20'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white border border-transparent'
                }`}
            >
              <item.icon className="w-3.5 h-3.5" />
              {item.name}
            </Link>
          ))}
        </div>

        {/* Action Controls */}
        <div className="hidden md:flex items-center gap-4">
          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/50 hover:bg-slate-800 border border-white/5 text-xs text-slate-300 transition-all"
            >
              <Globe className="w-3.5 h-3.5 text-farm-500" />
              {languages.find(l => l.code === language)?.label || 'English'}
            </button>
            
            {langOpen && (
              <div className="absolute right-0 mt-2 w-44 rounded-xl bg-slate-950 border border-white/10 p-1.5 shadow-2xl z-50">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      setLangOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors
                      ${language === lang.code 
                        ? 'bg-farm-500/10 text-farm-400' 
                        : 'text-slate-300 hover:bg-white/5 hover:text-white'
                      }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Profile Shortcut / Login */}
          {profile ? (
            <div className="flex items-center gap-3">
              <Link 
                to="/profile" 
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-farm-950/40 text-farm-300 border border-farm-500/20 hover:bg-farm-900/40 transition-all text-xs"
              >
                <User className="w-3.5 h-3.5 text-farm-400" />
                <span className="font-semibold">{profile.name}</span>
                {activeFarm && (
                  <span className="px-1.5 py-0.5 rounded-md bg-farm-500/20 text-farm-400 text-[10px] uppercase font-bold">
                    {activeFarm.village}
                  </span>
                )}
              </Link>
              <button
                onClick={logoutFarmer}
                className="p-2 rounded-xl bg-rose-950/20 text-rose-400 hover:bg-rose-900/20 border border-rose-500/10 hover:border-rose-500/20 transition-all"
                title={t('buttonLogout')}
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link 
              to="/login"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900/60 hover:bg-slate-800 text-slate-200 border border-white/10 hover:border-white/20 transition-all text-xs font-semibold"
            >
              <User className="w-3.5 h-3.5" />
              {t('navLogin')}
            </Link>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex items-center gap-3 lg:hidden">
          {/* Quick Lang Selection for Mobile */}
          <button 
            onClick={() => setLangOpen(!langOpen)} 
            className="p-2 rounded-xl bg-slate-900/50 text-slate-300 border border-white/5 md:hidden"
          >
            <Globe className="w-4 h-4 text-farm-500" />
          </button>
          
          <button
            onClick={toggleMenu}
            className="p-2 rounded-xl bg-slate-900/50 border border-white/5 text-slate-300 hover:text-white"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Lang Dropdown Drawer */}
      {langOpen && (
        <div className="md:hidden max-w-7xl mx-auto px-4 mt-2">
          <div className="grid grid-cols-3 gap-2 p-2 rounded-2xl bg-slate-950/90 border border-white/10">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code);
                  setLangOpen(false);
                }}
                className={`py-2 px-1 rounded-xl text-center text-[10px] font-semibold transition-colors
                  ${language === lang.code 
                    ? 'bg-farm-500 text-white' 
                    : 'bg-white/5 text-slate-300 hover:bg-white/10'
                  }`}
              >
                {lang.label.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Mobile Navigation Drawer */}
      {isOpen && (
        <div className="lg:hidden mt-4 border-t border-white/5 pt-4 px-2 space-y-2">
          {profile ? (
            <>
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                    ${isActive(item.path)
                      ? 'bg-farm-500/10 text-farm-400 border border-farm-500/20'
                      : 'text-slate-300 hover:bg-white/5'
                    }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </Link>
              ))}
              
              <div className="border-t border-white/5 my-3 pt-3 flex items-center justify-between px-4">
                <Link 
                  to="/profile" 
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 text-farm-400 font-semibold text-sm"
                >
                  <User className="w-4 h-4" />
                  {profile.name}
                </Link>
                <button
                  onClick={() => {
                    logoutFarmer();
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-1 text-rose-400 hover:text-rose-300 text-xs font-semibold px-2 py-1 bg-rose-950/20 rounded-lg border border-rose-500/10"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  {t('buttonLogout')}
                </button>
              </div>
            </>
          ) : (
            <div className="px-4 py-2">
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-farm-600 hover:bg-farm-500 text-white font-semibold shadow-lg shadow-farm-900/30 text-sm"
              >
                <User className="w-4 h-4" />
                {t('navLogin')}
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;

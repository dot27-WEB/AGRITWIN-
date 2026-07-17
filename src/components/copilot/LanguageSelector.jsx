import React from 'react';

const LANGS = [
  { code: 'en', label: 'English' },
  { code: 'te', label: 'తెలుగు (Telugu)' },
  { code: 'hi', label: 'हिन्दी (Hindi)' },
  { code: 'ta', label: 'தமிழ் (Tamil)' },
  { code: 'kn', label: 'ಕನ್ನಡ (Kannada)' },
  { code: 'ml', label: 'മലയാളം (Malayalam)' }
];

export const LanguageSelector = ({ selected, onChange }) => {
  return (
    <select
      value={selected}
      onChange={(e) => onChange(e.target.value)}
      className="bg-slate-900/80 border border-white/10 hover:border-emerald-500/50 rounded-xl px-2.5 py-1 text-[10px] font-black text-slate-300 outline-none cursor-pointer transition-all duration-300"
    >
      {LANGS.map((lang) => (
        <option key={lang.code} value={lang.code} className="bg-slate-950 text-slate-300 font-semibold text-xs">
          {lang.label}
        </option>
      ))}
    </select>
  );
};

export default LanguageSelector;

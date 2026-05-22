import React, { useState, useRef } from 'react';
import html2pdf from 'html2pdf.js';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Download, Sparkles, FileText, ArrowLeft, ArrowRight, Loader2, CheckCircle, Save, Clock } from 'lucide-react';
import { ModernTemplate, ClassicTemplate, CreativeTemplate, FullModernTemplate, FullClassicTemplate, FullCreativeTemplate } from '../components/resume/ResumeTemplatePreview';
import { PersonalFields, ExperienceFields, EducationFields, SkillsFields } from '../components/resume/ResumeFormFields';

const TEMPLATES = [
  { id: 'modern', label: 'Modern Minimalist', desc: 'Clean, asymmetric layout. Best for tech & startup roles.', Preview: ModernTemplate, Full: FullModernTemplate },
  { id: 'classic', label: 'Professional Classic', desc: 'Symmetric, formal. Best for corporate & executive roles.', Preview: ClassicTemplate, Full: FullClassicTemplate },
  { id: 'creative', label: 'Creative Tech', desc: 'Gradient header, two-column. Best for design & creative roles.', Preview: CreativeTemplate, Full: FullCreativeTemplate },
];

const defaultForm = {
  personalInfo: { name: '', email: '', phone: '', github: '' },
  experience: [{ role: '', company: '', duration: '', bullets: [''] }],
  education: [{ degree: '', school: '', duration: '' }],
  skills: ['']
};

const TABS = ['Personal', 'Experience', 'Education', 'Skills'];

export default function ResumeBuilder() {
  const navigate = useNavigate();
  const previewRef = useRef(null);

  const [mode, setMode] = useState(null); // null | 'manual' | 'ai'
  const [step, setStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [formData, setFormData] = useState(defaultForm);
  const [activeTab, setActiveTab] = useState('Personal');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Rate limiting for AI template generation (max 2 per 5 min)
  const [genCount, setGenCount] = useState(0);
  const [genResetTime, setGenResetTime] = useState(null);
  const [aiRaw, setAiRaw] = useState('');

  const canGenerate = () => {
    if (!genResetTime) return true;
    const elapsed = (Date.now() - genResetTime) / 1000 / 60;
    if (elapsed >= 5) { setGenCount(0); setGenResetTime(null); return true; }
    return genCount < 2;
  };

  const minutesLeft = () => {
    if (!genResetTime) return 0;
    return Math.ceil(5 - (Date.now() - genResetTime) / 1000 / 60);
  };

  // Form helpers
  const handlePersonal = e => setFormData(p => ({ ...p, personalInfo: { ...p.personalInfo, [e.target.name]: e.target.value } }));
  const handleExp = (i, f, v) => setFormData(p => { const e = [...p.experience]; e[i][f] = v; return { ...p, experience: e }; });
  const addExp = () => setFormData(p => ({ ...p, experience: [...p.experience, { role: '', company: '', duration: '', bullets: [''] }] }));
  const removeExp = i => setFormData(p => ({ ...p, experience: p.experience.filter((_,j) => j !== i) }));
  const addBullet = ei => setFormData(p => { const e = [...p.experience]; e[ei].bullets.push(''); return { ...p, experience: e }; });
  const removeBullet = (ei, bi) => setFormData(p => { const e = [...p.experience]; e[ei].bullets = e[ei].bullets.filter((_,j) => j !== bi); return { ...p, experience: e }; });
  const changeBullet = (ei, bi, v) => setFormData(p => { const e = [...p.experience]; e[ei].bullets[bi] = v; return { ...p, experience: e }; });
  const handleEdu = (i, f, v) => setFormData(p => { const e = [...p.education]; e[i][f] = v; return { ...p, education: e }; });
  const addEdu = () => setFormData(p => ({ ...p, education: [...p.education, { degree: '', school: '', duration: '' }] }));
  const removeEdu = i => setFormData(p => ({ ...p, education: p.education.filter((_,j) => j !== i) }));
  const handleSkill = (i, v) => setFormData(p => { const s = [...p.skills]; s[i] = v; return { ...p, skills: s }; });
  const addSkill = () => setFormData(p => ({ ...p, skills: [...p.skills, ''] }));
  const removeSkill = i => setFormData(p => ({ ...p, skills: p.skills.filter((_,j) => j !== i) }));

  const handleAIGenerate = async () => {
    if (!canGenerate()) return;
    setLoading(true);
    try {
      const res = await api.post('/ai/generate-resume', {
        jobTitle: formData.personalInfo.name ? `Resume for ${formData.personalInfo.name}` : 'Software Engineer',
        experience: formData.experience.map(e => `${e.role} at ${e.company} (${e.duration}): ${e.bullets.join('. ')}`).join('\n'),
        education: formData.education.map(e => `${e.degree} from ${e.school} (${e.duration})`).join('\n'),
        skills: formData.skills.filter(Boolean).join(', ')
      });
      const g = res.data.data;
      setFormData({
        personalInfo: { name: g.name || formData.personalInfo.name, email: g.email || formData.personalInfo.email, phone: g.phone || formData.personalInfo.phone, github: g.github || formData.personalInfo.github },
        experience: (g.experience || []).map(e => ({ role: e.role||'', company: e.company||'', duration: e.duration||'', bullets: e.bullets||[''] })),
        education: (g.education || []).map(e => ({ degree: e.degree||'', school: e.school||'', duration: e.duration||'' })),
        skills: g.skills || formData.skills
      });
      setGenCount(c => c + 1);
      if (genCount === 0) setGenResetTime(Date.now());
      if (mode === 'ai') setStep(2);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleExport = () => {
    const el = previewRef.current;
    if (!el) return;
    html2pdf().from(el).set({ margin: 0, filename: `${formData.personalInfo.name || 'resume'}.pdf`, image: { type: 'jpeg', quality: 0.98 }, html2canvas: { scale: 2 }, jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' } }).save();
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const text = [
        formData.personalInfo.name, formData.personalInfo.email, formData.personalInfo.phone, formData.personalInfo.github,
        ...formData.experience.map(e => `${e.role} at ${e.company}: ${e.bullets.join('. ')}`),
        ...formData.education.map(e => `${e.degree} from ${e.school}`),
        formData.skills.join(', ')
      ].join('\n');
      const res = await api.post('/resume/save-built', { title: formData.personalInfo.name + "'s Resume", extractedText: text });
      navigate(`/analysis/${res.data.data._id}`);
    } catch (err) { console.error(err); setSaving(false); }
  };

  const FullTpl = selectedTemplate ? TEMPLATES.find(t => t.id === selectedTemplate)?.Full : null;

  // ---- STEP RENDERERS ----

  // Mode selection screen
  if (!mode) return (
    <div className="max-w-3xl mx-auto py-16 px-4 space-y-10">
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Create Your Resume</h1>
        <p className="text-slate-500 text-lg">Choose your preferred building approach</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { m: 'manual', icon: <FileText className="w-8 h-8"/>, color: 'indigo', title: 'Build Manually', desc: 'Pick an AI-previewed template, then fill in your details step-by-step with real-time preview.' },
          { m: 'ai', icon: <Sparkles className="w-8 h-8"/>, color: 'purple', title: 'AI-Assisted', desc: 'Enter your info, let AI generate polished resume content, then pick the template you like.' }
        ].map(({ m, icon, color, title, desc }) => (
          <div key={m} onClick={() => { setMode(m); setStep(1); }} className={`bg-white rounded-2xl border-2 p-8 cursor-pointer hover:shadow-lg hover:border-${color}-400 border-slate-200 transition-all duration-200 group`}>
            <div className={`bg-${color}-50 text-${color}-600 p-4 rounded-xl w-14 h-14 flex items-center justify-center mb-4 group-hover:bg-${color}-600 group-hover:text-white transition-colors`}>{icon}</div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">{title}</h2>
            <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  );

  // MANUAL MODE - Step 1: Choose Template
  if (mode === 'manual' && step === 1) return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 border-b pb-4">
        <button onClick={() => setMode(null)} className="text-slate-400 hover:text-slate-600"><ArrowLeft className="w-5 h-5"/></button>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Step 1 of 3 — Choose a Template</h2>
          <p className="text-slate-500 text-sm">AI-generated previews with sample data. Select one to continue.</p>
        </div>
        {!canGenerate() && (
          <div className="ml-auto flex items-center gap-2 bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1.5 rounded-full text-xs font-bold">
            <Clock className="w-3.5 h-3.5"/> Wait {minutesLeft()} min (2/2 used)
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TEMPLATES.map(({ id, label, desc, Preview }) => (
          <div key={id} onClick={() => setSelectedTemplate(id)} className={`bg-white rounded-2xl border-2 cursor-pointer transition-all duration-200 overflow-hidden ${selectedTemplate === id ? 'border-indigo-500 shadow-lg ring-2 ring-indigo-200' : 'border-slate-200 hover:border-slate-300 hover:shadow-md'}`}>
            <div className="p-4 scale-[0.85] origin-top-left w-[118%]">
              <Preview />
            </div>
            <div className={`px-4 py-3 border-t flex items-center justify-between ${selectedTemplate === id ? 'bg-indigo-50 border-indigo-200' : 'bg-slate-50 border-slate-100'}`}>
              <div>
                <p className="font-bold text-sm text-slate-800">{label}</p>
                <p className="text-slate-500 text-xs">{desc}</p>
              </div>
              {selectedTemplate === id && <CheckCircle className="w-5 h-5 text-indigo-600 shrink-0"/>}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-2">
        <p className="text-sm text-slate-500">Generations used: <span className="font-bold">{genCount}/2</span> this 5-min window</p>
        <button onClick={() => { if (selectedTemplate) setStep(2); }} disabled={!selectedTemplate} className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold px-6 py-2.5 rounded-xl flex items-center gap-2 transition">
          Next: Fill Your Info <ArrowRight className="w-4 h-4"/>
        </button>
      </div>
    </div>
  );

  // MANUAL MODE - Step 2: Fill Form
  if (mode === 'manual' && step === 2) return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 border-b pb-4">
        <button onClick={() => setStep(1)} className="text-slate-400 hover:text-slate-600"><ArrowLeft className="w-5 h-5"/></button>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Step 2 of 3 — Your Information</h2>
          <p className="text-slate-500 text-sm">Fill in your details. They'll appear live in your selected template.</p>
        </div>
      </div>

      <div className="flex gap-2 border-b">
        {TABS.map(t => (
          <button key={t} onClick={() => setActiveTab(t)} className={`px-4 py-2.5 text-sm font-bold border-b-2 transition ${activeTab===t ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>{t}</button>
        ))}
      </div>

      <div className="max-w-2xl">
        {activeTab === 'Personal' && <PersonalFields data={formData.personalInfo} onChange={handlePersonal}/>}
        {activeTab === 'Experience' && <ExperienceFields experience={formData.experience} onChange={handleExp} onAddExp={addExp} onRemoveExp={removeExp} onAddBullet={addBullet} onRemoveBullet={removeBullet} onBulletChange={changeBullet}/>}
        {activeTab === 'Education' && <EducationFields education={formData.education} onChange={handleEdu} onAdd={addEdu} onRemove={removeEdu}/>}
        {activeTab === 'Skills' && <SkillsFields skills={formData.skills} onChange={handleSkill} onAdd={addSkill} onRemove={removeSkill}/>}
      </div>

      <div className="flex justify-between pt-4 border-t">
        <button onClick={() => setStep(1)} className="text-slate-500 hover:text-slate-700 font-semibold flex items-center gap-2"><ArrowLeft className="w-4 h-4"/> Back</button>
        <button onClick={() => setStep(3)} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-2.5 rounded-xl flex items-center gap-2 transition">
          Preview & Download <ArrowRight className="w-4 h-4"/>
        </button>
      </div>
    </div>
  );

  // MANUAL MODE - Step 3: Preview & Download
  if (mode === 'manual' && step === 3 && FullTpl) return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 border-b pb-4">
        <button onClick={() => setStep(2)} className="text-slate-400 hover:text-slate-600"><ArrowLeft className="w-5 h-5"/></button>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-slate-800">Step 3 of 3 — Preview & Export</h2>
          <p className="text-slate-500 text-sm">Looking good! Download as PDF or save to analyze your ATS score.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl transition disabled:opacity-50">
            {saving ? <Loader2 className="w-4 h-4 animate-spin"/> : <Save className="w-4 h-4"/>} Save & Analyze
          </button>
          <button onClick={handleExport} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-xl transition">
            <Download className="w-4 h-4"/> Export PDF
          </button>
        </div>
      </div>

      <div className="bg-slate-100 rounded-xl p-8 flex justify-center shadow-inner">
        <div ref={previewRef} className="bg-white w-full max-w-2xl min-h-[842px] p-12 shadow-xl">
          <FullTpl data={formData}/>
        </div>
      </div>
    </div>
  );

  // AI MODE - Step 1: Collect Info
  if (mode === 'ai' && step === 1) return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 border-b pb-4">
        <button onClick={() => setMode(null)} className="text-slate-400 hover:text-slate-600"><ArrowLeft className="w-5 h-5"/></button>
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2"><Sparkles className="w-6 h-6 text-purple-500"/> Step 1 of 2 — Your Information</h2>
          <p className="text-slate-500 text-sm">Fill in your details, then AI will generate polished resume content across all templates.</p>
        </div>
      </div>

      <div className="flex gap-2 border-b">
        {TABS.map(t => (
          <button key={t} onClick={() => setActiveTab(t)} className={`px-4 py-2.5 text-sm font-bold border-b-2 transition ${activeTab===t ? 'border-purple-600 text-purple-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>{t}</button>
        ))}
      </div>

      <div className="max-w-2xl">
        {activeTab === 'Personal' && <PersonalFields data={formData.personalInfo} onChange={handlePersonal}/>}
        {activeTab === 'Experience' && <ExperienceFields experience={formData.experience} onChange={handleExp} onAddExp={addExp} onRemoveExp={removeExp} onAddBullet={addBullet} onRemoveBullet={removeBullet} onBulletChange={changeBullet}/>}
        {activeTab === 'Education' && <EducationFields education={formData.education} onChange={handleEdu} onAdd={addEdu} onRemove={removeEdu}/>}
        {activeTab === 'Skills' && <SkillsFields skills={formData.skills} onChange={handleSkill} onAdd={addSkill} onRemove={removeSkill}/>}
      </div>

      <div className="flex justify-end pt-4 border-t">
        <button onClick={handleAIGenerate} disabled={loading || !canGenerate()} className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 text-white font-bold px-6 py-2.5 rounded-xl flex items-center gap-2 transition">
          {loading ? <><Loader2 className="w-4 h-4 animate-spin"/> Generating...</> : <><Sparkles className="w-4 h-4"/> Generate & Preview Templates</>}
        </button>
      </div>
    </div>
  );

  // AI MODE - Step 2: Select template (all 3 filled with user's real data)
  if (mode === 'ai' && step === 2) return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 border-b pb-4">
        <button onClick={() => setStep(1)} className="text-slate-400 hover:text-slate-600"><ArrowLeft className="w-5 h-5"/></button>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Step 2 of 2 — Pick Your Template</h2>
          <p className="text-slate-500 text-sm">All templates are filled with your AI-polished content. Choose the one you like and download.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TEMPLATES.map(({ id, label, desc, Preview, Full }) => (
          <div key={id} onClick={() => setSelectedTemplate(id)} className={`bg-white rounded-2xl border-2 cursor-pointer transition-all duration-200 overflow-hidden ${selectedTemplate === id ? 'border-purple-500 shadow-lg ring-2 ring-purple-200' : 'border-slate-200 hover:border-slate-300 hover:shadow-md'}`}>
            <div className="p-4 scale-[0.85] origin-top-left w-[118%]">
              <Preview data={formData}/>
            </div>
            <div className={`px-4 py-3 border-t flex items-center justify-between ${selectedTemplate === id ? 'bg-purple-50 border-purple-200' : 'bg-slate-50 border-slate-100'}`}>
              <div>
                <p className="font-bold text-sm text-slate-800">{label}</p>
                <p className="text-slate-500 text-xs">{desc}</p>
              </div>
              {selectedTemplate === id && <CheckCircle className="w-5 h-5 text-purple-600 shrink-0"/>}
            </div>
          </div>
        ))}
      </div>

      {selectedTemplate && (
        <div className="flex justify-end gap-3 pt-2 border-t">
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-5 py-2.5 rounded-xl transition disabled:opacity-50">
            {saving ? <Loader2 className="w-4 h-4 animate-spin"/> : <Save className="w-4 h-4"/>} Save & Analyze
          </button>
          <div ref={previewRef} className="hidden">
            {FullTpl && <div className="bg-white p-12"><FullTpl data={formData}/></div>}
          </div>
          <button onClick={handleExport} className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold px-5 py-2.5 rounded-xl transition">
            <Download className="w-4 h-4"/> Download PDF
          </button>
        </div>
      )}
    </div>
  );

  return null;
}

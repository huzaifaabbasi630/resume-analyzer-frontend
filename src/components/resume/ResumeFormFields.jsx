import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

const inp = "w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500 bg-white";
const lbl = "block text-xs font-bold text-slate-500 uppercase mb-1";

export const PersonalFields = ({ data, onChange }) => (
    <div className="space-y-3">
        {[['Full Name','name','text'],['Email','email','email'],['Phone','phone','text'],['GitHub / LinkedIn URL','github','text']].map(([label,name,type])=>(
            <div key={name}><label className={lbl}>{label}</label><input type={type} name={name} value={data[name]||''} onChange={onChange} className={inp} placeholder={label}/></div>
        ))}
    </div>
);

export const ExperienceFields = ({ experience, onChange, onAddExp, onRemoveExp, onAddBullet, onRemoveBullet, onBulletChange }) => (
    <div className="space-y-5">
        {experience.map((exp, ei) => (
            <div key={ei} className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3 relative">
                <button onClick={()=>onRemoveExp(ei)} className="absolute top-3 right-3 text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4"/></button>
                {[['Job Role','role'],['Company','company'],['Duration (e.g. 2022 - Present)','duration']].map(([label,field])=>(
                    <div key={field}><label className={lbl}>{label}</label><input type="text" value={exp[field]||''} onChange={e=>onChange(ei,field,e.target.value)} className={inp} placeholder={label}/></div>
                ))}
                <div>
                    <label className={lbl}>Key Achievements</label>
                    <div className="space-y-2">
                        {(exp.bullets||[]).map((b,bi)=>(
                            <div key={bi} className="flex gap-2 items-center">
                                <input type="text" value={b} onChange={e=>onBulletChange(ei,bi,e.target.value)} className={inp} placeholder="Describe an achievement..."/>
                                <button onClick={()=>onRemoveBullet(ei,bi)} className="text-slate-400 hover:text-red-500"><Trash2 className="w-3.5 h-3.5"/></button>
                            </div>
                        ))}
                        <button onClick={()=>onAddBullet(ei)} className="text-indigo-600 text-xs font-bold flex items-center gap-1"><Plus className="w-3.5 h-3.5"/>Add Bullet</button>
                    </div>
                </div>
            </div>
        ))}
        <button onClick={onAddExp} className="w-full py-2 border-2 border-dashed border-indigo-200 hover:border-indigo-500 text-indigo-600 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition">
            <Plus className="w-4 h-4"/>Add Experience
        </button>
    </div>
);

export const EducationFields = ({ education, onChange, onAdd, onRemove }) => (
    <div className="space-y-4">
        {education.map((edu, ei) => (
            <div key={ei} className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3 relative">
                <button onClick={()=>onRemove(ei)} className="absolute top-3 right-3 text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4"/></button>
                {[['Degree / Certificate','degree'],['School / University','school'],['Duration (e.g. 2018 - 2022)','duration']].map(([label,field])=>(
                    <div key={field}><label className={lbl}>{label}</label><input type="text" value={edu[field]||''} onChange={e=>onChange(ei,field,e.target.value)} className={inp} placeholder={label}/></div>
                ))}
            </div>
        ))}
        <button onClick={onAdd} className="w-full py-2 border-2 border-dashed border-indigo-200 hover:border-indigo-500 text-indigo-600 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition">
            <Plus className="w-4 h-4"/>Add Education
        </button>
    </div>
);

export const SkillsFields = ({ skills, onChange, onAdd, onRemove }) => (
    <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
            {skills.map((s,i)=>(
                <div key={i} className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg">
                    <input type="text" value={s} onChange={e=>onChange(i,e.target.value)} className="flex-1 bg-transparent text-sm font-medium focus:outline-none" placeholder="Skill..."/>
                    <button onClick={()=>onRemove(i)} className="text-slate-400 hover:text-red-500"><Trash2 className="w-3.5 h-3.5"/></button>
                </div>
            ))}
        </div>
        <button onClick={onAdd} className="w-full py-2 border-2 border-dashed border-indigo-200 hover:border-indigo-500 text-indigo-600 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition">
            <Plus className="w-4 h-4"/>Add Skill
        </button>
    </div>
);

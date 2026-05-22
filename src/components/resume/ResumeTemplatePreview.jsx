import React from 'react';

const empty = {
    personalInfo: { name: 'Your Name', email: 'email@example.com', phone: '+1 234 567 890', github: 'github.com/you' },
    experience: [{ role: 'Software Engineer', company: 'Google', duration: '2022 – Present', bullets: ['Built scalable APIs serving 10M users.', 'Improved performance by 30%.'] }],
    education: [{ degree: 'B.S. Computer Science', school: 'MIT', duration: '2018 – 2022' }],
    skills: ['React', 'Node.js', 'Python', 'AWS', 'Docker']
};

export const ModernTemplate = ({ data = empty }) => {
    const d = { ...empty, ...data, personalInfo: { ...empty.personalInfo, ...data?.personalInfo } };
    return (
        <div className="bg-white text-slate-800 font-sans text-xs space-y-4 p-1">
            <div className="border-b pb-3">
                <h1 className="text-xl font-black uppercase tracking-tight text-slate-900">{d.personalInfo.name}</h1>
                <p className="text-slate-500 font-semibold text-[10px] mt-0.5 uppercase tracking-wider">
                    {d.personalInfo.email} {d.personalInfo.phone && `| ${d.personalInfo.phone}`} {d.personalInfo.github && `| ${d.personalInfo.github}`}
                </p>
            </div>
            <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 space-y-3">
                    <div>
                        <h3 className="text-[10px] font-bold uppercase tracking-widest border-b pb-0.5 mb-2">Experience</h3>
                        {(d.experience || []).map((exp, i) => (
                            <div key={i} className="mb-2">
                                <div className="flex justify-between font-bold text-[10px]"><span>{exp.role} @ {exp.company}</span><span className="text-slate-400">{exp.duration}</span></div>
                                <ul className="list-disc ml-3 mt-1 space-y-0.5 text-slate-600 text-[10px]">{(exp.bullets||[]).map((b,j)=>b&&<li key={j}>{b}</li>)}</ul>
                            </div>
                        ))}
                    </div>
                    <div>
                        <h3 className="text-[10px] font-bold uppercase tracking-widest border-b pb-0.5 mb-2">Education</h3>
                        {(d.education || []).map((edu, i) => (
                            <div key={i} className="flex justify-between text-[10px]">
                                <span className="font-bold">{edu.degree} <span className="text-slate-500">| {edu.school}</span></span>
                                <span className="text-slate-400">{edu.duration}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="col-span-1">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest border-b pb-0.5 mb-2">Skills</h3>
                    <div className="flex flex-wrap gap-1">{(d.skills||[]).filter(Boolean).map((s,i)=><span key={i} className="bg-slate-100 text-[9px] px-1.5 py-0.5 rounded font-semibold">{s}</span>)}</div>
                </div>
            </div>
        </div>
    );
};

export const ClassicTemplate = ({ data = empty }) => {
    const d = { ...empty, ...data, personalInfo: { ...empty.personalInfo, ...data?.personalInfo } };
    return (
        <div className="bg-white text-slate-800 font-serif text-xs space-y-3 p-1">
            <div className="text-center border-b pb-3">
                <h1 className="text-xl font-extrabold uppercase tracking-wide">{d.personalInfo.name}</h1>
                <p className="text-slate-500 text-[10px] tracking-wider mt-0.5">
                    {d.personalInfo.email}{d.personalInfo.phone && ` • ${d.personalInfo.phone}`}{d.personalInfo.github && ` • ${d.personalInfo.github}`}
                </p>
            </div>
            <div>
                <h3 className="text-[10px] font-bold uppercase tracking-widest border-b border-slate-400 pb-0.5 mb-2">Experience</h3>
                {(d.experience||[]).map((exp,i)=>(
                    <div key={i} className="mb-2">
                        <div className="flex justify-between font-bold text-[10px]"><span>{exp.role} — {exp.company}</span><span className="text-slate-400">{exp.duration}</span></div>
                        <ul className="list-disc ml-3 mt-1 text-[10px] text-slate-600 space-y-0.5">{(exp.bullets||[]).map((b,j)=>b&&<li key={j}>{b}</li>)}</ul>
                    </div>
                ))}
            </div>
            <div>
                <h3 className="text-[10px] font-bold uppercase tracking-widest border-b border-slate-400 pb-0.5 mb-2">Education</h3>
                {(d.education||[]).map((edu,i)=>(
                    <div key={i} className="flex justify-between text-[10px]"><span className="font-bold">{edu.degree}, {edu.school}</span><span className="text-slate-400">{edu.duration}</span></div>
                ))}
            </div>
            <div>
                <h3 className="text-[10px] font-bold uppercase tracking-widest border-b border-slate-400 pb-0.5 mb-2">Skills</h3>
                <p className="text-[10px] text-slate-600">{(d.skills||[]).filter(Boolean).join(', ')}</p>
            </div>
        </div>
    );
};

export const CreativeTemplate = ({ data = empty }) => {
    const d = { ...empty, ...data, personalInfo: { ...empty.personalInfo, ...data?.personalInfo } };
    return (
        <div className="bg-white text-xs space-y-0 p-1">
            <div className="bg-gradient-to-r from-indigo-700 to-purple-700 text-white -mx-1 px-4 py-3 mb-4 rounded-t">
                <h1 className="text-base font-black uppercase tracking-tight">{d.personalInfo.name}</h1>
                <div className="flex flex-wrap gap-x-3 text-[9px] font-semibold opacity-90 mt-0.5">
                    {d.personalInfo.email && <span>{d.personalInfo.email}</span>}
                    {d.personalInfo.phone && <span>• {d.personalInfo.phone}</span>}
                    {d.personalInfo.github && <span>• {d.personalInfo.github}</span>}
                </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1 space-y-3">
                    <div>
                        <h3 className="text-[9px] font-bold text-indigo-700 uppercase tracking-widest border-b-2 border-indigo-100 pb-0.5 mb-1">Skills</h3>
                        {(d.skills||[]).filter(Boolean).map((s,i)=><div key={i} className="text-[10px] font-bold text-slate-700">▸ {s}</div>)}
                    </div>
                    <div>
                        <h3 className="text-[9px] font-bold text-indigo-700 uppercase tracking-widest border-b-2 border-indigo-100 pb-0.5 mb-1">Education</h3>
                        {(d.education||[]).map((edu,i)=>(
                            <div key={i} className="text-[10px] space-y-0.5"><div className="font-bold">{edu.degree}</div><div className="text-slate-500">{edu.school}</div><div className="text-slate-400">{edu.duration}</div></div>
                        ))}
                    </div>
                </div>
                <div className="col-span-2">
                    <h3 className="text-[9px] font-bold text-indigo-700 uppercase tracking-widest border-b-2 border-indigo-100 pb-0.5 mb-2">Experience</h3>
                    {(d.experience||[]).map((exp,i)=>(
                        <div key={i} className="mb-2">
                            <div className="flex justify-between font-bold text-[10px]"><span>{exp.role} @ {exp.company}</span><span className="text-slate-400 font-semibold">{exp.duration}</span></div>
                            <ul className="list-disc ml-3 mt-0.5 text-[10px] text-slate-600 space-y-0.5">{(exp.bullets||[]).map((b,j)=>b&&<li key={j}>{b}</li>)}</ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export const FullModernTemplate = ({ data }) => {
    const d = data;
    return (
        <div className="bg-white text-slate-800 font-sans text-sm space-y-5">
            <div className="border-b pb-4">
                <h1 className="text-3xl font-black uppercase tracking-tight text-slate-900">{d.personalInfo.name || 'Your Name'}</h1>
                <p className="text-slate-500 font-semibold text-xs mt-1 uppercase tracking-wider">
                    {[d.personalInfo.email, d.personalInfo.phone, d.personalInfo.github].filter(Boolean).join(' | ')}
                </p>
            </div>
            <div className="grid grid-cols-3 gap-8">
                <div className="col-span-2 space-y-5">
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-widest border-b pb-1 mb-3">Experience</h3>
                        {(d.experience||[]).map((exp,i)=>(
                            <div key={i} className="mb-4">
                                <div className="flex justify-between font-bold text-xs"><span>{exp.role} @ {exp.company}</span><span className="text-slate-500">{exp.duration}</span></div>
                                <ul className="list-disc ml-4 mt-1.5 space-y-1 text-slate-600 text-xs leading-relaxed">{(exp.bullets||[]).map((b,j)=>b&&<li key={j}>{b}</li>)}</ul>
                            </div>
                        ))}
                    </div>
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-widest border-b pb-1 mb-3">Education</h3>
                        {(d.education||[]).map((edu,i)=>(
                            <div key={i} className="flex justify-between text-xs"><span className="font-bold">{edu.degree} <span className="text-slate-500">| {edu.school}</span></span><span className="font-semibold text-slate-500">{edu.duration}</span></div>
                        ))}
                    </div>
                </div>
                <div className="col-span-1">
                    <h3 className="text-sm font-bold uppercase tracking-widest border-b pb-1 mb-3">Skills</h3>
                    <div className="flex flex-wrap gap-1.5">{(d.skills||[]).filter(Boolean).map((s,i)=><span key={i} className="bg-slate-100 text-slate-700 text-[10px] px-2 py-0.5 rounded font-semibold">{s}</span>)}</div>
                </div>
            </div>
        </div>
    );
};

export const FullClassicTemplate = ({ data }) => {
    const d = data;
    return (
        <div className="bg-white text-slate-800 font-serif text-sm space-y-5">
            <div className="text-center border-b pb-4">
                <h1 className="text-3xl font-extrabold uppercase tracking-wide">{d.personalInfo.name || 'Your Name'}</h1>
                <p className="text-slate-600 font-semibold text-xs tracking-wider mt-1">
                    {[d.personalInfo.email, d.personalInfo.phone, d.personalInfo.github].filter(Boolean).join(' • ')}
                </p>
            </div>
            <div>
                <h3 className="text-xs font-bold uppercase tracking-widest border-b border-slate-400 pb-0.5 mb-3">Experience</h3>
                {(d.experience||[]).map((exp,i)=>(
                    <div key={i} className="mb-4">
                        <div className="flex justify-between font-bold text-xs"><span>{exp.role} — {exp.company}</span><span className="text-slate-500">{exp.duration}</span></div>
                        <ul className="list-disc ml-4 mt-1.5 text-xs text-slate-600 space-y-1">{(exp.bullets||[]).map((b,j)=>b&&<li key={j}>{b}</li>)}</ul>
                    </div>
                ))}
            </div>
            <div>
                <h3 className="text-xs font-bold uppercase tracking-widest border-b border-slate-400 pb-0.5 mb-3">Education</h3>
                {(d.education||[]).map((edu,i)=>(
                    <div key={i} className="flex justify-between text-xs"><span className="font-bold">{edu.degree}, {edu.school}</span><span className="text-slate-500">{edu.duration}</span></div>
                ))}
            </div>
            <div>
                <h3 className="text-xs font-bold uppercase tracking-widest border-b border-slate-400 pb-0.5 mb-3">Skills</h3>
                <p className="text-xs text-slate-600">{(d.skills||[]).filter(Boolean).join(', ')}</p>
            </div>
        </div>
    );
};

export const FullCreativeTemplate = ({ data }) => {
    const d = data;
    return (
        <div className="bg-white text-sm">
            <div className="bg-gradient-to-r from-indigo-700 to-purple-700 text-white -mx-12 -mt-12 px-12 py-8 mb-6">
                <h1 className="text-3xl font-black uppercase tracking-tight">{d.personalInfo.name || 'Your Name'}</h1>
                <div className="flex flex-wrap gap-x-4 text-[11px] font-semibold opacity-90 mt-1">
                    {[d.personalInfo.email, d.personalInfo.phone, d.personalInfo.github].filter(Boolean).map((v,i)=><span key={i}>{i>0?'• ':''}{v}</span>)}
                </div>
            </div>
            <div className="grid grid-cols-3 gap-8">
                <div className="col-span-1 space-y-5">
                    <div>
                        <h3 className="text-xs font-bold text-indigo-700 uppercase tracking-widest border-b-2 border-indigo-100 pb-1 mb-2">Skills</h3>
                        {(d.skills||[]).filter(Boolean).map((s,i)=><div key={i} className="text-xs font-bold text-slate-700">▸ {s}</div>)}
                    </div>
                    <div>
                        <h3 className="text-xs font-bold text-indigo-700 uppercase tracking-widest border-b-2 border-indigo-100 pb-1 mb-2">Education</h3>
                        {(d.education||[]).map((edu,i)=>(
                            <div key={i} className="text-xs space-y-0.5"><div className="font-bold">{edu.degree}</div><div className="text-slate-500">{edu.school}</div><div className="text-slate-400">{edu.duration}</div></div>
                        ))}
                    </div>
                </div>
                <div className="col-span-2">
                    <h3 className="text-xs font-bold text-indigo-700 uppercase tracking-widest border-b-2 border-indigo-100 pb-1 mb-3">Experience</h3>
                    {(d.experience||[]).map((exp,i)=>(
                        <div key={i} className="mb-4">
                            <div className="flex justify-between font-bold text-xs"><span>{exp.role} @ {exp.company}</span><span className="text-slate-400">{exp.duration}</span></div>
                            <ul className="list-disc ml-4 mt-1 text-xs text-slate-600 space-y-1">{(exp.bullets||[]).map((b,j)=>b&&<li key={j}>{b}</li>)}</ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

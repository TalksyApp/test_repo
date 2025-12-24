"use client"

import React, { useState, useEffect } from "react"
import { X, Save, Upload, User as UserIcon, Calendar, MapPin, Globe, Briefcase, GraduationCap } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { User } from "@/lib/storage"

interface EditProfileModalProps {
    isOpen: boolean
    onClose: () => void
    currentUser: any
    onSave: (updatedUser: any) => void
}

export default function EditProfileModal({ isOpen, onClose, currentUser, onSave }: EditProfileModalProps) {
    const [formData, setFormData] = useState(currentUser)
    const [activeSection, setActiveSection] = useState<'basics' | 'details'>('basics')

    useEffect(() => {
        setFormData(currentUser)
    }, [currentUser])

    if (!isOpen) return null

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData((prev: any) => ({ ...prev, [name]: value }))
    }

    const handleSave = () => {
        onSave(formData)
        onClose()
    }

    // Prevent closing when clicking modal content
    const handleContentClick = (e: React.MouseEvent) => {
        e.stopPropagation()
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
            {/* Backdrop */}
            <div
                onClick={onClose}
                className="absolute inset-0 bg-black/60 backdrop-blur-md transition-all"
            ></div>

            {/* Modal Content */}
            <div
                onClick={handleContentClick}
                className="relative w-full max-w-2xl bg-[#0c0c0e] border border-white/10 rounded-[32px] shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 slide-in-from-bottom-4 duration-300"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 bg-white/5 backdrop-blur-xl shrink-0">
                    <h2 className="text-xl font-display font-bold text-white tracking-tight">Edit Identity</h2>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex px-6 pt-6 gap-4 shrink-0">
                    <button
                        onClick={() => setActiveSection('basics')}
                        className={`pb-3 text-sm font-bold uppercase tracking-wider border-b-2 transition-all ${activeSection === 'basics' ? 'text-indigo-400 border-indigo-500' : 'text-gray-500 border-transparent hover:text-white'}`}
                    >
                        Visuals & Bio
                    </button>
                    <button
                        onClick={() => setActiveSection('details')}
                        className={`pb-3 text-sm font-bold uppercase tracking-wider border-b-2 transition-all ${activeSection === 'details' ? 'text-indigo-400 border-indigo-500' : 'text-gray-500 border-transparent hover:text-white'}`}
                    >
                        The Matrix
                    </button>
                </div>

                {/* Scrollable Form Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-white/10 hover:scrollbar-thumb-white/20">

                    {activeSection === 'basics' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            {/* Images Preview & Edit */}
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                                        <Upload size={14} /> Banner URL
                                    </label>
                                    <input
                                        name="bannerUrl"
                                        value={formData.bannerUrl || ''}
                                        onChange={handleChange}
                                        className="w-full bg-[#151518] border border-white/10 rounded-xl p-3 text-white focus:border-indigo-500 outline-none transition-all placeholder:text-gray-700 font-mono text-sm"
                                        placeholder="https://..."
                                    />
                                    {formData.bannerUrl && (
                                        <div className="h-24 w-full rounded-xl overflow-hidden border border-white/5 mt-2">
                                            <img src={formData.bannerUrl} alt="Banner Preview" className="w-full h-full object-cover opacity-60" />
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                                        <UserIcon size={14} /> Avatar URL
                                    </label>
                                    <div className="flex gap-4">
                                        <div className="w-16 h-16 rounded-2xl bg-[#151518] border border-white/10 overflow-hidden flex items-center justify-center shrink-0">
                                            {formData.avatarUrl ? (
                                                <img src={formData.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-xl font-bold text-gray-600">{formData.username?.[0]}</span>
                                            )}
                                        </div>
                                        <input
                                            name="avatarUrl"
                                            value={formData.avatarUrl || ''}
                                            onChange={handleChange}
                                            className="flex-1 bg-[#151518] border border-white/10 rounded-xl p-3 text-white focus:border-indigo-500 outline-none transition-all placeholder:text-gray-700 font-mono text-sm h-12 my-auto"
                                            placeholder="https://..."
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Name & Bio */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Username</label>
                                    <input name="username" value={formData.username} onChange={handleChange} className="w-full bg-[#151518] border border-white/10 rounded-xl p-3 text-white focus:border-indigo-500 outline-none font-bold tracking-tight" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Bio</label>
                                    <textarea name="bio" value={formData.bio || ''} onChange={handleChange} rows={3} className="w-full bg-[#151518] border border-white/10 rounded-xl p-3 text-white focus:border-indigo-500 outline-none resize-none" placeholder="Tell the void about yourself..." />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeSection === 'details' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2"><MapPin size={12} /> Current City</label>
                                <input name="currentCity" value={formData.currentCity || ''} onChange={handleChange} className="w-full bg-[#151518] border border-white/10 rounded-xl p-3 text-white focus:border-indigo-500 outline-none" placeholder="Night City" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2"><Globe size={12} /> City of Birth</label>
                                <input name="cityOfBirth" value={formData.cityOfBirth || ''} onChange={handleChange} className="w-full bg-[#151518] border border-white/10 rounded-xl p-3 text-white focus:border-indigo-500 outline-none" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2"><Calendar size={12} /> Birthday</label>
                                <input type="date" name="birthday" value={formData.birthday || ''} onChange={handleChange} className="w-full bg-[#151518] border border-white/10 rounded-xl p-3 text-white focus:border-indigo-500 outline-none" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase">Zodiac</label>
                                <input name="zodiac" value={formData.zodiac || ''} onChange={handleChange} className="w-full bg-[#151518] border border-white/10 rounded-xl p-3 text-white focus:border-indigo-500 outline-none" placeholder="Scorpio" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase">Gender</label>
                                <select name="gender" value={formData.gender || ''} onChange={handleChange} className="w-full bg-[#151518] border border-white/10 rounded-xl p-3 text-white focus:border-indigo-500 outline-none appearance-none">
                                    <option value="">Select...</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Non-binary">Non-binary</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase">Mother Tongue</label>
                                <input name="motherTongue" value={formData.motherTongue || ''} onChange={handleChange} className="w-full bg-[#151518] border border-white/10 rounded-xl p-3 text-white focus:border-indigo-500 outline-none" />
                            </div>

                            <div className="col-span-full space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2"><GraduationCap size={12} /> School/College</label>
                                <input name="school" value={formData.school || ''} onChange={handleChange} className="w-full bg-[#151518] border border-white/10 rounded-xl p-3 text-white focus:border-indigo-500 outline-none" />
                            </div>
                        </div>
                    )}

                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/5 bg-white/5 shrink-0 flex justify-end gap-3">
                    <Button variant="ghost" onClick={onClose} className="hover:bg-white/10 text-gray-400 hover:text-white">Cancel</Button>
                    <Button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 rounded-full font-bold shadow-[0_0_20px_rgba(79,70,229,0.4)] transition-all hover:scale-105 flex items-center gap-2">
                        <Save size={18} /> Save Changes
                    </Button>
                </div>
            </div>
        </div>
    )
}

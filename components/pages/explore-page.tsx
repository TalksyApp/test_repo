"use client"

import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, Zap, Heart, MessageCircle, Hash, Globe, Brain } from 'lucide-react';
import type { User, Topic } from "@/lib/storage"
import TopicDetail from "@/components/topic-detail"

interface ExplorePageProps {
  currentUser: User
  selectedTopic: string | null
  onTopicSelect: (topicId: string | null) => void
  onNavigateToGroups: () => void
}

// --- NEW CATEGORIZED DATA ---
const TOPIC_CATEGORIES = [
  {
    id: "youth",
    title: "CORE YOUTH / DAILY LIFE",
    icon: <MessageCircle className="text-yellow-400" />,
    gradient: "from-yellow-400 to-orange-500",
    topics: [
      "TeenTalks", "IndianTeens", "Late Night Chats 🌙", "School Se Zindagi Tak",
      "College Confessions", "Real Life, No Filter", "Aaj Ka Mood", "Mind Dump 🧠",
      "Life Lately...", "Dil Ki Baat"
    ]
  },
  {
    id: "relationships",
    title: "RELATIONSHIPS / FEELINGS",
    icon: <Heart className="text-pink-500" />,
    gradient: "from-pink-500 to-rose-600",
    topics: [
      "Crush Stories 😳", "Situationships Only", "Breakup Therapy", "Pyar Vyar Sab Moh Maya?",
      "Single but Thriving", "Red Flags 🚩", "Green Flags 🌱", "Love or Lust?",
      "Texting Problems", "Ex Talk (No Judging)"
    ]
  },
  {
    id: "fun",
    title: "FUN / RANDOM / CHAOTIC",
    icon: <Zap className="text-purple-500" />,
    gradient: "from-purple-500 to-indigo-500",
    topics: [
      "Random Bakchodi", "No Context Talks", "Midnight Thoughts", "Overthinking Club",
      "Brain Rot Zone", "Bol Bhai Bol", "Yeh Kya Tha 💀", "Just Vibing",
      "Laugh or Cry?", "Pure Chaos"
    ]
  },
  {
    id: "internet",
    title: "INTERNET / POP CULTURE",
    icon: <Globe className="text-cyan-400" />,
    gradient: "from-cyan-400 to-blue-500",
    topics: [
      "Internet Pe Kya Chal Raha Hai", "Memes & Trends", "Reels Addiction", "Cancel Culture Talk",
      "Influencer Drama", "Viral or Cringe?", "Pop Culture Debates", "X, Insta, Reddit Talks",
      "Online vs Real Life", "Digital Life Problems"
    ]
  },
  {
    id: "opinions",
    title: "OPINIONS / DEEP TALKS",
    icon: <Brain className="text-emerald-400" />,
    gradient: "from-emerald-400 to-green-500",
    topics: [
      "Unpopular Opinions", "Sach Batao...", "Serious Talks Only", "Reality Check",
      "Life Advice Needed", "Future Fears", "Career Confusion", "Middle Class Stories",
      "India Today 🇮🇳", "What Would You Do?"
    ]
  }
];

const FEATURED_CARDS = [
  { title: "The Digital Void", subtitle: "Philosophy", color: "from-indigo-500 to-purple-500", tag: "Void" },
  { title: "Neon Nights", subtitle: "Photography", color: "from-[#f91880] to-orange-500", tag: "NightLife" },
  { title: "Code Art", subtitle: "Development", color: "from-emerald-500 to-cyan-500", tag: "Coding" },
];

export default function ExplorePage({ currentUser, selectedTopic, onTopicSelect, onNavigateToGroups }: ExplorePageProps) {

  if (selectedTopic) {
    // Mock a topic object for the detail view since we just have the ID/Name
    const topic = { name: selectedTopic };
    return (
      <TopicDetail
        topic={topic}
        onBack={() => onTopicSelect(null)}
        currentUser={currentUser}
      />
    );
  }

  return (
    <div className="w-full pt-10 pb-32 animate-in fade-in slide-in-from-bottom-8 duration-700 px-4 md:px-6 overflow-y-auto h-full scrollbar-hide">

      <div className="mb-8 md:mb-12 flex justify-between items-end">
        <div>
          <h1 className="text-4xl md:text-5xl font-display font-black text-white mb-2 tracking-tight">Explore</h1>
          <p className="text-zinc-500 text-base md:text-lg font-medium">Find your frequency in the noise.</p>
        </div>
        <button
          onClick={onNavigateToGroups}
          className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full font-medium transition-colors text-sm md:text-base hidden md:block"
        >
          Group Chats
        </button>
      </div>

      {/* Search Bar - Sticky Top on Mobile */}
      <div className="sticky top-0 z-50 -mx-4 px-4 py-3 mb-8 bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/5 md:relative md:bg-transparent md:backdrop-blur-none md:border-none md:p-0 md:mx-0 md:mb-12 group transition-all duration-300">
        <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl opacity-20 blur-xl group-hover:opacity-40 transition-opacity duration-500"></div>
        <div className="relative bg-[#121214] md:bg-[#0a0a0a] border border-white/10 rounded-2xl flex items-center px-4 md:px-6 py-3.5 md:py-5 transition-all group-focus-within:border-white/30 group-focus-within:bg-black shadow-lg md:shadow-none">
          <Search className="text-zinc-500 group-focus-within:text-white transition-colors mr-3 md:mr-4" size={20} />
          <input
            type="text"
            placeholder="Search users, topics..."
            className="w-full bg-transparent text-lg md:text-xl text-white placeholder-zinc-600 outline-none border-none font-medium"
          />
        </div>
      </div>

      {/* Featured Cards (Mobile: Horizontal Scroll, Desktop: Grid) */}
      <h3 className="text-2xl font-display font-bold text-white mb-6 flex items-center gap-3"><Zap className="text-yellow-400" fill="currentColor" /> Featured</h3>
      <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 md:grid md:grid-cols-3 md:gap-6 mb-16 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide pb-4 md:pb-0">
        {FEATURED_CARDS.map((card, i) => (
          <div key={i} onClick={() => onTopicSelect(card.tag)} className="flex-shrink-0 w-[85vw] md:w-auto snap-center h-48 md:h-40 rounded-3xl relative overflow-hidden group cursor-pointer border border-white/5 hover:border-white/20 transition-all active:scale-95 z-0">
            <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-20 md:opacity-10 group-hover:opacity-30 transition-opacity`}></div>
            <div className="absolute bottom-6 left-6">
              <div className="text-sm font-bold text-gray-400 mb-1 uppercase tracking-wider">{card.subtitle}</div>
              <div className="text-2xl md:text-3xl font-display font-black text-white group-hover:translate-x-2 transition-transform">{card.title}</div>
            </div>
          </div>
        ))}
      </div>

      {/* --- CATEGORIZED TOPIC SECTIONS --- */}
      <div className="space-y-10 md:space-y-12">
        {TOPIC_CATEGORIES.map((category) => (
          <div key={category.id} className="animate-in fade-in slide-in-from-bottom-4 duration-1000">

            {/* Section Header */}
            <div className="flex items-center gap-3 mb-4 md:mb-6 pl-1">
              <div className="p-2 rounded-xl bg-white/5 border border-white/5">
                {category.icon}
              </div>
              <h3 className={`text-xl md:text-2xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r ${category.gradient}`}>
                {category.title}
              </h3>
            </div>

            {/* Topics Grid (Mobile: Horizontal Scroll, Desktop: Wrap) */}
            <div className="flex flex-nowrap overflow-x-auto snap-x snap-mandatory gap-3 py-2 -mx-4 px-4 md:flex-wrap md:overflow-visible md:mx-0 md:px-0 md:py-0 scrollbar-hide">
              {category.topics.map((topic, i) => (
                <div
                  key={i}
                  onClick={() => onTopicSelect(topic)}
                  className="flex-shrink-0 snap-start group relative px-5 py-3 md:py-2.5 rounded-full border border-white/10 bg-[#121214] text-zinc-400 cursor-pointer overflow-hidden hover:scale-105 active:scale-95 transition-all duration-300"
                >
                  {/* Hover Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${category.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>

                  {/* Hover Glow Border Effect */}
                  <div className={`absolute inset-0 rounded-full border border-transparent group-hover:border-white/20 transition-colors`}></div>

                  <span className="relative z-10 text-[15px] md:text-[15px] font-medium group-hover:text-white transition-colors whitespace-nowrap">
                    {topic}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

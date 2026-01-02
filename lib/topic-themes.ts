export interface TopicTheme {
    id: string;
    // Primary Color (Used for text, borders, thin lines)
    primary: string;       // e.g. "text-indigo-400"
    primaryBg: string;     // e.g. "bg-indigo-500"

    // Gradient (Used for heavy backgrounds, headers, icons)
    gradient: string;      // e.g. "from-indigo-600 to-purple-600"

    // Message Bubbles
    bubbleSelf: string;    // e.g. "bg-indigo-600 text-white"

    // Interactive Elements
    heartColor: string;    // e.g. "text-pink-500" (active state)
}

// Map specific topic names to themes
const THEME_MAPPING: Record<string, string> = {
    // Relationships (Rose Theme)
    'Crush Stories': 'rose',
    'Situationships Only': 'rose',
    'Breakup Therapy': 'rose',
    'Pyar Vyar Sab Moh Maya?': 'rose',
    'Single but Thriving': 'rose',
    'Red Flags': 'rose',
    'Green Flags': 'rose',
    'Love or Lust?': 'rose',
    'Texting Problems': 'rose',
    'Ex Talk (No Judging)': 'rose',
    'Love': 'rose',
    'Dating': 'rose',

    // Fun / Chaotic (Cyberpunk/Neon Theme)
    'Random Bakchodi': 'cyberpunk',
    'No Context Talks': 'cyberpunk',
    'Midnight Thoughts': 'cyberpunk',
    'Overthinking Club': 'cyberpunk',
    'Brain Rot Zone': 'cyberpunk',
    'Bol Bhai Bol': 'cyberpunk',
    'Yeh Kya Tha': 'cyberpunk',
    'Just Vibing': 'cyberpunk',
    'Laugh or Cry?': 'cyberpunk',
    'Pure Chaos': 'cyberpunk',
    'Gaming': 'cyberpunk',

    // Internet / Tech (Matrix Theme)
    'Internet Pe Kya Chal Raha Hai': 'matrix',
    'Memes & Trends': 'matrix',
    'Reels Addiction': 'matrix',
    'Cancel Culture Talk': 'matrix',
    'Influencer Drama': 'matrix',
    'Viral or Cringe?': 'matrix',
    'Pop Culture Debates': 'matrix',
    'X, Insta, Reddit Talks': 'matrix',
    'Technology': 'matrix',
    'Coding': 'matrix',
    'AI': 'matrix',

    // Core Youth / Life (Gold/Warm Theme)
    'TeenTalks': 'gold',
    'IndianTeens': 'gold',
    'Late Night Chats': 'gold',
    'School Se Zindagi Tak': 'gold',
    'College Confessions': 'gold',
    'Real Life, No Filter': 'gold',
    'Aaj Ka Mood': 'gold',
    'Mind Dump': 'gold',
    'Life Lately...': 'gold',
    'Dil Ki Baat': 'gold',

    // Art / Soft (Pastel Theme)
    'Art': 'pastel',
    'Poetry': 'pastel',
    'Aesthetics': 'pastel',

    // Nature (Organic Theme)
    'Nature': 'organic',
    'Travel': 'organic'
};

export const TOPIC_THEMES: Record<string, TopicTheme> = {
    'default': {
        id: 'default',
        primary: 'text-indigo-400',
        primaryBg: 'bg-indigo-600',
        gradient: 'from-indigo-600 to-purple-600',
        bubbleSelf: 'bg-indigo-600 text-white',
        heartColor: 'text-pink-500'
    },
    'cyberpunk': {
        id: 'cyberpunk',
        primary: 'text-cyan-400',
        primaryBg: 'bg-cyan-600',
        gradient: 'from-cyan-500 via-blue-600 to-purple-600',
        bubbleSelf: 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white',
        heartColor: 'text-cyan-400'
    },
    'matrix': {
        id: 'matrix',
        primary: 'text-emerald-400',
        primaryBg: 'bg-emerald-600',
        gradient: 'from-emerald-600 to-teal-900',
        bubbleSelf: 'bg-emerald-700 text-white border border-emerald-500/30',
        heartColor: 'text-emerald-500'
    },
    'organic': {
        id: 'organic',
        primary: 'text-green-400',
        primaryBg: 'bg-green-600',
        gradient: 'from-green-500 to-emerald-700',
        bubbleSelf: 'bg-green-600 text-white',
        heartColor: 'text-green-400'
    },
    'rose': {
        id: 'rose',
        primary: 'text-rose-300',
        primaryBg: 'bg-rose-500',
        gradient: 'from-rose-500 to-pink-600',
        bubbleSelf: 'bg-rose-500 text-white',
        heartColor: 'text-rose-400'
    },
    'soundwave': {
        id: 'soundwave',
        primary: 'text-violet-400',
        primaryBg: 'bg-violet-600',
        gradient: 'from-violet-600 via-fuchsia-600 to-purple-600',
        bubbleSelf: 'bg-violet-600 text-white',
        heartColor: 'text-fuchsia-400'
    },
    'gold': {
        id: 'gold',
        primary: 'text-amber-400',
        primaryBg: 'bg-amber-500',
        gradient: 'from-amber-500 to-orange-600',
        bubbleSelf: 'bg-gradient-to-r from-amber-600 to-orange-600 text-white',
        heartColor: 'text-amber-400'
    },
    'pastel': {
        id: 'pastel',
        primary: 'text-fuchsia-300',
        primaryBg: 'bg-fuchsia-400',
        gradient: 'from-fuchsia-400 to-pink-400',
        bubbleSelf: 'bg-fuchsia-500 text-white',
        heartColor: 'text-pink-300'
    }
};

export function getThemeForTopic(topicName: string): TopicTheme {
    // 1. Check direct mapping
    const themeKey = THEME_MAPPING[topicName];
    if (themeKey && TOPIC_THEMES[themeKey]) {
        return TOPIC_THEMES[themeKey];
    }

    // 2. Fallback: Check if topic name contains keywords (simple matching)
    const lower = topicName.toLowerCase();

    // Love / Relationships -> Rose
    if (lower.includes('love') || lower.includes('crush') || lower.includes('date') || lower.includes('relat') || lower.includes('breakup') || lower.includes('ex') || lower.includes('pyar') || lower.includes('dil')) return TOPIC_THEMES['rose'];

    // Fun / Chaos -> Cyberpunk
    if (lower.includes('game') || lower.includes('chaos') || lower.includes('bakchodi') || lower.includes('vib') || lower.includes('mid') || lower.includes('rot')) return TOPIC_THEMES['cyberpunk'];

    // Tech / Internet -> Matrix
    if (lower.includes('tech') || lower.includes('code') || lower.includes('data') || lower.includes('net') || lower.includes('web') || lower.includes('meme') || lower.includes('reel') || lower.includes('viral')) return TOPIC_THEMES['matrix'];

    // Nature / Life -> Organic
    if (lower.includes('nature') || lower.includes('eco') || lower.includes('life') || lower.includes('travel')) return TOPIC_THEMES['organic'];

    // Youth / School -> Gold
    if (lower.includes('school') || lower.includes('college') || lower.includes('teen') || lower.includes('student') || lower.includes('exam')) return TOPIC_THEMES['gold'];

    // 3. Default
    return TOPIC_THEMES['default'];
}

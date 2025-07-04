// frontend/src/lib/theme.js

export const THEMES = {
    admin: {
        primary: 'from-red-900 via-rose-900 to-pink-900',
        secondary: 'from-red-800 to-rose-800',
        accent: 'red-500',
        text: 'red-100',
        textSecondary: 'red-200',
        border: 'red-500/20',
        glass: 'bg-red-900/20 backdrop-blur-3xl border-red-500/40',
        button: 'bg-red-600 hover:bg-red-700 border-red-500',
        buttonOutline: 'border-red-500 text-red-400 hover:bg-red-500/10',
        card: 'bg-red-900/10 backdrop-blur-sm border-red-500/20',
        badge: 'bg-red-500/20 text-red-300 border-red-500/30'
    },
    master_admin: {
        primary: 'from-slate-900 via-gray-900 to-black',
        secondary: 'from-red-600 to-orange-600',
        accent: 'red-500',
        text: 'white',
        textSecondary: 'white/70',
        border: 'white/10',
        glass: 'bg-white/5 backdrop-blur-xl border-white/10',
        button: 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white',
        buttonOutline: 'border-white/20 text-white/70 hover:bg-white/10',
        card: 'bg-white/5 backdrop-blur-xl border-white/10',
        badge: 'bg-white/10 text-white/80 border-white/20',
        statusActive: 'bg-green-500/20 text-green-400 border-green-500/30',
        statusTrial: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
        statusSuspended: 'bg-red-500/20 text-red-400 border-red-500/30',
        planEnterprise: 'bg-purple-500/20 text-purple-400',
        planProfessional: 'bg-blue-500/20 text-blue-400',
        planBasic: 'bg-green-500/20 text-green-400'
    },
    company: {
        primary: 'from-blue-900 via-purple-900 to-violet-900',
        secondary: 'from-blue-800 to-purple-800',
        accent: 'sky-500',
        text: 'white',
        textSecondary: 'blue-200',
        border: 'blue-500/20',
        glass: 'bg-blue-950/50 backdrop-blur-md border-blue-400/30 shadow-lg',
        button: 'bg-blue-600 hover:bg-blue-700 border-blue-500 text-white font-medium',
        buttonOutline: 'border-blue-400 text-blue-300 hover:bg-blue-500/10',
        card: 'bg-blue-950/40 backdrop-blur-md border-blue-400/30',
        badge: 'bg-blue-500/20 text-blue-100 border-blue-500/50'
    },
    employee: {
        primary: 'from-green-900 via-teal-900 to-emerald-900',
        secondary: 'from-green-800 to-teal-800',
        accent: 'green-500',
        text: 'green-100',
        textSecondary: 'green-200',
        border: 'green-500/20',
        glass: 'bg-green-900/20 backdrop-blur-3xl border-green-500/50',
        button: 'bg-green-600 hover:bg-green-700 border-green-500',
        buttonOutline: 'border-green-500 text-green-400 hover:bg-green-500/10',
        card: 'bg-green-900/10 backdrop-blur-sm border-green-500/20',
        badge: 'bg-green-500/20 text-green-300 border-green-500/30'
    }
};

export const getTheme = (userType) => {
    return THEMES[userType] || THEMES.company;
};

export const getThemeClasses = (userType, element = 'primary') => {
    const theme = getTheme(userType);
    return theme[element] || theme.primary;
};
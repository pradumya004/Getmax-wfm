// frontend/src/lib/theme.js

export const THEMES = {
    // admin: {
    //     primary: 'from-red-900 via-rose-900 to-pink-900',
    //     secondary: 'from-red-800 to-rose-800',
    //     accent: 'red-500',
    //     text: 'red-100',
    //     textSecondary: 'red-200',
    //     border: 'red-500/20',
    //     glass: 'bg-red-900/20 backdrop-blur-3xl border-red-500/40',
    //     button: 'bg-red-600 hover:bg-red-700 border-red-500',
    //     buttonOutline: 'border-red-500 text-red-400 hover:bg-red-500/10',
    //     card: 'bg-red-900/10 backdrop-blur-sm border-red-500/20',
    //     badge: 'bg-red-500/20 text-red-300 border-red-500/30'
    // },
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
        // primary: 'from-blue-900 via-purple-900 to-violet-900',
        primary: 'from-slate-900 via-gray-900 to-black',
        secondary: 'from-sky-500 to-blue-800',
        accent: 'blue-500',
        text: 'white',
        // textSecondary: 'blue-200',
        textSecondary: 'white/70',
        border: 'sky-500/40',
        // glass: 'bg-blue-950/20 backdrop-blur-xl border-sky-400/30 shadow-lg',
        glass: 'bg-white/5 backdrop-blur-xl border-white/10',
        button: 'bg-gradient-to-r from-cyan-500 to-blue-700 hover:from-cyan-700 hover:to-blue-700 text-white font-medium',
        buttonOutline: 'border-blue-400 text-blue-300 hover:bg-gradient-to-r hover:from-sky-500 hover:to-blue-800 hover:text-white',
        card: 'bg-blue-950/40 backdrop-blur-md border-blue-400/30',
        badge: 'bg-blue-500/20 text-blue-100 border-blue-500/50'
    },
    employee: {
        // primary: 'from-green-900 via-teal-900 to-emerald-900',
        primary: 'from-slate-900 via-gray-900 to-black',
        secondary: 'from-[#00e676] to-[#00796b]',
        accent: '[#1de9b6]',
        text: 'white',
        textSecondary: 'white/70',
        border: '[#00e676]/20',
        // glass: 'bg-green-900/20 backdrop-blur-3xl border-green-500/50',
        glass: 'bg-white/5 backdrop-blur-xl border-white/10',
        button: 'bg-green-600 hover:bg-green-700 border-green-500',
        buttonOutline: 'border-green-500 text-green-400 hover:bg-green-500/10',
        card: 'bg-green-900/10 backdrop-blur-sm border-green-500/20',
        badge: 'bg-green-500/20 text-green-300 border-green-500/30'
    }
};

export const getTheme = (userType) => {
    return THEMES[userType];
};

export const getThemeClasses = (userType, element = 'primary') => {
    const theme = getTheme(userType);
    return theme[element] || theme.primary;
};
// frontend/src/components/common/StatusBadge.jsx

import React from "react";
import {
    Circle,
    CheckCircle2,
    XCircle,
    AlertTriangle,
    Loader,
    Clock,
    PauseCircle,
    ShieldQuestion
} from "lucide-react";

export const StatusBadge = ({
    status,
    label,
    variant = "generic", // Default to 'generic' to not break existing usage
    showIcon = true,
    className = "",
}) => {
    
    // --- Implementation for Generic Statuses (Your Original Code) ---
    const getGenericStatusStyles = () => {
        const stylesConfig = {
            active: { bg: "bg-green-500/20", text: "text-green-400", border: "border-green-500/30", icon: "text-green-400" },
            inactive: { bg: "bg-gray-500/20", text: "text-gray-400", border: "border-gray-500/30", icon: "text-gray-400" },
            pending: { bg: "bg-yellow-500/20", text: "text-yellow-400", border: "border-yellow-500/30", icon: "text-yellow-400" },
            suspended: { bg: "bg-red-500/20", text: "text-red-400", border: "border-red-500/30", icon: "text-red-400" },
            completed: { bg: "bg-blue-500/20", text: "text-blue-400", border: "border-blue-500/30", icon: "text-blue-400" },
            trial: { bg: "bg-purple-500/20", text: "text-purple-400", border: "border-purple-500/30", icon: "text-purple-400" },
        };
        return stylesConfig[status?.toLowerCase()] || stylesConfig.inactive;
    };


    // --- Implementation for Detailed Claim Statuses (The New Code) ---
    const getClaimStatusConfig = () => {
        const statusConfig = {
            'New': { icon: <Circle className="w-3 h-3" />, classes: 'bg-blue-500/10 text-blue-400' },
            'Assigned': { icon: <Circle className="w-3 h-3" />, classes: 'bg-cyan-500/10 text-cyan-400' },
            'In Progress': { icon: <Loader className="w-3 h-3 animate-spin" />, classes: 'bg-yellow-500/10 text-yellow-400' },
            'Completed': { icon: <CheckCircle2 className="w-3 h-3" />, classes: 'bg-green-500/10 text-green-400' },
            'Denied': { icon: <AlertTriangle className="w-3 h-3" />, classes: 'bg-red-500/10 text-red-400' },
            'QA Failed': { icon: <XCircle className="w-3 h-3" />, classes: 'bg-red-600/10 text-red-500' },
            'Pending Info': { icon: <Clock className="w-3 h-3" />, classes: 'bg-orange-500/10 text-orange-400' },
            'On Hold': { icon: <PauseCircle className="w-3 h-3" />, classes: 'bg-purple-500/10 text-purple-400' },
            'QA Review': { icon: <ShieldQuestion className="w-3 h-3" />, classes: 'bg-indigo-500/10 text-indigo-400' },
            'Closed': { icon: <XCircle className="w-3 h-3" />, classes: 'bg-gray-500/10 text-gray-400' },
            'default': { icon: <Circle className="w-3 h-3" />, classes: 'bg-gray-600/10 text-gray-500' }
        };
        return statusConfig[status] || statusConfig.default;
    };

    // --- Render Logic: Choose which badge to display based on the 'variant' prop ---

    if (variant === 'claim') {
        const config = getClaimStatusConfig();
        return (
            <span
                className={`px-2.5 py-1 text-xs font-medium rounded-full inline-flex items-center gap-x-2 ${config.classes} ${className}`}
            >
                {config.icon}
                {status}
            </span>
        );
    }

    // Default to the generic variant for backward compatibility
    const styles = getGenericStatusStyles();
    const displayLabel = label || status;

    return (
        <span
            className={`
                inline-flex items-center space-x-1 px-2 py-1 rounded-md text-xs font-medium border
                ${styles.bg} ${styles.text} ${styles.border}
                ${className}
            `}
        >
            {showIcon && <Circle className={`w-2 h-2 fill-current ${styles.icon}`} />}
            <span className="capitalize">{displayLabel}</span>
        </span>
    );
};
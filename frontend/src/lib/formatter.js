// frontend/src/lib/formatter.js

export const formatPhoneNumber = (phone) => {
    if (!phone) return "";

    // Remove all non-digits
    const cleaned = phone.replace(/\D/g, "");

    // Format based on length
    if (cleaned.length === 10) {
        return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(
            6
        )}`;
    } else if (cleaned.length === 11 && cleaned[0] === "1") {
        return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(
            7
        )}`;
    }

    return phone; // Return original if can't format
};

export const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export const formatPercentage = (value, decimals = 1) => {
    return `${parseFloat(value).toFixed(decimals)}%`;
};

export const formatDuration = (minutes) => {
    if (minutes < 60) {
        return `${minutes}m`;
    } else if (minutes < 1440) {
        // Less than 24 hours
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    } else {
        const days = Math.floor(minutes / 1440);
        const hours = Math.floor((minutes % 1440) / 60);
        return hours > 0 ? `${days}d ${hours}h` : `${days}d`;
    }
};

export const formatAddress = (address) => {
    if (!address) return "";

    const parts = [
        address.street,
        address.city,
        address.state,
        address.zipCode,
        address.country,
    ].filter(Boolean);

    return parts.join(", ");
};

export const truncateText = (text, maxLength = 100) => {
    if (!text || text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
};
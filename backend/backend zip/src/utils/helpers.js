// backend/src/utils/helpers.js

// Extract IP address from request
export const getClientIP = (req) => {
    return req.ip || 
           req.connection.remoteAddress || 
           req.socket.remoteAddress ||
           (req.connection.socket ? req.connection.socket.remoteAddress : null) ||
           req.headers['x-forwarded-for']?.split(',')[0].trim() ||
           'unknown';
};

// Generate pagination info
export const generatePagination = (page, limit, total) => {
    const currentPage = parseInt(page) || 1;
    const itemsPerPage = parseInt(limit) || 10;
    const totalItems = parseInt(total) || 0;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    return {
        currentPage,
        totalPages,
        totalItems,
        itemsPerPage,
        hasNext: currentPage < totalPages,
        hasPrev: currentPage > 1,
        nextPage: currentPage < totalPages ? currentPage + 1 : null,
        prevPage: currentPage > 1 ? currentPage - 1 : null
    };
};
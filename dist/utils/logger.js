/**
 * Logger utility that only logs in development mode.
 * Completely silent in production builds and npm packages.
 *
 * This logger is designed to be tree-shakeable and completely removed
 * from production builds when not used.
 *
 * To test logger behavior:
 * - Development: Set NODE_ENV=development or run on localhost
 * - Production: Set NODE_ENV=production or deploy to production
 *
 * In npm packages, this logger will be completely silent by default.
 */
// Environment detection with multiple fallbacks
const detectEnvironment = () => {
    // Check for explicit environment variables
    if (process.env.NODE_ENV === 'development' || process.env.REACT_APP_ENV === 'development') {
        return 'development';
    }
    if (process.env.NODE_ENV === 'production' || process.env.REACT_APP_ENV === 'production') {
        return 'production';
    }
    // Check for Vite dev server
    if (process.env.VITE_DEV_SERVER_URL !== undefined) {
        return 'development';
    }
    // Check for browser environment
    if (typeof window !== 'undefined') {
        // Localhost is typically development
        if (window.location?.hostname === 'localhost' || window.location?.hostname === '127.0.0.1') {
            return 'development';
        }
        // Check for development ports
        if (window.location?.port && ['3000', '3001', '5173', '8080'].includes(window.location.port)) {
            return 'development';
        }
    }
    // Default to production for safety
    return 'production';
};
const environment = detectEnvironment();
const isDevelopment = environment === 'development';
// No-op function that gets completely removed by tree shaking
const noop = () => {
    // This function is intentionally empty and will be removed in production
};
// Development logger functions
const devLogger = {
    log: (...args) => console.log('[Airsurfer]', ...args),
    warn: (...args) => console.warn('[Airsurfer]', ...args),
    error: (...args) => console.error('[Airsurfer]', ...args),
    info: (...args) => console.info('[Airsurfer]', ...args),
    debug: (...args) => console.debug('[Airsurfer]', ...args),
    trace: (...args) => console.trace('[Airsurfer]', ...args),
};
// Production logger functions (all no-ops)
const prodLogger = {
    log: noop,
    warn: noop,
    error: noop,
    info: noop,
    debug: noop,
    trace: noop,
};
// Export the appropriate logger based on environment
export const logger = isDevelopment ? devLogger : prodLogger;
// Export environment info for debugging
export const loggerConfig = {
    environment,
    isDevelopment,
    isProduction: !isDevelopment,
};
//# sourceMappingURL=logger.js.map
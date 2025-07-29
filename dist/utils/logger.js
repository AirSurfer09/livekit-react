// Logger utility that only logs in development mode
const isDevelopment = process.env.NODE_ENV === 'development' || process.env.REACT_APP_ENV === 'development';
export const logger = {
    log: (...args) => {
        if (isDevelopment) {
            console.log(...args);
        }
    },
    warn: (...args) => {
        if (isDevelopment) {
            console.warn(...args);
        }
    },
    error: (...args) => {
        if (isDevelopment) {
            console.error(...args);
        }
    },
    info: (...args) => {
        if (isDevelopment) {
            console.info(...args);
        }
    }
};

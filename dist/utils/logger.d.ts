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
export declare const logger: {
    log: (...args: any[]) => void;
    warn: (...args: any[]) => void;
    error: (...args: any[]) => void;
    info: (...args: any[]) => void;
    debug: (...args: any[]) => void;
    trace: (...args: any[]) => void;
};
export declare const loggerConfig: {
    environment: string;
    isDevelopment: boolean;
    isProduction: boolean;
};
//# sourceMappingURL=logger.d.ts.map
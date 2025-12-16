import rateLimit from 'express-rate-limit';

// Rate limiter for Zerion API endpoints (more generous)
export const zerionRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too Many Requests',
    message: 'Too many requests to Zerion API, please try again later.',
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Rate limiter for AI endpoints (more restrictive due to cost)
export const aiRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20, // Limit each IP to 20 requests per windowMs
  message: {
    error: 'Too Many Requests',
    message: 'Too many requests to AI API, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// General rate limiter for all endpoints
export const generalRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 200, // Limit each IP to 200 requests per windowMs
  message: {
    error: 'Too Many Requests',
    message: 'Too many requests, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

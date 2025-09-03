// Common middleware for authentication, rate limiting, input validation

export async function requireAuth(context) {
  // TODO: Check for valid Discord session/token
}

export async function rateLimit(context) {
  // TODO: Enforce per-user rate limits
}

export async function validateInput(data, schema) {
  // TODO: Validate input against schema
}

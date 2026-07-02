const baseCorsHeaders = {
  'access-control-allow-headers': 'authorization, x-client-info, apikey, content-type',
  'access-control-allow-methods': 'GET, POST, OPTIONS',
  vary: 'Origin',
};

function configuredAllowedOrigins(): string {
  return Deno.env.get('BEDUINE_ALLOWED_ORIGINS') ?? '';
}

export function buildCorsHeaders(
  req: Request | undefined,
  configuredOrigins = configuredAllowedOrigins(),
): Record<string, string> {
  const headers: Record<string, string> = { ...baseCorsHeaders };
  const origin = req?.headers.get('origin');
  if (!origin) return headers;

  const allowedOrigins = new Set(
    configuredOrigins
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean),
  );

  if (allowedOrigins.has(origin)) {
    headers['access-control-allow-origin'] = origin;
  }

  return headers;
}

export class HttpError extends Error {
  status: number;
  code: string;
  details?: Record<string, unknown>;

  constructor(status: number, code: string, details?: Record<string, unknown>) {
    super(code);
    this.name = 'HttpError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export function handleCors(req: Request): Response | null {
  if (req.method !== 'OPTIONS') return null;
  const headers = buildCorsHeaders(req);
  const origin = req.headers.get('origin');
  if (origin && !headers['access-control-allow-origin']) {
    return new Response(null, { status: 403, headers });
  }
  return new Response(null, { status: 204, headers });
}

export function json(body: unknown, init: ResponseInit = {}, req?: Request): Response {
  const headers = new Headers(init.headers);
  headers.set('content-type', 'application/json');
  Object.entries(buildCorsHeaders(req)).forEach(([key, value]) => headers.set(key, value));

  return new Response(JSON.stringify(body), {
    ...init,
    headers,
  });
}

export function errorResponse(error: unknown, req?: Request): Response {
  if (error instanceof HttpError) {
    return json(
      {
        error: {
          code: error.code,
          message: error.code,
          details: error.details ?? null,
        },
      },
      { status: error.status },
      req,
    );
  }

  console.error(error);
  return json(
    {
      error: {
        code: 'INTERNAL_ERROR',
        message: 'INTERNAL_ERROR',
        details: null,
      },
    },
    { status: 500 },
    req,
  );
}

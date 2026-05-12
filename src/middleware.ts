import { defineMiddleware } from "astro:middleware";

const BASIC_AUTH_USER_KEY = "BASIC_AUTH_USER";
const BASIC_AUTH_PASSWORD_KEY = "BASIC_AUTH_PASSWORD";

function getNetlifyEnv(key: string): string | undefined {
  const netlifyGlobal = globalThis as typeof globalThis & {
    Netlify?: {
      env?: {
        get: (name: string) => string | undefined;
      };
    };
  };

  return netlifyGlobal.Netlify?.env?.get(key);
}

function normalizeCredential(value: string | undefined): string | undefined {
  return value?.trim();
}

function logIfNetlify(message: string) {
  if (typeof Netlify !== "undefined") {
    console.log(message);
  }
}

function isProtectedRequest(pathname: string): boolean {
  return ![
    "/favicon.svg",
    "/robots.txt",
    "/sitemap.xml",
  ].includes(pathname);
}

function unauthorizedResponse() {
  return new Response("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Marika Web Studio", charset="UTF-8"',
    },
  });
}

export const onRequest = defineMiddleware(async (context, next) => {
  if (!isProtectedRequest(context.url.pathname)) {
    return next();
  }

  const expectedUser = normalizeCredential(getNetlifyEnv(BASIC_AUTH_USER_KEY));
  const expectedPassword = normalizeCredential(getNetlifyEnv(BASIC_AUTH_PASSWORD_KEY));

  if (!expectedUser || !expectedPassword) {
    logIfNetlify("Basic auth is not configured for edge middleware");
    return import.meta.env.DEV ? next() : unauthorizedResponse();
  }

  const authorization = context.request.headers.get("authorization");
  if (!authorization?.startsWith("Basic ")) {
    return unauthorizedResponse();
  }

  const encodedCredentials = authorization.slice(6);
  let decodedCredentials: string;

  try {
    decodedCredentials = atob(encodedCredentials);
  } catch {
    return unauthorizedResponse();
  }

  const separatorIndex = decodedCredentials.indexOf(":");
  if (separatorIndex === -1) {
    return unauthorizedResponse();
  }

  const user = normalizeCredential(decodedCredentials.slice(0, separatorIndex));
  const password = normalizeCredential(decodedCredentials.slice(separatorIndex + 1));

  if (user !== expectedUser || password !== expectedPassword) {
    logIfNetlify("Basic auth rejected a request for protected content");
    return unauthorizedResponse();
  }

  return next();
});
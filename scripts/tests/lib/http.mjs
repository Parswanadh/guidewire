export async function requestJson(baseUrl, path, options = {}) {
  const { method = 'GET', headers = {}, body } = options;

  const requestHeaders = new Headers(headers);
  let requestBody = body;

  if (body !== undefined && body !== null && !(body instanceof FormData)) {
    if (!requestHeaders.has('Content-Type')) {
      requestHeaders.set('Content-Type', 'application/json');
    }

    if (typeof body !== 'string') {
      requestBody = JSON.stringify(body);
    }
  }

  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers: requestHeaders,
    body: requestBody,
  });

  const raw = await response.text();
  let data;

  try {
    data = raw ? JSON.parse(raw) : {};
  } catch {
    data = { raw };
  }

  return {
    ok: response.ok,
    status: response.status,
    data,
    raw,
  };
}

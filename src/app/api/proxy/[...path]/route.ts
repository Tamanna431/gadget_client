import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'https://gadget-server-sandy.vercel.app/api';

async function handler(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const apiPath = path.join('/');
  const url = new URL(`${BACKEND_URL}/${apiPath}`);

  // Forward query parameters
  req.nextUrl.searchParams.forEach((value, key) => {
    url.searchParams.set(key, value);
  });

  // Get session token from cookies (BetterAuth uses __Secure- prefix on HTTPS)
  const sessionToken =
    req.cookies.get('__Secure-better-auth.session_token')?.value ||
    req.cookies.get('better-auth.session_token')?.value;

  const headers: Record<string, string> = {
    'Content-Type': req.headers.get('Content-Type') || 'application/json',
  };

  // Forward session token as cookie header to backend
  if (sessionToken) {
    headers['Cookie'] = `better-auth.session_token=${sessionToken}`;
  }

  // Forward Authorization header if present
  const authHeader = req.headers.get('Authorization');
  if (authHeader) {
    headers['Authorization'] = authHeader;
  }

  const body = ['GET', 'HEAD'].includes(req.method) ? undefined : await req.text();

  try {
    const response = await fetch(url.toString(), {
      method: req.method,
      headers,
      body,
    });

    const data = await response.text();
    return new NextResponse(data, {
      status: response.status,
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'application/json',
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Backend proxy error: ' + error.message },
      { status: 502 }
    );
  }
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const DELETE = handler;
export const PATCH = handler;

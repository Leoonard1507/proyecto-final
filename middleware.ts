import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
console.log('Middleware ejecutado para:', pathname);

  // Rutas públicas
  const publicRoutes = ['/', '/register'];

  // Permitir acceso libre a rutas públicas
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Buscar token de sesión de next-auth
  const token =
    request.cookies.get('next-auth.session-token')?.value ||
    request.cookies.get('__Secure-next-auth.session-token')?.value;

  // Si no hay token => redirige a login
  if (!token) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/';
    return NextResponse.redirect(loginUrl);
  }

  // Si hay token, permite el acceso
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Protege todas las rutas excepto:
     * - archivos estáticos (_next, favicon, etc.)
     * - register y login
     */
    '/((?!_next/static|_next/image|favicon.ico|register|$).*)',
  ],
};

'use server'
import { cookies } from 'next/headers';

export async function handleSecureAuth(tokens: { accessToken: string,}) {
  const cookieStore = await cookies();
  

  cookieStore.set('access_token', tokens.accessToken, {
    httpOnly: true, 
    secure: true, 
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 24,
  });

  


  // cookieStore.set('refresh_token', tokens.refreshToken, {
  //   httpOnly: true,
  //   secure: true,
  //   path: '/',
  // });
}

export async function clearAuthCookies() {
  const cookieStore = await cookies();
  

  cookieStore.delete('access_token');
  

  cookieStore.set('access_token', '', { 
    path: '/', 
    expires: new Date(0),
    maxAge: -1 
  });
}
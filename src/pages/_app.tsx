import ':styles/globals.css';
import { MycoClient } from ':api/client';
import type { AppProps } from 'next/app'
import { createContext, useEffect, useState } from 'react'
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { User } from ':auth';
import { Login } from ':auth/Login';

export const ACCESS_TOKEN_SESSION_KEY = 'myti-auth';

/**
 * TODO(benglass) Figure out how to make dynamic values in a context non-option
 * Here we know for the rest of the app if they useContext(APIContext) they are guaranteed to get it
 * Because we don't mount the rest of the app until we ensure the value is set
 * But react's hook-based createContext/useContext API doesn't seem to provide a way to describe that type
 * What to do?
 * Maybe there is a way I just don't know it?
 * Default value is a proxy object with the right interface that explodes if you call any method?
 * Use the legacy context API that didn't have this problem? Or maybe it does too once you use ts?
 * Don't use context api?
 */
export const APIContext = createContext<MycoClient>(null as unknown as MycoClient);
export const UserContext = createContext<User>(null as unknown as User);

type AppState = 'sandbox' | 'verify-token' | 'no-token' | 'invalid-token' | 'booted';

export default function App({ Component, pageProps }: AppProps) {
  const [appState, setAppState] = useState<AppState>('verify-token');
  const [apiClient, setAPIClient] = useState<MycoClient>();
  const [user, setUser] = useState<User>();

  useEffect(() => {
    (async () => {
      // If the app is in sandbox mode, don't render anything
      // This is a hook for tests to be able to load the app and, for example, put a token in local storage
      // without executing any app code
      if (new URLSearchParams(window.location.search).has('__sandbox')) {
        setAppState('sandbox');
        return;
      }

      switch (appState) {
        case 'verify-token':
          const token = localStorage.getItem(ACCESS_TOKEN_SESSION_KEY);
          if (!token) {
            setAppState('no-token');
          } else {
            const api = new MycoClient({
              apiUrl: z.string().min(1).parse(process.env.NEXT_PUBLIC_API_URL),
              accessToken: token
            });
            const result = await api.getEntry();
            if (result.err) {
              localStorage.removeItem(ACCESS_TOKEN_SESSION_KEY);
              setAppState('invalid-token');
            } else {
              const payload = z.object({
                sub: z.string()
              }).parse(jwt.decode(token));
              setUser({
                userId: payload.sub
              });
              setAPIClient(api);
              setAppState('booted');
            }
          }
      }
    })();
  }, [appState]);

  switch (appState) {
    case 'sandbox':
      return null;

    case 'no-token':
    case 'invalid-token':
      return (
        <div>
          <Login
            error={appState === 'invalid-token' ? "Invalid token, please try again or ask for a fresh one, this one my be expired." : undefined}
            onLogin={async (token) => {
              localStorage.setItem(ACCESS_TOKEN_SESSION_KEY, token);
              setAppState('verify-token');
            }}
          />
        </div>
      );

    case 'booted':
      // Shouldn't really happen, but if somew
      if (!apiClient || !user) {
        return null;
      }

      return (
        <APIContext.Provider value={apiClient}>
          <UserContext.Provider value={user}>
            <Component pageProps={pageProps} />
          </UserContext.Provider>
        </APIContext.Provider>
      );
  }
}

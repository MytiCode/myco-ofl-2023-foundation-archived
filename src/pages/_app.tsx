import { MycoClient } from ':api/client';
import ':styles/globals.css'
import type { AppProps } from 'next/app'
import { ReactElement, createContext, useEffect, useState } from 'react'
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import shallNotPassImage from '../../public/shall-not-pass.png';
import Image from 'next/image';

function Login({ onLogin }: { onLogin: (token: string) => void }) {
  return (
    <form
      className="p-2 w-1/2 mx-auto"
      onSubmit={e => {
        e.preventDefault();

        const token = e.currentTarget.token.value;
        if (token) {
          onLogin(token);
        } else {
          // TODO(benglass): its required dude
          console.log('naw dude, its required');
        }
      }}
    >
      <Image src={shallNotPassImage} alt="YOU SHALL NOT PASS" className="mb-4" />
      <label className="text-2xl font-bold">
        YOU SHALL NOT PASS!<br />
        <textarea placeholder="What is your token?" name="token" className="border-slate-500 border-2 w-full p-4"></textarea>
      </label>
      <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded">Login</button>
    </form>
  );
}

const ACCESS_TOKEN_SESSION_KEY = 'myti-auth';

type User = { userId: string };
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

function App({ children }: { children: ReactElement}) {
  const [appState, setAppState] = useState<'verify-token' | 'no-token' | 'booted'>('verify-token');
  const [apiClient, setAPIClient] = useState<MycoClient>();
  const [user, setUser] = useState<User>();

  useEffect(() => {
    (async () => {
      switch (appState) {
        case 'verify-token':
          const token = localStorage.getItem(ACCESS_TOKEN_SESSION_KEY);
          if (!token) {
            setAppState('no-token');
          } else {
            const api = new MycoClient({
              apiUrl: 'http://localhost:8080',
              accessToken: token
            });
            const result = await api.getEntry();
            if (result.err) {
              localStorage.removeItem(ACCESS_TOKEN_SESSION_KEY);
              window.location.reload();
            } else {
              console.log(jwt.decode(token));
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

  if (appState === 'no-token') {
    return (
      <Login
        onLogin={async (token) => {
          localStorage.setItem(ACCESS_TOKEN_SESSION_KEY, token);
          setAppState('verify-token');
        }}
      />
    );
  }

  if (appState === 'booted' && apiClient && user) {
    return (
      <APIContext.Provider value={apiClient}>
        <UserContext.Provider value={user}>
          {children}
        </UserContext.Provider>
      </APIContext.Provider>
    );
  }

  return null;
}

export default function AnonymousApp({ Component, pageProps }: AppProps) {
  // const [loginState, setLoginState] = useState<'idle' | 'logged-in'>('idle');

  // if (loginState === 'idle') {
  //   return (
  //     <Login
  //       onLogin={async (token) => {
  //         localStorage.setItem(ACCESS_TOKEN_SESSION_KEY, token);
  //         setLoginState('logged-in');
  //       }}
  //     />
  //   );
  // }

  return (
    <App>
      <Component pageProps={pageProps} />
    </App>
  );
}

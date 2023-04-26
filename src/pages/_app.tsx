import { MycoClient } from ':api/client';
import ':styles/globals.css'
import type { AppProps } from 'next/app'
import { ReactElement, createContext, useEffect, useState } from 'react'

function Login({ onLogin }: { onLogin: (token: string) => void }) {
  return (
    <form
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
      <label>
        WHO GOES THERE!<br />
        <textarea name="token"></textarea>
      </label>
      <button type="submit">Login</button>
    </form>
  );
}

const ACCESS_TOKEN_SESSION_KEY = 'myti-auth';

export const APIContext = createContext<MycoClient | undefined>(undefined);

function App({ children }: { children: ReactElement}) {
  const [appState, setAppState] = useState<'verify-token' | 'no-token' | 'booted'>('verify-token');
  const [apiClient, setAPIClient] = useState<MycoClient>();

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

  if (appState === 'booted') {
    return (
      <APIContext.Provider value={apiClient}>
        {children}
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

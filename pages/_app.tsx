import "../styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { PrivyProvider } from "@privy-io/react-auth";
import { chiliz, spicy } from "viem/chains";
import { Toaster } from "react-hot-toast";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link
          rel="preload"
          href="/fonts/AdelleSans-Regular.woff"
          as="font"
          crossOrigin=""
        />
        <link
          rel="preload"
          href="/fonts/AdelleSans-Regular.woff2"
          as="font"
          crossOrigin=""
        />
        <link
          rel="preload"
          href="/fonts/AdelleSans-Semibold.woff"
          as="font"
          crossOrigin=""
        />
        <link
          rel="preload"
          href="/fonts/AdelleSans-Semibold.woff2"
          as="font"
          crossOrigin=""
        />

        <link rel="icon" href="/favicons/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicons/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/favicons/apple-touch-icon.png" />
        <link rel="manifest" href="/favicons/manifest.json" />

        <title>Tricolor Pass · SPFC</title>
        <meta name="description" content="Viva o SPFC todos os dias. Ganhe XP e desbloqueie benefícios de verdade." />
      </Head>
      <PrivyProvider
        appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ""}
        config={{
          embeddedWallets: {
            createOnLogin: "all-users",
          },
          supportedChains: [spicy],
          defaultChain: spicy,
        }}
      >
        <Component {...pageProps} />
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: 'rgba(255, 255, 255, 0.95)',
              color: '#374151',
              border: '1px solid #E5E7EB',
              borderRadius: '12px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
              backdropFilter: 'blur(8px)',
            },
            success: {
              style: {
                border: '1px solid #C10016',
              },
              iconTheme: {
                primary: '#C10016',
                secondary: '#fff',
              },
            },
            error: {
              style: {
                border: '1px solid #EF4444',
              },
              iconTheme: {
                primary: '#EF4444',
                secondary: '#fff',
              },
            },
            loading: {
              style: {
                border: '1px solid #6B7280',
              },
            },
          }}
        />
      </PrivyProvider>
    </>
  );
}

export default MyApp;

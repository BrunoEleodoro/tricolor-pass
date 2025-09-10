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
              background: '#1A1D23',
              color: '#fff',
              border: '1px solid #C10016',
            },
            success: {
              iconTheme: {
                primary: '#C10016',
                secondary: '#fff',
              },
            },
          }}
        />
      </PrivyProvider>
    </>
  );
}

export default MyApp;

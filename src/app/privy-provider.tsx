'use client';

import {PrivyProvider} from '@privy-io/react-auth';
import { GlobalProvider } from '@/contexts/global-context';

export default function Providers({children}: {children: React.ReactNode}) {
  return (
    <GlobalProvider>
      <PrivyProvider
        appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
        config={{
          // Customize Privy's appearance in your app
          appearance: {
            theme: 'light',
            accentColor: '#676FFF',
            logo: 'https://your-logo-url',
          },
          // Create embedded wallets for users who don't have a wallet
          embeddedWallets: {
            createOnLogin: 'users-without-wallets',
          },
        }}
      >
        {children}
      </PrivyProvider>
    </GlobalProvider>
  );
} 
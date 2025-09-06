'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { wagmiConfig } from '../config';
import { MiniKitProvider } from '@coinbase/onchainkit/minikit';

const queryClient = new QueryClient();

const options = {
  appName: 'Adopt-a-Cow',
  appLogoUrl: 'https://we-love-holsteins.com/wp-content/uploads/2022/01/We-love-holsteins-logo-2022.png',
  walletConfig: {
    enableExplorer: true,
    enableSIWE: true,
  },
};

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <MiniKitProvider options={options}>{children}</MiniKitProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
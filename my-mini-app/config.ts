'use client';

import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';

export const wagmiConfig = getDefaultConfig({
  appName: 'Adopt-a-Cow',
  projectId: '549ae3eccd30f65a8cf885575f927c2c', // Get a free one at cloud.walletconnect.com
  chains: [baseSepolia],
  transports: {
    [baseSepolia.id]: http(),
  },
});
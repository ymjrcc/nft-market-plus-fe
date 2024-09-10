import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from 'wagmi';
import {
  arbitrum,
  base,
  mainnet,
  optimism,
  polygon,
  sepolia,
  anvil,
} from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'RainbowKit demo',
  projectId: '48d2dc02a08917fabc83d6e7175b9442',
  chains: [
    mainnet,
    polygon,
    optimism,
    arbitrum,
    base,
    // ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [sepolia] : []),
    sepolia,
    anvil,
  ],
  transports: {
    [mainnet.id]: http('https://mainnet.infura.io/v3/32076fdc1eec4d01975b561943bd7e8d'),
    [sepolia.id]: http('https://sepolia.infura.io/v3/32076fdc1eec4d01975b561943bd7e8d'),
    [anvil.id]: http(),
  },
  ssr: true,
});

// Copyright (c), Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0
import { getFullnodeUrl } from '@mysten/sui/client';
import { createNetworkConfig } from '@mysten/dapp-kit';

const { networkConfig, useNetworkVariable, useNetworkVariables } = createNetworkConfig({
  testnet: {
    url: getFullnodeUrl('testnet'),
    variables: {
      gqlClient: 'https://sui-testnet.mystenlabs.com/graphql',
    },
  },
  devnet:{
    url: getFullnodeUrl('devnet'),
    variables: {
      gqlClient: 'https://sui-devnet.mystenlabs.com/graphql',
    },
  },
  mainnet:{
    url: getFullnodeUrl('mainnet'),
    variables: {
      gqlClient: 'https://sui.mystenlabs.com/graphql',
    },
  }
});

export { useNetworkVariable, useNetworkVariables, networkConfig };

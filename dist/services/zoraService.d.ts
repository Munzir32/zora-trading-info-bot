import { ethers } from 'ethers';
export declare const createZoraService: (provider: ethers.JsonRpcProvider, apiKey: string) => {
    getTokenPrice: (tokenId: string, contractAddress: string) => Promise<number>;
    getTokenMarketData: (tokenId: string, contractAddress: string) => Promise<any>;
    getTokenHistory: (tokenId: string, contractAddress: string) => Promise<any>;
    getTokenMetadata: (tokenId: string, contractAddress: string) => Promise<any>;
    generateTradingAnalysis: (tokenId: string, contractAddress: string) => Promise<any>;
};

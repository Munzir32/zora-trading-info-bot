export declare const createAIService: (apiKey: string) => {
    analyzeMarketData: (coin: string, marketData: any) => Promise<string>;
    generateTradingSignals: (coin: string, historicalData: any) => Promise<string>;
    analyzePortfolio: (portfolio: any) => Promise<string>;
};

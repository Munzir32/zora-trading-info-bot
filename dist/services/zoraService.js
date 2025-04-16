import { getToken } from '@zoralabs/protocol-sdk';
import { getCoin } from '@zoralabs/coins-sdk';
import { mainnet, base } from 'viem/chains';
import { createPublicClient, http } from 'viem';
export const createZoraService = (provider, apiKey) => {
    const publicClient = createPublicClient({
        chain: mainnet,
        transport: http()
    });
    return {
        getTokenPrice: async (tokenId, contractAddress) => {
            try {
                const result = await getToken({
                    tokenContract: contractAddress,
                    mintType: "1155",
                    tokenId: BigInt(tokenId),
                    publicClient
                });
                if (!result || !result.token) {
                    throw new Error('Token data not found');
                }
                // Get price from the token's configuration
                const tokenData = result.token;
                const price = tokenData.price || 0;
                return Number(price);
            }
            catch (error) {
                console.error('Error fetching token price:', error);
                throw error;
            }
        },
        getTokenMarketData: async (tokenId, contractAddress) => {
            try {
                const result = await getToken({
                    tokenContract: contractAddress,
                    mintType: "1155",
                    tokenId: BigInt(tokenId),
                    publicClient
                });
                if (!result || !result.token) {
                    throw new Error('Token data not found');
                }
                // Convert BigInt values to strings
                const tokenData = result.token;
                const convertedData = Object.entries(tokenData).reduce((acc, [key, value]) => {
                    acc[key] = typeof value === 'bigint' ? value.toString() : value;
                    return acc;
                }, {});
                return {
                    ...convertedData,
                    primaryMintActive: result.primaryMintActive,
                    primaryMintEnd: result.primaryMintEnd?.toString(),
                    secondaryMarketActive: result.secondaryMarketActive
                };
            }
            catch (error) {
                console.error('Error fetching market data:', error);
                throw error;
            }
        },
        getTokenHistory: async (tokenId, contractAddress) => {
            try {
                const result = await getToken({
                    tokenContract: contractAddress,
                    mintType: "1155",
                    tokenId: BigInt(tokenId),
                    publicClient
                });
                if (!result || !result.token) {
                    throw new Error('Token data not found');
                }
                // Convert BigInt values to strings
                const tokenData = result.token;
                const convertedData = Object.entries(tokenData).reduce((acc, [key, value]) => {
                    acc[key] = typeof value === 'bigint' ? value.toString() : value;
                    return acc;
                }, {});
                return {
                    ...convertedData,
                    primaryMintActive: result.primaryMintActive,
                    primaryMintEnd: result.primaryMintEnd?.toString(),
                    secondaryMarketActive: result.secondaryMarketActive
                };
            }
            catch (error) {
                console.error('Error fetching token history:', error);
                throw error;
            }
        },
        getTokenMetadata: async (tokenId, contractAddress) => {
            try {
                const result = await getToken({
                    tokenContract: contractAddress,
                    mintType: "1155",
                    tokenId: BigInt(tokenId),
                    publicClient
                });
                if (!result || !result.token) {
                    throw new Error('Token data not found');
                }
                // Convert BigInt values to strings
                const tokenData = result.token;
                const convertedData = Object.entries(tokenData).reduce((acc, [key, value]) => {
                    acc[key] = typeof value === 'bigint' ? value.toString() : value;
                    return acc;
                }, {});
                return {
                    ...convertedData,
                    primaryMintActive: result.primaryMintActive,
                    primaryMintEnd: result.primaryMintEnd?.toString(),
                    secondaryMarketActive: result.secondaryMarketActive
                };
            }
            catch (error) {
                console.error('Error fetching token metadata:', error);
                throw error;
            }
        },
        generateTradingAnalysis: async (tokenId, contractAddress) => {
            try {
                // Get market data first
                const marketData = await getToken({
                    tokenContract: contractAddress,
                    mintType: "1155",
                    tokenId: BigInt(tokenId),
                    publicClient
                });
                if (!marketData || !marketData.token) {
                    throw new Error('Token data not found');
                }
                // Convert BigInt values to strings
                const tokenData = marketData.token;
                const convertedData = Object.entries(tokenData).reduce((acc, [key, value]) => {
                    acc[key] = typeof value === 'bigint' ? value.toString() : value;
                    return acc;
                }, {});
                // Generate trading analysis
                const analysis = {
                    marketStatus: {
                        primaryMintActive: marketData.primaryMintActive,
                        primaryMintEnd: marketData.primaryMintEnd?.toString(),
                        secondaryMarketActive: marketData.secondaryMarketActive
                    },
                    priceAnalysis: {
                        currentPrice: convertedData.price || 0,
                        priceTrend: convertedData.priceTrend || 'neutral',
                        priceVolatility: convertedData.priceVolatility || 'medium'
                    },
                    tradingSignals: {
                        entryPoints: generateEntryPoints(convertedData),
                        exitPoints: generateExitPoints(convertedData),
                        stopLoss: calculateStopLoss(convertedData),
                        takeProfit: calculateTakeProfit(convertedData)
                    },
                    riskAssessment: {
                        riskLevel: assessRiskLevel(convertedData),
                        marketLiquidity: assessLiquidity(convertedData),
                        volatilityRisk: assessVolatilityRisk(convertedData)
                    },
                    recommendations: generateRecommendations(convertedData, marketData)
                };
                return analysis;
            }
            catch (error) {
                console.error('Error generating trading analysis:', error);
                throw error;
            }
        },
        getCoinPrice: async (contractAddress) => {
            try {
                // Validate contract address
                if (!contractAddress.startsWith('0x') || contractAddress.length !== 42) {
                    throw new Error('Invalid contract address. Please provide a valid Ethereum address.');
                }
                const result = await getCoin({
                    address: contractAddress,
                    chain: base.id // Use Base chain
                });
                if (!result.data?.zora20Token) {
                    console.error('Coin data not found for contract:', contractAddress);
                    throw new Error('Coin data not found. Please ensure the contract is supported on the Base chain.');
                }
                const coin = result.data.zora20Token;
                // Return all details about the coin
                return {
                    name: coin.name || 'N/A',
                    symbol: coin.symbol || 'N/A',
                    description: coin.description || 'N/A',
                    totalSupply: coin.totalSupply || 'N/A',
                    marketCap: coin.marketCap || 'N/A',
                    volume24h: coin.volume24h || 'N/A',
                    creatorAddress: coin.creatorAddress || 'N/A',
                    createdAt: coin.createdAt || 'N/A',
                    uniqueHolders: coin.uniqueHolders || 0,
                    totalVolume: Number(coin.totalVolume) || 0,
                };
            }
            catch (error) {
                console.error('Error fetching coin price for contract:', contractAddress, error);
                throw error;
            }
        },
        getCoinMarketData: async (contractAddress) => {
            try {
                const result = await getCoin({
                    address: contractAddress,
                    chain: mainnet.id
                });
                if (!result.data?.zora20Token) {
                    throw new Error('Coin data not found');
                }
                const tokenData = result.data.zora20Token;
                return {
                    ...tokenData,
                    totalSupply: tokenData.totalSupply,
                    volume24h: tokenData.volume24h,
                    totalVolume: tokenData.totalVolume
                };
            }
            catch (error) {
                console.error('Error fetching coin market data:', error);
                throw error;
            }
        },
        generateCoinAnalysis: async (contractAddress) => {
            try {
                const result = await getCoin({
                    address: contractAddress,
                    chain: mainnet.id
                });
                if (!result.data?.zora20Token) {
                    throw new Error('Coin data not found');
                }
                const tokenData = result.data.zora20Token;
                return {
                    marketStatus: {
                        totalSupply: tokenData.totalSupply,
                        volume24h: tokenData.volume24h,
                        totalVolume: tokenData.totalVolume
                    },
                    priceAnalysis: {
                        currentPrice: Number(tokenData.totalVolume) || 0,
                        volume24h: Number(tokenData.volume24h) || 0,
                        totalVolume: Number(tokenData.totalVolume) || 0
                    },
                    tradingSignals: {
                        entryPoints: generateCoinEntryPoints(tokenData),
                        exitPoints: generateCoinExitPoints(tokenData),
                        stopLoss: calculateCoinStopLoss(tokenData),
                        takeProfit: calculateCoinTakeProfit(tokenData)
                    },
                    riskAssessment: {
                        riskLevel: assessCoinRiskLevel(tokenData),
                        liquidity: assessCoinLiquidity(tokenData),
                        volatility: assessCoinVolatility(tokenData)
                    },
                    recommendations: generateCoinRecommendations(tokenData)
                };
            }
            catch (error) {
                console.error('Error generating coin analysis:', error);
                throw error;
            }
        }
    };
};
// Helper functions for trading analysis
function generateEntryPoints(data) {
    const entryPoints = [];
    const currentPrice = Number(data.price || 0);
    if (currentPrice > 0) {
        entryPoints.push(`Strong entry point at ${currentPrice}`);
        entryPoints.push(`Conservative entry at ${currentPrice * 0.95}`);
        entryPoints.push(`Aggressive entry at ${currentPrice * 1.05}`);
    }
    return entryPoints;
}
function generateExitPoints(data) {
    const exitPoints = [];
    const currentPrice = Number(data.price || 0);
    if (currentPrice > 0) {
        exitPoints.push(`Take profit at ${currentPrice * 1.1}`);
        exitPoints.push(`Partial exit at ${currentPrice * 1.05}`);
        exitPoints.push(`Trailing stop at ${currentPrice * 0.95}`);
    }
    return exitPoints;
}
function calculateStopLoss(data) {
    const currentPrice = Number(data.price || 0);
    return currentPrice > 0 ? `Stop loss at ${currentPrice * 0.9}` : 'Not available';
}
function calculateTakeProfit(data) {
    const currentPrice = Number(data.price || 0);
    return currentPrice > 0 ? `Take profit at ${currentPrice * 1.2}` : 'Not available';
}
function assessRiskLevel(data) {
    const volatility = data.priceVolatility || 'medium';
    const liquidity = data.liquidity || 'medium';
    if (volatility === 'high' && liquidity === 'low')
        return 'High Risk';
    if (volatility === 'high' && liquidity === 'medium')
        return 'Medium-High Risk';
    if (volatility === 'medium' && liquidity === 'medium')
        return 'Medium Risk';
    if (volatility === 'low' && liquidity === 'high')
        return 'Low Risk';
    return 'Medium Risk';
}
function assessLiquidity(data) {
    const liquidity = data.liquidity || 'medium';
    return `Market liquidity is ${liquidity}`;
}
function assessVolatilityRisk(data) {
    const volatility = data.priceVolatility || 'medium';
    return `Price volatility is ${volatility}`;
}
function generateRecommendations(data, marketData) {
    const recommendations = [];
    // Primary mint recommendations
    if (marketData.primaryMintActive) {
        recommendations.push('Primary mint is active - Consider participating in the initial sale');
    }
    // Secondary market recommendations
    if (marketData.secondaryMarketActive) {
        recommendations.push('Secondary market is active - Monitor for trading opportunities');
    }
    // Price-based recommendations
    const currentPrice = Number(data.price || 0);
    if (currentPrice > 0) {
        if (currentPrice < Number(data.averagePrice || 0)) {
            recommendations.push('Current price is below average - Potential buying opportunity');
        }
        else if (currentPrice > Number(data.averagePrice || 0)) {
            recommendations.push('Current price is above average - Consider taking profits');
        }
    }
    // Risk management recommendations
    recommendations.push('Always use stop-loss orders to manage risk');
    recommendations.push('Consider position sizing based on your risk tolerance');
    return recommendations;
}
// Helper functions for coin analysis
function generateCoinEntryPoints(data) {
    const entryPoints = [];
    const currentPrice = Number(data.price || 0);
    if (currentPrice > 0) {
        entryPoints.push(`Strong entry point at ${currentPrice}`);
        entryPoints.push(`Conservative entry at ${currentPrice * 0.95}`);
        entryPoints.push(`Aggressive entry at ${currentPrice * 1.05}`);
    }
    return entryPoints;
}
function generateCoinExitPoints(data) {
    const exitPoints = [];
    const currentPrice = Number(data.price || 0);
    if (currentPrice > 0) {
        exitPoints.push(`Take profit at ${currentPrice * 1.1}`);
        exitPoints.push(`Partial exit at ${currentPrice * 1.05}`);
        exitPoints.push(`Trailing stop at ${currentPrice * 0.95}`);
    }
    return exitPoints;
}
function calculateCoinStopLoss(data) {
    const currentPrice = Number(data.price || 0);
    return currentPrice > 0 ? `Stop loss at ${currentPrice * 0.9}` : 'Not available';
}
function calculateCoinTakeProfit(data) {
    const currentPrice = Number(data.price || 0);
    return currentPrice > 0 ? `Take profit at ${currentPrice * 1.2}` : 'Not available';
}
function assessCoinRiskLevel(data) {
    const volatility = data.priceVolatility || 'medium';
    const liquidity = data.liquidity || 'medium';
    if (volatility === 'high' && liquidity === 'low')
        return 'High Risk';
    if (volatility === 'high' && liquidity === 'medium')
        return 'Medium-High Risk';
    if (volatility === 'medium' && liquidity === 'medium')
        return 'Medium Risk';
    if (volatility === 'low' && liquidity === 'high')
        return 'Low Risk';
    return 'Medium Risk';
}
function assessCoinLiquidity(data) {
    const liquidity = data.liquidity || 'medium';
    return `Market liquidity is ${liquidity}`;
}
function assessCoinVolatility(data) {
    const volatility = data.priceVolatility || 'medium';
    return `Price volatility is ${volatility}`;
}
function generateCoinRecommendations(data) {
    const recommendations = [];
    // Price-based recommendations
    const currentPrice = Number(data.totalVolume) || 0;
    if (currentPrice > 0) {
        if (currentPrice < Number(data.averagePrice || 0)) {
            recommendations.push('Current price is below average - Potential buying opportunity');
        }
        else if (currentPrice > Number(data.averagePrice || 0)) {
            recommendations.push('Current price is above average - Consider taking profits');
        }
    }
    // Risk management recommendations
    recommendations.push('Always use stop-loss orders to manage risk');
    recommendations.push('Consider position sizing based on your risk tolerance');
    return recommendations;
}

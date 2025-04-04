import OpenAI from 'openai';

export const createAIService = (apiKey: string) => {
    const openai = new OpenAI({
        apiKey,
    });

    return {
        analyzeMarketData: async (coin: string, marketData: any): Promise<string> => {
            try {
                const prompt = `Analyze the following market data for ${coin}: ${JSON.stringify(marketData)}
                Provide a concise analysis including:
                1. Current market sentiment
                2. Key price levels
                3. Potential trading opportunities
                4. Risk factors
                Keep the analysis clear and actionable.`;

                const completion = await openai.chat.completions.create({
                    model: "gpt-3.5-turbo",
                    messages: [{ role: "user", content: prompt }],
                    max_tokens: 300,
                    temperature: 0.7,
                });

                return completion.choices[0].message.content || 'Analysis not available';
            } catch (error) {
                console.error('Error generating market analysis:', error);
                throw error;
            }
        },

        generateTradingSignals: async (coin: string, historicalData: any): Promise<string> => {
            try {
                const prompt = `Based on the following historical data for ${coin}: ${JSON.stringify(historicalData)}
                Generate trading signals including:
                1. Entry points
                2. Exit points
                3. Stop loss levels
                4. Risk management suggestions
                Keep the signals clear and specific.`;

                const completion = await openai.chat.completions.create({
                    model: "gpt-3.5-turbo",
                    messages: [{ role: "user", content: prompt }],
                    max_tokens: 300,
                    temperature: 0.7,
                });

                return completion.choices[0].message.content || 'Trading signals not available';
            } catch (error) {
                console.error('Error generating trading signals:', error);
                throw error;
            }
        },

        analyzePortfolio: async (portfolio: any): Promise<string> => {
            try {
                const prompt = `Analyze the following portfolio: ${JSON.stringify(portfolio)}
                Provide insights including:
                1. Portfolio diversification
                2. Risk assessment
                3. Performance analysis
                4. Optimization suggestions
                Keep the analysis practical and actionable.`;

                const completion = await openai.chat.completions.create({
                    model: "gpt-3.5-turbo",
                    messages: [{ role: "user", content: prompt }],
                    max_tokens: 300,
                    temperature: 0.7,
                });

                return completion.choices[0].message.content || 'Portfolio analysis not available';
            } catch (error) {
                console.error('Error analyzing portfolio:', error);
                throw error;
            }
        }
    };
}; 
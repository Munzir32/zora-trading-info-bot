export const userAlerts = new Map();
export const addAlert = (chatId, contract, price) => {
    if (!userAlerts.has(chatId)) {
        userAlerts.set(chatId, []);
    }
    userAlerts.get(chatId).push({ contract, price });
};
export const getAlerts = (chatId) => {
    return userAlerts.get(chatId) || [];
};
export const removeAlert = (chatId, contract) => {
    const alerts = userAlerts.get(chatId);
    if (alerts) {
        userAlerts.set(chatId, alerts.filter((alert) => alert.contract !== contract));
    }
};

export const userAlerts = new Map<number, { contract: string; price: number }[]>();

export const addAlert = (chatId: number, contract: string, price: number) => {
  if (!userAlerts.has(chatId)) {
    userAlerts.set(chatId, []);
  }
  userAlerts.get(chatId)!.push({ contract, price });
};

export const getAlerts = (chatId: number) => {
  return userAlerts.get(chatId) || [];
};

export const removeAlert = (chatId: number, contract: string) => {
  const alerts = userAlerts.get(chatId);
  if (alerts) {
    userAlerts.set(
      chatId,
      alerts.filter((alert) => alert.contract !== contract)
    );
  }
};
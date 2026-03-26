const IP = process.env.EXPO_PUBLIC_IP_ADDRESS;
const PORT = "3000";
export const IP_ADDRESS = IP ? `${IP}:${PORT}` : null;


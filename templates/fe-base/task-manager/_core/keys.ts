export const APP_KEYS = {
  TOKEN: "TOKEN",
};

export type AppKey = (typeof APP_KEYS)[keyof typeof APP_KEYS];

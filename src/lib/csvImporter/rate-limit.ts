interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};
const WINDOW_SIZE = 10 * 1000; // 10 seconds
const MAX_REQUESTS = 10;

export const ratelimit = {
  limit: async (key: string) => {
    const now = Date.now();
    const userLimit = store[key];

    if (!userLimit || now > userLimit.resetTime) {
      store[key] = {
        count: 1,
        resetTime: now + WINDOW_SIZE
      };
      return { success: true };
    }

    if (userLimit.count >= MAX_REQUESTS) {
      return { success: false };
    }

    userLimit.count++;
    return { success: true };
  }
};

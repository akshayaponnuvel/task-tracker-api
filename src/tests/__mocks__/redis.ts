const redisMock = require("redis-mock");
const client = redisMock.createClient();

export default {
  get: (key: string) =>
    new Promise((resolve) =>
      client.get(key, (_: any, val: any) => resolve(val))
    ),

  set: (key: string, value: string) =>
    new Promise((resolve) =>
      client.set(key, value, () => resolve("OK"))
    ),

  del: (key: string) =>
    new Promise((resolve) =>
      client.del(key, () => resolve(1))
    ),
};

export function randomString(length: number) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const str = [...Array(length)].map(() => chars[Math.floor(Math.random() * chars.length)]).join('');

  return str;
}
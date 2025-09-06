export function getRandomProducts(): number {
  return Math.floor(Math.random() * 500) + 1;
}

export function generateActivationCode(): string {
  return Math.random().toString(36).substring(2, 15).toUpperCase();
}
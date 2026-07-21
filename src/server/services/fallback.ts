export async function runWithFallback<T>(primary: () => Promise<T>, fallback: () => Promise<T> | T) {
  try {
    return await primary();
  } catch {
    return await fallback();
  }
}

export function Logger(
  method: string,
  url: string,
  status: number,
  ms: number,
) {
  const isSuccess = status >= 400 ? "❌" : "✅";
  console.log(`${isSuccess} [${method}] ${url} -> ${status} (${ms}ms)`);
}

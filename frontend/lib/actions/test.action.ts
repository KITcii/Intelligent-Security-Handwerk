// nextIteration: delete all references to this function
export async function delayLoad(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

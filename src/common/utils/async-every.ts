export async function every<T>(array: Array<T>, callback?: (e: T) => boolean) {
  for (const element of array) {
    const result = callback ? await callback(element) : element;
    if (!result) {
      return false;
    }
  }
  return true;
}

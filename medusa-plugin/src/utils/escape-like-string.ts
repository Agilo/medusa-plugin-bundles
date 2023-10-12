/**
 * @see https://github.com/typeorm/typeorm/issues/5012#issuecomment-843969810
 */
export const escapeLikeString = (raw: string): string => {
  return raw.replace(/[\\%_]/g, "\\$&");
};

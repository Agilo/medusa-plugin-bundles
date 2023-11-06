import { isArray, isObject } from "lodash";

/**
 * Recursively strip object properties, useful for timestamps, IDs, nested IDs, etc.
 */
export function recursiveStripProps(
  data: any,
  props: string[],
  path: string[] = ["data"]
) {
  // console.log(path.join("."));
  if (isArray(data)) {
    data.map((value) => recursiveStripProps(value, props, path));
  } else if (isObject(data)) {
    Object.entries(data).map(([key, value]) => {
      if (props.includes([...path, key].join("."))) {
        // console.log(`stripping ${[...path, key].join(".")}`);
        // @ts-ignore
        delete data[key];
      } else {
        recursiveStripProps(value, props, [...path, key]);
      }
    });
  } else {
    // noop
  }
}

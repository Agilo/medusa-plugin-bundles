import { isArray, isObject } from "lodash";

export function recursiveStripTimestamps(data: any) {
  if (isArray(data)) {
    data.map((value) => recursiveStripTimestamps(value));
  } else if (isObject(data)) {
    if ("created_at" in data) {
      delete data["created_at"];
    }
    if ("updated_at" in data) {
      delete data["updated_at"];
    }
    Object.entries(data).map((value) => recursiveStripTimestamps(value));
  } else {
    // noop
  }
}

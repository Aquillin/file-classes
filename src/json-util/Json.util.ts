import { JsonObject } from "../JsonFile";
import InvalidPropertyPathError from "./InvalidPropertyPath.error";

/**
 * Access a property using a callback function.
 *
 * @param object - The object to search for the target property in.
 * @param callback - Function that gets the second to last property JSON object + the key to the target property.
 * @returns False if the property doesn't exist on object, otherwise returns the result of your callback.
 */
export async function accessProperty(
    object: JsonObject,
    keys: string[],
    callback: (curr: JsonObject, key: string) => any
) {
    let curr: JsonObject = object;
    for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        if (curr.hasOwnProperty(key)) {
            curr = curr[key];
        } else {
            throw new InvalidPropertyPathError();
        }
    }

    return await callback(curr, keys[keys.length - 1]);
}

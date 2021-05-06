import { JsonObject } from '../JsonFile';
import InvalidPropertyPathError from '../json-util/InvalidPropertyPath.error';
import { accessProperty } from '../json-util/Json.util';

export default class PropertyPath {
    constructor(private readonly keys: string[]) {}

    static create(...keys: string[]) {
        return new PropertyPath(keys);
    }

    /**
     * Resolves a property path using a provided object.
     *
     * @param object - The object to resolve this property path on.
     * @returns The value of the object at this property path.
     */
    resolve(object: JsonObject): any {
        let curr: JsonObject = object;
        for (let i = 0; i < this.keys.length; i++) {
            const key = this.keys[i];
            if (curr.hasOwnProperty(key)) {
                curr = curr[key];
            } else {
                return undefined;
            }
        }
        return curr;
    }

    /**
     * TODO Since I'm tired right now...
     * TODO When you have time use the accessProperty method to make code DRY
     * 
     * Sets the data at a target property path on `object` to `newValue`
     * Only updates an existing value, otherwise returns false.
     *
     * @param object - The object to update the value of.
     * @param newValue - The new value that should be set on the object at this property path
     * @returns True if the operation was successful, false otherwise.
     */
    updateValueOn(object: JsonObject, newValue: any): boolean {
        if (
            !this.hasConflictingProperties(object) &&
            this.leafDefined(object)
        ) {
            let curr: JsonObject = object;
            for (let i = 0; i < this.keys.length - 1; i++) {
                const key = this.keys[i];
                curr = curr[key];
            }

            let val = curr[this.getFinalKey()];
            if (!PropertyPath.isJson(val)) {
                curr[this.getFinalKey()] = newValue;
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    /**
     * TODO Since I'm tired right now...
     * TODO When you have time use the accessProperty method to make code DRY
     * 
     * Sets the data at a target property path on `object` to `newValue`
     * Will create new objects on the property path.
     * Will override an object that is at the target property.
     * Returns false if a primitive value exists on the property path that is not housed at the target property.
     *
     * @param object - The object to  update.
     * @param newValue - The value to update the object at this property path to.
     * @returns True if the operation was successful, false otherwise.
     */
    setValueOn(object: JsonObject, newValue: any): boolean {
        if (!this.hasConflictingProperties(object)) {
            let curr: JsonObject = object;
            for (let i = 0; i < this.keys.length - 1; i++) {
                const key = this.keys[i];
                if (!curr.hasOwnProperty(key)) {
                    curr[key] = {};
                }

                curr = curr[key];
            }

            curr[this.getFinalKey()] = newValue;
            return true;
        } else {
            return false;
        }
    }

    async removeValueFrom(object: JsonObject): Promise<boolean> {
        let result = await accessProperty(object, this.keys, (curr, key) => {
            delete curr[key];
            return true;
        })
        return result as boolean;
    }

    /**
     * Returns whether or not a JSON "leaf" is defined on the tree structure within this property path.
     * "leaf" refer to any non-JSON value. (functions are not JSON)
     * @param object - The object to check
     * @returns True if there is no leaf defined on this path, false otherwise.
     */
    private leafDefined(object: JsonObject): boolean {
        let curr: JsonObject = object;
        for (let i = 0; i < this.keys.length - 1; i++) {
            const key = this.keys[i];

            if (curr.hasOwnProperty(key)) {
                let val = curr[key];
                if (PropertyPath.isJson(val)) {
                    curr = val;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        }

        return curr.hasOwnProperty(this.getFinalKey());
    }

    /**
     * Checks to see if there are any "leaves" in the middle of this property path.
     * "leaves" refer to any non-JSON value. (functions are not JSON)
     *
     * @param object - The object to check this property path on.
     * @returns True if there are no leafs before the final part of this property path, false otherwise.
     */
    private hasConflictingProperties(object: JsonObject): boolean {
        let curr: JsonObject = object;
        for (let i = 0; i < this.keys.length - 1; i++) {
            const key = this.keys[i];

            if (curr.hasOwnProperty(key)) {
                let val = curr[key];
                if (PropertyPath.isJson(val)) {
                    curr = val;
                } else {
                    return true;
                }
            } else {
                return false;
            }
        }

        return false;
    }

    private getFinalKey() {
        return this.keys[this.keys.length - 1];
    }

    private static isJson(object: JsonObject): boolean {
        return (
            typeof object === 'object' &&
            typeof object !== 'function' &&
            object !== null
        );
    }
}

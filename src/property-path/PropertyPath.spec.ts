import _ from 'lodash';
import PropertyPath from './PropertyPath';

describe('PropertyPath class', () => {
    const EXISTS_STRING = 'THE VALUE EXISTS';

    it('Properly parses a string with brackets', () => {
        const DUMMY_KEYS = ['test', 'test.15'];
        const path = PropertyPath.create(...DUMMY_KEYS);
        expect(path['keys']).toEqual(DUMMY_KEYS);
    });

    it('Resolves to undefined if the path provided is an invalid path on the object.', () => {
        const value = PropertyPath.create('test.test').resolve({});
        expect(value).toBe(undefined);
    });

    it('Resolves to the value of the Object at the provided path if a value exists at the path on the object.', () => {
        const value = PropertyPath.create('value', 'exists').resolve({
            value: { exists: EXISTS_STRING },
        });
        expect(value).toBe(EXISTS_STRING);
    });

    it('Updates a defined(primitive) value of an object at the target property', () => {
        const path = PropertyPath.create('test', 'test');
        const obj = { test: { test: -1 } };
        const obj2 = { test: { test: { test: -1 } } };
        const obj3 = { test: {} };

        path.updateValueOn(obj, true);
        path.updateValueOn(obj2, true);
        path.updateValueOn(obj3, true);
        expect(obj.test.test).toBe(true);
        expect(obj2.test.test.test).toEqual(-1);
        expect(obj3.test).toEqual({});
    });

    it("Sets the given value of an object using this property path's keys creating objects as needed.", () => {
        const path = PropertyPath.create('test', 'test');
        const obj1 = { test: { test: { test: -1 } } };
        const obj2 = { test: { test: -1 } };
        const obj3 = {};

        path.setValueOn(obj1, true);
        path.setValueOn(obj2, true);
        path.setValueOn(obj3, true);
        expect(obj1.test.test).toBe(true);
        expect(obj2.test.test).toBe(true);
        expect(obj3['test']['test']).toBe(true);
    });

    it('Removes the targeted property from an object.', () => {
        const path = PropertyPath.create('test', 'test');
        const obj = { test: { test: 55 } };
        path.removeValueFrom(obj);
        expect(obj).toEqual({ test: {} });
    });

    it(`Detects if the property at the end of this property path is defined at the end of an object or not.`, () => {
        const keys1 = ['test1', 'test2', 'test3'];
        const keys2 = ['changed', 'test2', 'test3'];
        const keys3 = ['test1', 'test2'];
        const testObject = {
            test1: {
                test2: 11,
            },
        };
        const ppath1 = PropertyPath.create(...keys1);
        const ppath2 = PropertyPath.create(...keys2);
        const ppath3 = PropertyPath.create(...keys3);
        expect(ppath1['leafDefined'](testObject)).toBe(false);
        expect(ppath2['leafDefined'](testObject)).toBe(false);
        expect(ppath3['leafDefined'](testObject)).toBe(true);
    });

    it('Detects if there are any properties defined on an object that invalidate the property path.', () => {
        const keys1 = ['test', 'test2'];
        const keys2 = ['changed', 'test2'];
        const testObject1 = {
            test: {
                test2: 11,
            },
        };
        const testObject2 = {
            test: {
                test2: {},
            },
        };
        const testObject3 = {
            changed: 1,
        };

        const ppath1 = new PropertyPath(keys1);
        const ppath2 = new PropertyPath(keys2);

        expect(ppath1['hasConflictingProperties'](testObject1)).toBe(false);
        expect(ppath1['hasConflictingProperties'](testObject2)).toBe(false);
        expect(ppath2['hasConflictingProperties'](testObject3)).toBe(true);
    });

    // TODO finish property path tests
    // TODO XML File
    // TODO Yaml File
});

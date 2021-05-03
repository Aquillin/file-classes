import { accessProperty } from "./Json.util";

describe("Json Utils", () => {
    test('AccessProperty method returns right values', () => {
        const keys = ['ap', 'ap1'];
        const obj = {
            ap: {
                ap1: 55,
            },
        };

        accessProperty(obj, keys, (curr, key) => {
            expect({curr, key}).toEqual({ curr: obj.ap, key: 'ap1' });
        });
    });
})
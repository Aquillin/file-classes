import { mocked } from 'ts-jest/utils';
import fs from 'fs-extra';
import { JsonFile } from '.';
import { YamlFile } from './YamlFile';

jest.mock('fs-extra');
const mockedFs = mocked(fs, true);

describe('YamlFile Class', () => {
    beforeEach(() => {
        mockedFs.existsSync.mockImplementation(() => true);
        mockedFs.writeFileSync.mockImplementation((path, data) => {});
        mockedFs.readFileSync.mockImplementation(() => '{}');
    });

    test('ToData Method', () => {
        expect(new YamlFile('').toData(Buffer.from('yaml: true'))).toEqual({
            yaml: true,
        });
    });

    test('ToRaw', () => {
        expect(new YamlFile('').toRaw({ yaml: true })).toBe('yaml: true');
    });
});

import _ from 'lodash';
import { File } from './File';
import PropertyPath from './property-path/PropertyPath';

export type JsonObject = { [key: string]: any };

export class JsonFile<J extends JsonObject> extends File<JsonObject> {
    public get(): J {
        return super.get() as J;
    }

    /**
     * Merges the provided data JsonObject into this JsonFile.
     * Writes the merged data to file.
     * Uses the lodash .merge method to merge data.
     *
     * @param data - A generic JsonObject to merge.
     */
    public merge(data: JsonObject) {
        super.write(_.merge(this.data, data));
    }

    public getVal<U>(ref: string) {
        const parts = ref.split('.');
        const ppath = new PropertyPath(parts);
        return ppath.resolve(this.data) as U;
    }

    public updateVal(ref: string, val: any) {
        const parts = ref.split('.');
        const ppath = new PropertyPath(parts);
        ppath.updateValueOn(this.data, val);
        super.write(this.data);
    }

    public removeVal(ref: string) {
        const parts = ref.split('.');
        const ppath = new PropertyPath(parts);
        
        ppath.removeValueFrom(this.data);
        super.write(this.data);
    }

    public toRaw(data: JsonObject): string {
        return JSON.stringify(data);
    }
    public toData(rawData: Buffer): JsonObject {
        return JSON.parse(rawData.toString());
    }
    public defaultValue(): JsonObject {
        return {};
    }
}

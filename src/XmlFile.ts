import xmlJs from 'xml-js';
import { JsonFile } from '.';
import { accessProperty } from './json-util/Json.util';
import { JsonObject } from './JsonFile';
import PropertyPath from './property-path/PropertyPath';

export class XmlFile<T extends JsonObject> extends JsonFile<T> {
    public getVal<U>(ref: string) {
        return super.getVal<U>(ref + '._text');
    }

    public updateVal(ref: string, newVal: string) {
        return super.updateVal(ref + '._text', newVal);
    }

    /**
     * Adds a new object to an array in the XML file (The json representation of it).
     *
     * @param object - The object to add.
     * @param targetRef - The target ref of an array in the XmlObject.
     */
    public async addObjectTo(object: JsonObject, targetRef: string) {
        const parts = targetRef.split('.');
        await accessProperty(this.data, parts, (curr, key) => {
            if (Array.isArray(curr[key])) {
                curr[key].push(object);
            } else {
                curr[key] = [curr[key], object];
            }
            super.write(this.data);
        });
    }

    public getXmlAttr<U>(ref: string, attr: string) {
        return super.getVal<U>(ref + '._attributes.' + attr);
    }

    public updateXmlAttr(ref: string, attr: string, newVal: string) {
        return super.updateVal(ref + '._attributes.' + attr, newVal);
    }

    public removeXmlAttr(ref: string, attr: string) {
        super.removeVal(ref + '._attributes.' + attr);
    }

    public toData(rawData: Buffer): T {
        const options = { compact: true };
        const xml = xmlJs.xml2js(rawData.toString(), options);
        return xml as T;
    }

    public toRaw(data: JsonObject): string {
        return xmlJs.js2xml(data);
    }
}

import xmlJs from 'xml-js';
import { accessProperty } from './json-util/Json.util';
import { JsonFile, JsonObject } from './JsonFile';

export class XmlFile<T extends JsonObject> extends JsonFile<T> {
    /**
     * Returns the value (ie the inner text) of an XML property.
     * 
     * @param ref - The property path to the property.
     * @returns - The value of the inner text of the property.
     */
    public getVal<U>(ref: string) {
        return super.getVal<U>(ref + '._text');
    }

    /**
     * Updates the value (ie the inner text) of an XML property.
     * 
     * @param ref - The property path to the property
     * @param newVal - The new value of the inner text of the property
     */
    public updateVal(ref: string, newVal: string) {
        return super.updateVal(ref + '._text', newVal);
    }

    /**
     * Returns the value of a property on the XML object given a property path.
     * 
     * @param ref - The property path to the property
     * @returns The property corresponding to the provided property path.
     */
    public getProperty<U>(ref: string) {
        return super.getVal<U>(ref);
    }

    /**
     * Updates the value of an XML property.
     * @param ref - The property path to the property
     * @param newVal - The new value to replace the old property's value.
     */
    public updateProperty(ref: string, newVal: any) {
        return super.updateVal(ref, newVal);
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
        return xmlJs.js2xml(data, {
            compact: true
        });
    }
}

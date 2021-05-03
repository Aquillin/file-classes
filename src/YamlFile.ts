import yaml from "yaml";

import { JsonFile } from ".";
import { JsonObject } from "./JsonFile";

export class YamlFile<T extends JsonObject> extends JsonFile<T> {
    toData(rawData: Buffer): T {
        return yaml.parse(rawData.toString());
    }

    toRaw(data: T): string {
        return yaml.stringify(data).trim();
    }
} 
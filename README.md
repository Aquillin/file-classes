# File Classes

Do struggle when dealing with saving state in your program? Is it annoying?
Well not anymore!

`npm install file-classes` or `yarn add file-classes` is a solution to the age old problem of syncing a piece of data in a program to the actual file store of your device.

With version 2 it works with XML, YAML, and JSON data!
It's currently a bit clunky to use, but eventually that will be worked on.

It works like this...
```ts
import { JsonFile } from 'file-classes';
// Declare your store. (Provide type in the <> if you use TS for intellisense)
const store = new JsonFile<{ test: number; string: number }>('./store.json');

// Write data to the store
store.write({test: 0});

// Update test to a random number
store.updateVal("test", 135135);
// Get the value of test from the store.
store.getVal("test") // -> 135135
```

And of course you can also import XmlFile and YamlFile if you want to work with them.
YAML files are parsed and written to using [yaml](https://www.npmjs.com/package/yaml)
XML Files are parsed and written to using [xml-js](https://www.npmjs.com/package/xml-js)

**NOTE:** XML Files come with some extra utilities for modifying the data since XML is more complex than JSON. If you don't use these you can run into pitfalls (check *[Pitfalls](#Pitfalls)*)

## Pitfalls
1. Watch out when using .get() with XML Files. The value of tags is actually stored under [propertyPath].text example `xmlJson.test.data._text` instead of `xmlJson.test.data`.
    
    Avoid this by using the XmlFile "val" "property" and "attribute" methods for getting + updating.

    ```xml
    <test>
        <data>
            THIS IS THE VALUE OF `xmlJson.test.data._text`
        </data>
    </test>
    ```
2. If you use .get() and then modify a JSON object, make sure to save those changes with .write(`object`) using the updated `object`.

## Upcoming Features
1. Setting to compliment just updating data, so you can specify a property path and have it automatically created.
2. Support for more file types as needed, if you have any suggestions, post them on the Github repo under issues.
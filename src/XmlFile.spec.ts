import fs from 'fs-extra';
import { mocked } from 'ts-jest/utils';
import { JsonObject } from './JsonFile';
import { XmlFile } from './XmlFile';

jest.mock('fs-extra');
const mockedFs = mocked(fs, true);

describe('XmlFile class', () => {
    let mockData = `<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/maven-v4_0_0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <!-- The details pertaining to your project. -->
    <!-- The Spigot Plugin Manager will automatically generate these on the initialization of a plugin -->
    <groupId>$SUFFIX.$DOMAIN.$APP</groupId>
    <artifactId>$APP</artifactId>
    <description>$DESCRIPTION</description>
    <version>1.0.0</version>

    <!-- The Target Version of Java you want to use (This template uses 1.8 for Java 8) -->
    <properties>
      <maven.compiler.source>1.8</maven.compiler.source>
      <maven.compiler.target>1.8</maven.compiler.target>
    </properties>

    <!-- The dependencies of this project, this is where you can add any code you may want to use. Example: GSON by Google. -->
    <dependencies>
      <dependency>
        <groupId>org.spigotmc</groupId>
        <artifactId>spigot-api</artifactId>
        <version>1.16.4-R0.1-SNAPSHOT</version>
        <scope>provided</scope>
     </dependency>
    </dependencies>
  
    <build>
      <sourceDirectory>src</sourceDirectory>
      <testSourceDirectory>src</testSourceDirectory>

      <!-- Includes spigot.yml in your .jar -->
      <resources>
        <resource>
          <directory>src</directory>
          <includes>
            <include>**/plugin.yml</include>
          </includes>
        </resource>
      </resources>

      <!-- The Maven Jar Plugin handles the building of all your Java code into a .jar file -->
      <plugins>
        <plugin>
          <groupId>org.apache.maven.plugins</groupId>
          <artifactId>maven-jar-plugin</artifactId>
          <version>3.0.0</version>
          <configuration>
            <outputDirectory>..\\\${basedir}\\server\\plugins</outputDirectory>
          </configuration>
        </plugin>
      </plugins>
    </build>
                    </project>`;

    let xml: XmlFile<JsonObject>;

    beforeEach(() => {
        mockData = `<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/maven-v4_0_0.xsd">
        <modelVersion>4.0.0</modelVersion>
    
        <!-- The details pertaining to your project. -->
        <!-- The Spigot Plugin Manager will automatically generate these on the initialization of a plugin -->
        <groupId>$SUFFIX.$DOMAIN.$APP</groupId>
        <artifactId>$APP</artifactId>
        <description>$DESCRIPTION</description>
        <version>1.0.0</version>
    
        <!-- The Target Version of Java you want to use (This template uses 1.8 for Java 8) -->
        <properties>
          <maven.compiler.source>1.8</maven.compiler.source>
          <maven.compiler.target>1.8</maven.compiler.target>
        </properties>
    
        <!-- The dependencies of this project, this is where you can add any code you may want to use. Example: GSON by Google. -->
        <dependencies>
          <dependency>
            <groupId>org.spigotmc</groupId>
            <artifactId>spigot-api</artifactId>
            <version>1.16.4-R0.1-SNAPSHOT</version>
            <scope>provided</scope>
         </dependency>
        </dependencies>
      
        <build>
          <sourceDirectory>src</sourceDirectory>
          <testSourceDirectory>src</testSourceDirectory>
    
          <!-- Includes spigot.yml in your .jar -->
          <resources>
            <resource>
              <directory>src</directory>
              <includes>
                <include>**/plugin.yml</include>
              </includes>
            </resource>
          </resources>
    
          <!-- The Maven Jar Plugin handles the building of all your Java code into a .jar file -->
          <plugins>
            <plugin>
              <groupId>org.apache.maven.plugins</groupId>
              <artifactId>maven-jar-plugin</artifactId>
              <version>3.0.0</version>
              <configuration>
                <outputDirectory>..\\\${basedir}\\server\\plugins</outputDirectory>
              </configuration>
            </plugin>
          </plugins>
        </build>
                    </project>`;
        mockedFs.existsSync.mockImplementation(() => true);
        mockedFs.writeFileSync.mockImplementation((path, data) => {
            mockData = data.toString();
        });

        mockedFs.readFileSync.mockImplementation(() => mockData);
        xml = new XmlFile('./whatever.xml');
    });

    test('GetVal works', () => {
        expect(xml.getVal<string>('project.artifactId')).toBe('$APP');
    });

    test('UpdateVal works', () => {
        xml.updateVal('project.artifactId', 'UPDATED');
        expect(xml.getVal<string>('project.artifactId')).toBe('UPDATED');
    });

    test('AddObjectTo Works', async () => {
        await xml.addObjectTo(
            { UPDATED: true },
            'project.dependencies.dependency'
        ).then(() => {
            const deps = xml.getProperty<JsonObject[]>(
                'project.dependencies.dependency'
            );

            let updated = false;
            for (let depKey in deps) {
                let dep = deps[depKey];
                if (dep['UPDATED'] === true) updated = true;
            }


            expect(updated).toBe(true);
        });
    });

    test('getXmlAttr works', () => {
        expect(xml.getXmlAttr('project', 'xmlns')).toBe(
            'http://maven.apache.org/POM/4.0.0'
        );
    });

    test('updateXmlAttr works', () => {
        xml.updateXmlAttr('project', 'xmlns', 'UPDATED');
        expect(xml.getXmlAttr('project', 'xmlns')).toBe('UPDATED');
    });

    test('removeXmlAttr works', () => {
        xml.removeXmlAttr('project', 'xmlns');
        expect(xml.getXmlAttr('project', 'xmlns')).toBe(undefined);
    });

    test('toData properly converts an XML string to JSON', () => {
        const data = xml.toData(
            Buffer.from('<project attr="true"><child>Hello!</child></project>')
        );
        expect(data).toEqual({
            project: {
                _attributes: { attr: 'true' },
                child: { _text: 'Hello!' },
            },
        });
    });

    test('toRaw properly converts JSON to xml', () => {
        const raw = xml.toRaw({
            project: {
                _attributes: { attr: 'true' },
                child: { _text: 'Hello!' },
            },
        });

        const EXPECTED_OUTPUT = '<project attr="true"><child>Hello!</child></project>'.trim();
        expect(raw).toBe(EXPECTED_OUTPUT)
    });
});

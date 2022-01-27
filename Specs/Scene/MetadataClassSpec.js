import {
  MetadataClass,
  MetadataComponentType,
  MetadataEnum,
  MetadataType,
} from "../../Source/Cesium.js";

describe("Scene/MetadataClass", function () {
  it("creates class with default values", function () {
    const buildingClass = new MetadataClass({
      id: "building",
      class: {},
    });

    expect(buildingClass.id).toBe("building");
    expect(buildingClass.properties).toEqual({});
    expect(buildingClass.propertiesBySemantic).toEqual({});
    expect(buildingClass.name).toBeUndefined();
    expect(buildingClass.description).toBeUndefined();
    expect(buildingClass.extras).toBeUndefined();
    expect(buildingClass.extensions).toBeUndefined();
  });

  it("creates class", function () {
    const extras = {
      cityInfo: {
        name: "city",
      },
    };
    const extensions = {
      EXT_other_extension: {},
    };

    const buildingClass = new MetadataClass({
      id: "building",
      class: {
        name: "Building",
        description: "Building Class",
        extras: extras,
        extensions: extensions,
        properties: {
          height: {
            componentType: "FLOAT32",
          },
          position: {
            type: "ARRAY",
            componentType: "FLOAT32",
            componentCount: 3,
            semantic: "_POSITION",
          },
          color: {
            componentType: "STRING",
            semantic: "_COLOR",
          },
        },
      },
    });

    expect(buildingClass.id).toBe("building");
    expect(buildingClass.name).toBe("Building");
    expect(buildingClass.description).toBe("Building Class");
    expect(buildingClass.extras).toBe(extras);
    expect(buildingClass.extensions).toBe(extensions);

    const properties = buildingClass.properties;
    const heightProperty = properties.height;
    const positionProperty = properties.position;
    const colorProperty = properties.color;

    expect(heightProperty.type).toBe(MetadataType.SINGLE);
    expect(heightProperty.componentType).toBe(MetadataComponentType.FLOAT32);
    expect(positionProperty.type).toBe(MetadataType.ARRAY);
    expect(positionProperty.componentType).toBe(MetadataComponentType.FLOAT32);
    expect(colorProperty.type).toBe(MetadataType.SINGLE);
    expect(colorProperty.componentType).toBe(MetadataComponentType.STRING);
    expect(Object.keys(properties).sort()).toEqual([
      "color",
      "height",
      "position",
    ]);

    const propertiesBySemantic = buildingClass.propertiesBySemantic;
    expect(propertiesBySemantic._COLOR).toBe(colorProperty);
    expect(propertiesBySemantic._POSITION).toBe(positionProperty);
    expect(Object.keys(propertiesBySemantic).sort()).toEqual([
      "_COLOR",
      "_POSITION",
    ]);
  });

  it("creates class with enum property", function () {
    const colorEnum = new MetadataEnum({
      id: "color",
      enum: {
        values: [
          {
            name: "RED",
            value: 0,
          },
        ],
      },
    });

    const enums = {
      color: colorEnum,
    };

    const buildingClass = new MetadataClass({
      id: "building",
      class: {
        properties: {
          color: {
            componentType: "ENUM",
            enumType: "color",
          },
        },
      },
      enums: enums,
    });

    expect(buildingClass.properties.color.type).toBe(MetadataType.SINGLE);
    expect(buildingClass.properties.color.componentType).toBe(
      MetadataComponentType.ENUM
    );
    expect(buildingClass.properties.color.enumType).toBe(colorEnum);
  });

  it("constructor throws without id", function () {
    expect(function () {
      return new MetadataClass({
        class: {},
      });
    }).toThrowDeveloperError();
  });

  it("constructor throws without class", function () {
    expect(function () {
      return new MetadataClass({
        id: "classId",
      });
    }).toThrowDeveloperError();
  });
});

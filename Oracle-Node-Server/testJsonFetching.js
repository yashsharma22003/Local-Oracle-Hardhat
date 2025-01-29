const fs = require("fs");

function getPropertyById(propertyId) {
    const filePath = "./Property-Database/sample_properties.json"; // Path to your JSON file
    const jsonData = JSON.parse(fs.readFileSync(filePath, "utf8"));
    const property = jsonData.properties.find(
        (item) => item.property_id === propertyId
    );

    if (property) {
        console.log("Property Found:", property);
        return property;
    } else {
        console.log("Property not found");
        return null;
    }
}

// Example Usage
getPropertyById("PROP61832");

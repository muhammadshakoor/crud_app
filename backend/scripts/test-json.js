const fs = require('fs').promises;
const path = require('path');

async function testJson() {
    try {
        const filePath = path.join(__dirname, '../data/data.json');
        const rawData = await fs.readFile(filePath, 'utf8');
        const jsonData = JSON.parse(rawData);
        if (!jsonData.data || !Array.isArray(jsonData.data)) {
            throw new Error('Invalid JSON structure: "data" array not found')
        }
        console.log('JSON is valid. Number of products:', jsonData.data.length);
    } catch (error) {
        console.error('JSON parsing error:', error.message);
    }
}

testJson();
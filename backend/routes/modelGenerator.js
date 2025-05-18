const COLOR_MAPPINGS = {
    red: '#FF0000',
    blue: '#0000FF',
    green: '#00FF00',
    yellow: '#FFFF00',
    purple: '#800080',
    orange: '#FFA500',
    pink: '#FFC0CB',
    brown: '#A52A2A',
    gray: '#808080',
    black: '#000000',
    white: '#FFFFFF',
};

const MODEL_TEMPLATES = {
    cube: { geometry: 'cube', material: 'basic', color: '#808080' },
    sphere: { geometry: 'sphere', material: 'standard', color: '#A52A2A' },
    cylinder: { geometry: 'cylinder', material: 'lambert', color: '#FFFF00' },
    plane: { geometry: 'plane', material: 'basic', color: '#FFFFFF' },
    chair: { 
        geometry: 'chair', 
        material: 'fabric', 
        color: '#27AE60', 
        dimensions: { height: 4, width: 2, depth: 2 } 
    },
    table: { 
        geometry: 'table', 
        material: 'wood', 
        color: '#A0522D', 
        dimensions: { height: 3, width: 4, depth: 4 } 
    },
    lamp: { 
        geometry: 'lamp', 
        material: 'metal', 
        color: '#F39C12', 
        dimensions: { height: 2.5, width: 0.5, depth: 0.5 } 
    }
};

class ModelGenerator {
    constructor() {
        this.COLOR_MAPPINGS = COLOR_MAPPINGS;
        this.MODEL_TEMPLATES = MODEL_TEMPLATES;
    }

    generateModelFromObjects(objects) {
        if (!objects || objects.length === 0) {
            return this.generateDefaultModel();
        }

        const primaryObject = this.extractPrimaryObject(objects);
        if (!primaryObject) {
            return this.generateDefaultModel();
        }

        const model = this.customizeModel(primaryObject);
        return model;
    }

    extractPrimaryObject(objects) {
        // Filter by confidence score
        const validObjects = objects.filter(obj => obj.score > 0.5);
        if (validObjects.length === 0) return null;
        
        // Sort by confidence
        return validObjects.sort((a, b) => b.score - a.score)[0];
    }

    generateDefaultModel() {
        return {
            geometry: 'cube',
            material: 'basic',
            color: '#808080',
            position: [0, 0, 0],
            size: [1, 1, 1],
        };
    }

    customizeModel(primaryObject) {
        // Clean object name for matching
        const normalizedName = primaryObject.name.toLowerCase();
        
        // Try exact match first
        let modelTemplate = this.MODEL_TEMPLATES[normalizedName];
        
        // Fallback to partial matches
        if (!modelTemplate) {
            if (normalizedName.includes('chair')) {
                modelTemplate = this.MODEL_TEMPLATES.chair;
            } else if (normalizedName.includes('table')) {
                modelTemplate = this.MODEL_TEMPLATES.table;
            } else if (normalizedName.includes('lamp')) {
                modelTemplate = this.MODEL_TEMPLATES.lamp;
            }
        }
        
        // Final fallback to cube
        const model = modelTemplate ? { ...modelTemplate } : { ...this.MODEL_TEMPLATES.cube };
        model.color = this.generateColor(primaryObject.name);
        return model;
    }

    generateColor(objectType) {
        const colorPalettes = {
            lamp: ['#4A90E2', '#2C3E50', '#F39C12'],
            vase: ['#E67E22', '#8E44AD', '#27AE60'],
            chair: ['#27AE60', '#3498DB', '#E74C3C'],
            cushion: ['#8E44AD', '#F39C12', '#E67E22'],
            frame: ['#D4AA7D', '#8B4513', '#2C3E50'],
            sofa: ['#808000', '#D37095', '#D2B48C'],
            table: ['#B8860B', '#A0522D', '#CD853F']
        };
        
        const colors = colorPalettes[objectType.toLowerCase()] || colorPalettes.vase;
        return colors[Math.floor(Math.random() * colors.length)];
    }
}

module.exports = ModelGenerator;
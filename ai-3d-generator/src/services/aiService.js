import axios from 'axios';

class AIPService {
  constructor() {
    this.endpoint = 'https://ai-3d-model.onrender.com/api/analyze-image'; //  your backend endpoint
    console.log('🔑 AIP Service endpoint:', this.endpoint);
  }

  async analyzeImage(imageFile) {
    const formData = new FormData();
    formData.append('file', imageFile);

    try {
      const response = await axios.post(
        this.endpoint,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data', //  Correct content type
          },
          responseType: 'json',
        }
      );
      return this.mapToDecorItems(response.data);
    } catch (error) {
      console.error('🚫 AIP Service error status:', error.response?.status);
      console.error('🚫 AIP Service error body:', error.response?.data);
      throw new Error('Failed to analyze image with AIP Service');
    }
  }

  mapToDecorItems(predictions) {
    const decorMapping = {
      lamp: ['table lamp', 'desk lamp', 'floor lamp', 'lamp'],
      chair: ['chair', 'armchair', 'rocking chair', 'folding chair'],
      vase: ['vase', 'pot', 'planter', 'bottle'],
      cushion: ['pillow', 'cushion', 'throw pillow'],
      frame: ['picture frame', 'mirror', 'frame'],
    };

    for (const [decorType, keywords] of Object.entries(decorMapping)) {
      for (const prediction of predictions) {
        if (
          keywords.some((keyword) =>
            prediction.label.toLowerCase().includes(keyword.toLowerCase())
          )
        ) {
          return {
            type: decorType,
            confidence: prediction.score,
            description: `Detected ${prediction.label.toLowerCase()}`,
          };
        }
      }
    }

    //  Default return
    return {
      type: 'vase',
      confidence: 0.7,
      description: 'Generic decorative object',
    };
  }

  async generateModel(analysis) {
    const modelTypes = {
      lamp: {
        geometry: 'lamp',
        material: 'metal',
        color: this.generateColor(analysis.type),
        dimensions: { height: 2.5, width: 1.5, depth: 1.5 },
      },
      vase: {
        geometry: 'vase',
        material: 'ceramic',
        color: this.generateColor(analysis.type),
        dimensions: { height: 3, width: 1.2, depth: 1.2 },
      },
      chair: {
        geometry: 'chair',
        material: 'fabric',
        color: this.generateColor(analysis.type),
        dimensions: { height: 4, width: 2, depth: 2 },
      },
      cushion: {
        geometry: 'cushion',
        material: 'fabric',
        color: this.generateColor(analysis.type),
        dimensions: { height: 0.8, width: 2, depth: 2 },
      },
      frame: {
        geometry: 'frame',
        material: 'wood',
        color: this.generateColor(analysis.type),
        dimensions: { height: 4, width: 0.2, depth: 3 },
      },
    };

    await new Promise((resolve) => setTimeout(resolve, 3000));
    return modelTypes[analysis.type] || modelTypes.vase;
  }

  generateColor(objectType) {
    const colorPalettes = {
      lamp: ['#4A90E2', '#2C3E50', '#F39C12'],
      vase: ['#E67E22', '#8E44AD', '#27AE60'],
      chair: ['#27AE60', '#3498DB', '#E74C3C'],
      cushion: ['#8E44AD', '#F39C12', '#E67E22'],
      frame: ['#D4AA7D', '#8B4513', '#2C3E50'],
    };

    const colors = colorPalettes[objectType] || colorPalettes.vase;
    return colors[Math.floor(Math.random() * colors.length)];
  }
}

const aiService = new AIPService();
export default aiService;

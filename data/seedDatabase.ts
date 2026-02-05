import { PlantTemplate } from '../types';

export const seedDatabase: PlantTemplate[] = [
  // Tomatoes
  {
    id: 'tomato-moneymaker',
    name: 'Tomato - Moneymaker',
    category: 'veg',
    daysToGermination: 7,
    daysToTransplant: 21,
    daysToHardenOff: 7,
    daysToPlantOut: 0,        // Plant out on last frost date
    daysToHarvest: 80,
    sowIndoorsWeeksBefore: 8,
    notes: 'Classic UK variety, reliable cropper. Cordon/indeterminate type.',
  },
  {
    id: 'tomato-gardeners-delight',
    name: 'Tomato - Gardener\'s Delight',
    category: 'veg',
    daysToGermination: 7,
    daysToTransplant: 21,
    daysToHardenOff: 7,
    daysToPlantOut: 0,
    daysToHarvest: 75,
    sowIndoorsWeeksBefore: 8,
    notes: 'Sweet cherry tomato, heavy cropper. Cordon type.',
  },

  // Courgette
  {
    id: 'courgette-black-beauty',
    name: 'Courgette - Black Beauty',
    category: 'veg',
    daysToGermination: 7,
    daysToTransplant: 14,
    daysToHardenOff: 7,
    daysToPlantOut: 14,       // 2 weeks after last frost
    daysToHarvest: 50,
    sowIndoorsWeeksBefore: 4,
    notes: 'Dark green fruits, prolific producer. Pick when 10-15cm for best flavour.',
  },

  // Runner Beans
  {
    id: 'runner-beans-scarlet-emperor',
    name: 'Runner Beans - Scarlet Emperor',
    category: 'veg',
    daysToGermination: 10,
    daysToTransplant: 14,
    daysToHardenOff: 7,
    daysToPlantOut: 14,
    daysToHarvest: 60,
    sowIndoorsWeeksBefore: 4,
    directSowWeeksAfter: 2,
    notes: 'Classic variety with red flowers. Needs support structure.',
  },
  {
    id: 'runner-beans-painted-lady',
    name: 'Runner Beans - Painted Lady',
    category: 'veg',
    daysToGermination: 10,
    daysToTransplant: 14,
    daysToHardenOff: 7,
    daysToPlantOut: 14,
    daysToHarvest: 65,
    sowIndoorsWeeksBefore: 4,
    directSowWeeksAfter: 2,
    notes: 'Bi-coloured red and white flowers. Heritage variety.',
  },

  // Chilli Peppers
  {
    id: 'chilli-jalapeno',
    name: 'Chilli - Jalapeño',
    category: 'veg',
    daysToGermination: 14,
    daysToTransplant: 28,
    daysToHardenOff: 10,
    daysToPlantOut: 14,
    daysToHarvest: 75,
    sowIndoorsWeeksBefore: 10,
    notes: 'Medium heat (2,500-8,000 SHU). Great for UK growing under cover.',
  },
  {
    id: 'chilli-cayenne',
    name: 'Chilli - Cayenne',
    category: 'veg',
    daysToGermination: 14,
    daysToTransplant: 28,
    daysToHardenOff: 10,
    daysToPlantOut: 14,
    daysToHarvest: 80,
    sowIndoorsWeeksBefore: 10,
    notes: 'Hot variety (30,000-50,000 SHU). Good for drying.',
  },

  // Lettuce
  {
    id: 'lettuce-little-gem',
    name: 'Lettuce - Little Gem',
    category: 'veg',
    daysToGermination: 7,
    daysToTransplant: 14,
    daysToHardenOff: 5,
    daysToPlantOut: -14,      // Can plant out 2 weeks before last frost
    daysToHarvest: 45,
    sowIndoorsWeeksBefore: 6,
    directSowWeeksAfter: 0,
    notes: 'Compact cos type, sweet and crunchy. Bolt resistant.',
  },
  {
    id: 'lettuce-butterhead',
    name: 'Lettuce - Butterhead',
    category: 'veg',
    daysToGermination: 7,
    daysToTransplant: 14,
    daysToHardenOff: 5,
    daysToPlantOut: -14,
    daysToHarvest: 50,
    sowIndoorsWeeksBefore: 6,
    directSowWeeksAfter: 0,
    notes: 'Soft, buttery leaves. Harvest whole head or pick outer leaves.',
  },

  // Herbs
  {
    id: 'basil-genovese',
    name: 'Basil - Genovese',
    category: 'herb',
    daysToGermination: 7,
    daysToTransplant: 21,
    daysToHardenOff: 7,
    daysToPlantOut: 14,       // Frost tender
    daysToHarvest: 30,
    sowIndoorsWeeksBefore: 6,
    notes: 'Classic Italian basil. Keep warm, pinch out flowers.',
  },
  {
    id: 'basil-thai',
    name: 'Basil - Thai',
    category: 'herb',
    daysToGermination: 7,
    daysToTransplant: 21,
    daysToHardenOff: 7,
    daysToPlantOut: 14,
    daysToHarvest: 30,
    sowIndoorsWeeksBefore: 6,
    notes: 'Anise/liquorice flavour. Purple stems, pink flowers.',
  },
  {
    id: 'coriander-slow-bolt',
    name: 'Coriander - Slow Bolt',
    category: 'herb',
    daysToGermination: 10,
    daysToTransplant: 14,
    daysToHardenOff: 5,
    daysToPlantOut: 0,
    daysToHarvest: 21,
    sowIndoorsWeeksBefore: 4,
    directSowWeeksAfter: 0,
    notes: 'Slower to bolt than standard varieties. Sow successionally.',
  },
  {
    id: 'parsley-flat-leaf',
    name: 'Parsley - Flat Leaf',
    category: 'herb',
    daysToGermination: 21,    // Slow germinator
    daysToTransplant: 28,
    daysToHardenOff: 7,
    daysToPlantOut: -7,
    daysToHarvest: 30,
    sowIndoorsWeeksBefore: 10,
    notes: 'Italian flat-leaf type. Stronger flavour than curly.',
  },

  // Fruits (Strawberry as example)
  {
    id: 'strawberry-cambridge-favourite',
    name: 'Strawberry - Cambridge Favourite',
    category: 'fruit',
    daysToGermination: 21,
    daysToTransplant: 42,
    daysToHardenOff: 7,
    daysToPlantOut: -7,       // Hardy, can plant early
    daysToHarvest: 120,       // First year establishment
    sowIndoorsWeeksBefore: 12,
    notes: 'Classic UK variety. Usually grown from runners, not seed.',
  },
];

// Helper function to get plant templates by category
export function getPlantsByCategory(category: 'veg' | 'herb' | 'fruit'): PlantTemplate[] {
  return seedDatabase.filter(plant => plant.category === category);
}

// Helper function to find a plant template by ID
export function getPlantTemplateById(id: string): PlantTemplate | undefined {
  return seedDatabase.find(plant => plant.id === id);
}

// Helper function to search plants by name
export function searchPlants(query: string): PlantTemplate[] {
  const lowerQuery = query.toLowerCase();
  return seedDatabase.filter(plant =>
    plant.name.toLowerCase().includes(lowerQuery)
  );
}

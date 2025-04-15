
export interface StoryElements {
  mainCharacter?: string;
  animals?: string[];
  locations?: string[];
}

/**
 * Extracts key story elements from the full story text
 */
export const extractStoryElements = (story: string): StoryElements => {
  const elements: StoryElements = {
    animals: [],
    locations: []
  };
  
  const nameMatch = story.match(/([A-Z][a-z]+)(?:\s+was|\s+had|\s+felt|\s+saw|\s+looked|\s+went)/);
  if (nameMatch && nameMatch[1]) {
    elements.mainCharacter = nameMatch[1];
  }
  
  const animalMatches = story.match(/(?:a|the)\s+([a-z]+\s+[a-z]+|[a-z]+)(?:\s+with|\s+that|\s+who|\s+which)/ig);
  if (animalMatches) {
    const animalCandidates = animalMatches.map(m => 
      m.replace(/^(?:a|the)\s+/, '').replace(/\s+(?:with|that|who|which).*$/, '')
    );
    elements.animals = [...new Set(animalCandidates)];
  }
  
  const locationMatches = story.match(/(?:at|in|to)\s+(?:the|a)\s+([a-z]+\s+[a-z]+|[a-z]+)/ig);
  if (locationMatches) {
    const locationCandidates = locationMatches.map(m => 
      m.replace(/^(?:at|in|to)\s+(?:the|a)\s+/, '')
    );
    elements.locations = [...new Set(locationCandidates)];
  }
  
  return elements;
};


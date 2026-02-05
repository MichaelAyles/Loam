import { useQuery } from 'convex/react';
import { api } from '../convex/_generated/api';

export function useSpecies() {
  const species = useQuery(api.species.list);

  return {
    species: species ?? [],
    loading: species === undefined,
  };
}

export function useSpeciesByCategory(category: 'veg' | 'herb' | 'fruit') {
  const species = useQuery(api.species.listByCategory, { category });

  return {
    species: species ?? [],
    loading: species === undefined,
  };
}

export function useSpeciesSearch(query: string) {
  const species = useQuery(
    api.species.search,
    query.length >= 2 ? { query } : 'skip'
  );

  return {
    species: species ?? [],
    loading: query.length >= 2 && species === undefined,
  };
}

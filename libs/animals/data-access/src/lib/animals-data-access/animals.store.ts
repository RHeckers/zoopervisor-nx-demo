import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';

export interface Animal {
  id: number;
  name: string;
  species: string;
}

interface AnimalsState {
  animals: Animal[];
  selectedAnimalId: number | null;
  loading: boolean;
}

const initialState: AnimalsState = {
  animals: [],
  selectedAnimalId: null,
  loading: false,
};

export const AnimalsStore = signalStore(
  withState(initialState),
  withMethods((store) => ({
    setLoading(loading: boolean) {
      patchState(store, { loading });
    },

    loadAnimals(animals: Animal[]) {
      patchState(store, {
        animals,
        loading: false,
      });
    },

    addAnimal(animal: Animal) {
      patchState(store, {
        animals: [...store.animals(), animal],
      });
    },

    removeAnimal(id: number) {
      patchState(store, {
        animals: store.animals().filter((animal) => animal.id !== id),
        selectedAnimalId:
          store.selectedAnimalId() === id ? null : store.selectedAnimalId(),
      });
    },

    selectAnimal(id: number | null) {
      patchState(store, { selectedAnimalId: id });
    },
  }))
);

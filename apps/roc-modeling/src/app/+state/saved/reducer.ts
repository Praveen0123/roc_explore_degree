import { createReducer, on } from '@ngrx/store';

import { addToSaved, removeFromSaved } from './actions';
import { initialSavedStoreState, savedStateAdapter } from './state';


export const reducer = createReducer
  (
    initialSavedStoreState,

    on(addToSaved, (state, { roiAggregateDto }) => savedStateAdapter.addOne(roiAggregateDto, { ...state })),

    on(removeFromSaved, (state, { roiAggregateDto }) => savedStateAdapter.removeOne(roiAggregateDto.id, { ...state })),

  );

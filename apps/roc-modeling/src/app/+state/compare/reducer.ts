import { createReducer, on } from '@ngrx/store';

import { addToCompare, removeFromCompare } from './actions';
import { compareStateAdapter, initialCompareStoreState } from './state';


export const reducer = createReducer
  (
    initialCompareStoreState,

    on(addToCompare, (state, { roiAggregateDto }) => compareStateAdapter.addOne(roiAggregateDto, { ...state })),

    on(removeFromCompare, (state, { roiAggregateDto }) => compareStateAdapter.removeOne(roiAggregateDto.id, { ...state })),

  );

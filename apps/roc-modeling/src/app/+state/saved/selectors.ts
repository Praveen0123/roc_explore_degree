import { RoiAggregateDto } from '@app/domain';
import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';

import { SAVED_STORE_FEATURE_KEY, SavedStoreState, selectAll, selectIds, selectTotal } from './state';


// RETRIEVE SLICE OF STATE
export const savedStoreSlice: MemoizedSelector<object, SavedStoreState> = createFeatureSelector<SavedStoreState>(SAVED_STORE_FEATURE_KEY);


export const getSavedList: MemoizedSelector<object, RoiAggregateDto[]> = createSelector
  (
    savedStoreSlice,
    selectAll
  );

export const getSavedIdList: MemoizedSelector<object, string[] | number[]> = createSelector
  (
    savedStoreSlice,
    selectIds
  );


export const getSavedCount: MemoizedSelector<object, number> = createSelector
  (
    savedStoreSlice,
    selectTotal
  );

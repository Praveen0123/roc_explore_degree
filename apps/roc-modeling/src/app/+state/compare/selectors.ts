import { RoiAggregateDto } from '@app/domain';
import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';

import { COMPARE_STORE_FEATURE_KEY, CompareStoreState, selectAll, selectIds, selectTotal } from './state';


// RETRIEVE SLICE OF STATE
export const compareStoreSlice: MemoizedSelector<object, CompareStoreState> = createFeatureSelector<CompareStoreState>(COMPARE_STORE_FEATURE_KEY);


export const getCompareList: MemoizedSelector<object, RoiAggregateDto[]> = createSelector
  (
    compareStoreSlice,
    selectAll
  );

export const getCompareIdList: MemoizedSelector<object, string[] | number[]> = createSelector
  (
    compareStoreSlice,
    selectIds
  );


export const getCompareCount: MemoizedSelector<object, number> = createSelector
  (
    compareStoreSlice,
    selectTotal
  );

import { RoiAggregateDto } from '@app/domain';
import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';

import { ROI_MODEL_STORE_FEATURE_KEY, RoiModelStoreState, selectAll } from './state';


// RETRIEVE SLICE OF STATE
export const roiModelStoreSlice: MemoizedSelector<object, RoiModelStoreState> = createFeatureSelector<RoiModelStoreState>(ROI_MODEL_STORE_FEATURE_KEY);


export const getRoiModelList: MemoizedSelector<object, RoiAggregateDto[]> = createSelector
  (
    roiModelStoreSlice,
    selectAll
  );


export const getSelectedRoiModel: MemoizedSelector<object, RoiAggregateDto> = createSelector
  (
    roiModelStoreSlice,
    (state): RoiAggregateDto =>
    {
      return (state.selectedRoiModelId) ? state.entities[state.selectedRoiModelId] : null;
    }
  );

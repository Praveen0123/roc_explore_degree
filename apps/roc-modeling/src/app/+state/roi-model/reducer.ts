import { createReducer, on } from '@ngrx/store';

import { addRoiModel, deleteRoiModel, removeSelectedRoiModel, resetRoiModelReceived, updateRoiModelFromCareerGoal, updateRoiModelFromCurrentInformation, updateRoiModelFromEducationCost, updateRoiModelFromEducationFinancing } from './actions';
import { initialRoiModelStoreState, roiModelStateAdapter } from './state';


export const reducer = createReducer
  (
    initialRoiModelStoreState,

    on(addRoiModel, (state, { roiAggregateDto }) =>
    {
      if (roiAggregateDto)
      {
        return roiModelStateAdapter.addOne(roiAggregateDto, { ...state, selectedRoiModelId: roiAggregateDto.id });
      }

      return { ...state };

    }),

    on
      (
        updateRoiModelFromCurrentInformation,
        updateRoiModelFromCareerGoal,
        updateRoiModelFromEducationCost,
        updateRoiModelFromEducationFinancing,
        (state, { roiAggregateDto }) => roiModelStateAdapter.upsertOne(roiAggregateDto, { ...state, selectedRoiModelId: roiAggregateDto.id })),

    on(deleteRoiModel, (state, { roiAggregateDto }) => roiModelStateAdapter.removeOne(roiAggregateDto.id, { ...state, selectedRoiModelId: null })),

    on(removeSelectedRoiModel, (state) =>
    {
      return { ...state, selectedRoiModelId: null };
    }),

    on(resetRoiModelReceived, (state, { roiAggregateDto }) => roiModelStateAdapter.upsertOne(roiAggregateDto, { ...state, selectedRoiModelId: roiAggregateDto.id }))

  );

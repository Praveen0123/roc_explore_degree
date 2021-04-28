import { RoiAggregateDto } from '@app/domain';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';


export const ROI_MODEL_STORE_FEATURE_KEY = 'roi-model-store';


export interface RoiModelStoreState extends EntityState<RoiAggregateDto>
{
  selectedRoiModelId: string;
}

export const roiModelStateAdapter: EntityAdapter<RoiAggregateDto> = createEntityAdapter<RoiAggregateDto>
  (
    {
      selectId: (roiModel: RoiAggregateDto) => roiModel.id,
      sortComparer: false
    }
  );

export const initialRoiModelStoreState: RoiModelStoreState = roiModelStateAdapter.getInitialState
  (
    {
      selectedRoiModelId: null
    }
  );

export const
  {
    selectIds,
    selectEntities,
    selectAll,
    selectTotal,
  } = roiModelStateAdapter.getSelectors();

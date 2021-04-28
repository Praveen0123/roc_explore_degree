import { RoiAggregateDto } from '@app/domain';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';


export const SAVED_STORE_FEATURE_KEY = 'saved-store';


export interface SavedStoreState extends EntityState<RoiAggregateDto>
{

}

export const savedStateAdapter: EntityAdapter<RoiAggregateDto> = createEntityAdapter<RoiAggregateDto>
  (
    {
      selectId: (roiAggregateDto: RoiAggregateDto) => roiAggregateDto.id,
      sortComparer: false
    }
  );

export const initialSavedStoreState: SavedStoreState = savedStateAdapter.getInitialState
  (
    {
    }
  );

export const
  {
    selectIds,
    selectEntities,
    selectAll,
    selectTotal,
  } = savedStateAdapter.getSelectors();

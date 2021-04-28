import { RoiAggregateDto } from '@app/domain';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';


export const COMPARE_STORE_FEATURE_KEY = 'compare-store';


export interface CompareStoreState extends EntityState<RoiAggregateDto>
{

}

export const compareStateAdapter: EntityAdapter<RoiAggregateDto> = createEntityAdapter<RoiAggregateDto>
  (
    {
      selectId: (roiAggregateDto: RoiAggregateDto) => roiAggregateDto.id,
      sortComparer: false
    }
  );

export const initialCompareStoreState: CompareStoreState = compareStateAdapter.getInitialState
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
  } = compareStateAdapter.getSelectors();

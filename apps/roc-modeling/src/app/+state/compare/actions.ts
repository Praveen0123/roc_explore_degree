import { RoiAggregateDto } from '@app/domain';
import { createAction, props } from '@ngrx/store';



export const addToCompare = createAction
  (
    '[Compare] add to compare',
    props<{ roiAggregateDto: RoiAggregateDto; }>()
  );

export const removeFromCompare = createAction
  (
    '[Compare] remove from compare',
    props<{ roiAggregateDto: RoiAggregateDto; }>()
  );

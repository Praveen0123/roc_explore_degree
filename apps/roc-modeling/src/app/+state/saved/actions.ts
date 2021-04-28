import { RoiAggregateDto } from '@app/domain';
import { createAction, props } from '@ngrx/store';


export const addToSaved = createAction
  (
    '[Saved] add to Saved',
    props<{ roiAggregateDto: RoiAggregateDto; }>()
  );

export const removeFromSaved = createAction
  (
    '[Saved] remove from Saved',
    props<{ roiAggregateDto: RoiAggregateDto; }>()
  );

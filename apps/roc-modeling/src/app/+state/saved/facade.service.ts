import { Injectable } from '@angular/core';
import { RoiAggregateDto } from '@app/domain';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { addToSaved, removeFromSaved } from './actions';
import { getSavedCount, getSavedIdList, getSavedList } from './selectors';


@Injectable({
  providedIn: 'root'
})
export class SavedFacadeService
{

  constructor
    (
      private store: Store
    )
  {
  }

  addToSaved(roiAggregateDto: RoiAggregateDto)
  {
    return this.store.dispatch(addToSaved({ roiAggregateDto }));
  }

  removeFromSaved(roiAggregateDto: RoiAggregateDto)
  {
    return this.store.dispatch(removeFromSaved({ roiAggregateDto }));
  }

  getSavedList$(): Observable<RoiAggregateDto[]>
  {
    return this.store.pipe(select(getSavedList));
  }

  getSavedIdList$(): Observable<string[] | number[]>
  {
    return this.store.pipe(select(getSavedIdList));
  }

  getSavedCount$(): Observable<number>
  {
    return this.store.pipe(select(getSavedCount));
  }
}

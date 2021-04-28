import { Injectable } from '@angular/core';
import { RoiAggregateDto } from '@app/domain';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { addToCompare, removeFromCompare } from './actions';
import { getCompareCount, getCompareIdList, getCompareList } from './selectors';


@Injectable({
  providedIn: 'root'
})
export class CompareFacadeService
{

  constructor
    (
      private store: Store
    )
  {
  }

  addToCompare(roiAggregateDto: RoiAggregateDto)
  {
    return this.store.dispatch(addToCompare({ roiAggregateDto }));
  }

  removeFromCompare(roiAggregateDto: RoiAggregateDto)
  {
    return this.store.dispatch(removeFromCompare({ roiAggregateDto }));
  }

  getCompareList$(): Observable<RoiAggregateDto[]>
  {
    return this.store.pipe(select(getCompareList));
  }

  getCompareIdList$(): Observable<string[] | number[]>
  {
    return this.store.pipe(select(getCompareIdList));
  }

  getCompareCount$(): Observable<number>
  {
    return this.store.pipe(select(getCompareCount));
  }
}

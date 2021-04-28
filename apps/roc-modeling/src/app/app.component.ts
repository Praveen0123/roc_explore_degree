import { Component, OnInit } from '@angular/core';
import { FontAwesomeIconRegistryService } from '@core/services/icon-registry/font-awesome-icon-registry.service';
import { Observable } from 'rxjs';

import { CompareFacadeService } from './+state/compare';
import { OffCanvasFacadeService } from './+state/off-canvas';
import { SavedFacadeService } from './+state/saved/facade.service';
import { RoiAggregateDto } from './domain';


@Component({
  selector: 'roc-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit
{
  savedModelList$: Observable<RoiAggregateDto[]>;
  compareIdList$: Observable<string[] | number[]>;
  isOffCanvasOpen$: Observable<boolean>;

  constructor
    (
      private fontAwesomeIconRegistryService: FontAwesomeIconRegistryService,
      private savedFacadeService: SavedFacadeService,
      private compareFacadeService: CompareFacadeService,
      private offCanvasFacadeService: OffCanvasFacadeService
    )
  {
    this.fontAwesomeIconRegistryService.init();
  }

  ngOnInit(): void
  {
    this.savedModelList$ = this.savedFacadeService.getSavedList$();
    this.compareIdList$ = this.compareFacadeService.getCompareIdList$();
    this.isOffCanvasOpen$ = this.offCanvasFacadeService.isOffCanvasOpened$();
  }

  onShowSaved(isOpen: boolean)
  {
    if (isOpen)
    {
      this.offCanvasFacadeService.setOffCanvasOpen();
    }
    else
    {
      this.offCanvasFacadeService.setOffCanvasClosed();
    }
  }

  closeOffCanvas()
  {
    this.offCanvasFacadeService.setOffCanvasClosed();
  }

  onAddToCompareClick(roiAggregateDto: RoiAggregateDto)
  {
    this.compareFacadeService.addToCompare(roiAggregateDto);
  }

  onRemoveFromCompareClick(roiAggregateDto: RoiAggregateDto)
  {
    this.compareFacadeService.removeFromCompare(roiAggregateDto);
  }

  onDeleteSavedModel(roiAggregateDto: RoiAggregateDto)
  {
    this.savedFacadeService.removeFromSaved(roiAggregateDto);
  }
}

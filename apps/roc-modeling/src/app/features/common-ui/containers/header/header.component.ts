import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CompareFacadeService } from '@app/+state/compare/facade.service';
import { SavedFacadeService } from '@app/+state/saved/facade.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'roc-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit
{
  @Input() isOffCanvasOpen: boolean;
  @Output('onShowSaved') showSavedEventEmitter = new EventEmitter<boolean>();

  compareCount$: Observable<number>;
  savedCount$: Observable<number>;

  constructor
    (
      private compareFacadeService: CompareFacadeService,
      private savedFacadeService: SavedFacadeService
    ) { }

  ngOnInit(): void
  {
    this.compareCount$ = this.compareFacadeService.getCompareCount$();
    this.savedCount$ = this.savedFacadeService.getSavedCount$();
  }

  onShowSaved()
  {
    if (this.showSavedEventEmitter.observers.length > 0)
    {
      this.showSavedEventEmitter.emit(!this.isOffCanvasOpen);
    }
  }

}

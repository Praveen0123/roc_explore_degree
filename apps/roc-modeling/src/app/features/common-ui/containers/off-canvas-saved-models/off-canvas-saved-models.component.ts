import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RoiAggregateDto } from '@app/domain';

@Component({
  selector: 'roc-off-canvas-saved-models',
  templateUrl: './off-canvas-saved-models.component.html',
  styleUrls: ['./off-canvas-saved-models.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OffCanvasSavedModelsComponent implements OnInit
{
  @Input() savedModelList: RoiAggregateDto[];
  @Input() compareIdList: string[];
  @Output('onClose') closeEventEmitter = new EventEmitter<void>();
  @Output('onAddToCompareClick') addToCompareClickEventEmitter = new EventEmitter<RoiAggregateDto>();
  @Output('onRemoveFromCompareClick') removeFromCompareClickEventEmitter = new EventEmitter<RoiAggregateDto>();
  @Output('onDelete') deleteEventEmitter = new EventEmitter<RoiAggregateDto>();

  constructor() { }

  ngOnInit(): void
  {
  }

  onClose()
  {
    if (this.closeEventEmitter.observers.length > 0)
    {
      this.closeEventEmitter.emit();
    }
  }

  onCompareClick(isCompare: boolean, roiAggregateDto: RoiAggregateDto)
  {
    if (isCompare && this.addToCompareClickEventEmitter.observers.length > 0)
    {
      this.addToCompareClickEventEmitter.emit(roiAggregateDto);
    }
    else if (!isCompare && this.removeFromCompareClickEventEmitter.observers.length > 0)
    {
      this.removeFromCompareClickEventEmitter.emit(roiAggregateDto);
    }
  }

  onDelete(roiAggregateDto: RoiAggregateDto)
  {
    if (this.deleteEventEmitter.observers.length > 0)
    {
      this.deleteEventEmitter.emit(roiAggregateDto);
    }
  }

}

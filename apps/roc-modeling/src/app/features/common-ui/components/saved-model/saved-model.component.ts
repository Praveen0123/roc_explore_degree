import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { RoiAggregateDto } from '@app/domain';

@Component({
  selector: 'roc-saved-model',
  templateUrl: './saved-model.component.html',
  styleUrls: ['./saved-model.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SavedModelComponent implements OnInit, OnChanges
{
  @Input() roiAggregateDto: RoiAggregateDto;
  @Input() compareIdList: string[];
  @Output('onCompareClick') compareClickEventEmitter = new EventEmitter<boolean>();
  @Output('onDelete') deleteEventEmitter = new EventEmitter<RoiAggregateDto>();

  isInCompare: boolean;

  constructor() { }

  ngOnInit(): void
  {
    this.checkIfIsInCompare();
  }

  ngOnChanges(changes: SimpleChanges): void
  {
    if (changes.compareIdList && !changes.compareIdList.firstChange)
    {
      this.checkIfIsInCompare();
    }
  }

  onCompareClick(isCompare: boolean)
  {
    if (this.compareClickEventEmitter.observers.length > 0)
    {
      this.compareClickEventEmitter.emit(isCompare);
    }
  }

  onDelete()
  {
    if (this.deleteEventEmitter.observers.length > 0)
    {
      this.deleteEventEmitter.emit(this.roiAggregateDto);
    }
  }


  private checkIfIsInCompare(): void
  {
    this.isInCompare = (this.compareIdList.filter((item: string) => item === this.roiAggregateDto.id).length > 0);
  }

}

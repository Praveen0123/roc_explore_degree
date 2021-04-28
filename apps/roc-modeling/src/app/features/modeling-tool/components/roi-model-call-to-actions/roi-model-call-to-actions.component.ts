import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { RoiAggregateDto } from '@app/domain';


@Component({
  selector: 'roc-roi-model-call-to-actions',
  templateUrl: './roi-model-call-to-actions.component.html',
  styleUrls: ['./roi-model-call-to-actions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoiModelCallToActionsComponent implements OnInit, OnChanges
{
  @Input() roiAggregateDto: RoiAggregateDto;
  @Input() savedIdList: string[];

  @Output('onToggleSave') toggleSaveEventEmitter = new EventEmitter<boolean>();
  @Output('onShareClick') shareClickEventEmitter = new EventEmitter<void>();

  isSaved: boolean;
  savedTitle: string;
  savedFontSet: string;
  savedFontIcon: string;

  constructor() { }

  ngOnInit(): void
  {
    this.checkIfSaved();
  }

  ngOnChanges(changes: SimpleChanges): void
  {
    if (changes.savedIdList && !changes.savedIdList.firstChange)
    {
      this.checkIfSaved();
    }
  }

  toggleSave()
  {
    if (this.toggleSaveEventEmitter.observers.length > 0)
    {
      this.toggleSaveEventEmitter.emit(!this.isSaved);
    }
  }

  onShareClick()
  {
    if (this.shareClickEventEmitter.observers.length > 0)
    {
      this.shareClickEventEmitter.emit();
    }
  }

  private checkIfSaved(): void
  {
    this.isSaved = (this.savedIdList.filter((item: string) => item === this.roiAggregateDto.id).length > 0);
  }
}

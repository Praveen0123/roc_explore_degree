import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AccordionFacadeService } from '@app/+state/accordion/facade.service';
import { AccordionPanelEnum, AccordionState } from '@app/+state/accordion/state';
import { RoiModelFacadeService } from '@app/+state/roi-model';
import { CareerGoalForm, CurrentInformationForm, EducationCostForm } from '@app/core/models';
import { EducationFinancingDto, RoiAggregateDto } from '@app/domain';
import { SavedFacadeService } from '@state/saved/facade.service';
import { UserProfileFacadeService } from '@state/user-profile/facade.service';
import { UserProfileModel } from '@state/user-profile/models';
import { Observable } from 'rxjs';

@Component({
  selector: 'roc-modeling-tool',
  templateUrl: './modeling-tool.component.html',
  styleUrls: ['./modeling-tool.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModelingToolComponent implements OnInit
{
  userProfileModel$: Observable<UserProfileModel>;
  roiModel$: Observable<RoiAggregateDto>;
  accordionState$: Observable<AccordionState>;
  savedIdList$: Observable<string[] | number[]>;

  constructor
    (
      private userProfileFacade: UserProfileFacadeService,
      private roiModelFacadeService: RoiModelFacadeService,
      private accordionFacadeService: AccordionFacadeService,
      private savedFacadeService: SavedFacadeService
    ) { }

  ngOnInit(): void
  {
    this.userProfileModel$ = this.userProfileFacade.selectUserProfile$;
    this.roiModel$ = this.roiModelFacadeService.getSelectedRoiModel$();
    this.accordionState$ = this.accordionFacadeService.getSelectedAccordionModel$();
    this.savedIdList$ = this.savedFacadeService.getSavedIdList$();
  }

  onCurrentInformationSubmitted(currentInformationForm: CurrentInformationForm)
  {
    this.roiModelFacadeService.processCurrentInformationForm(currentInformationForm);
    this.accordionFacadeService.setCurrentInformationValidity(currentInformationForm.isValid);
  }

  markCurrentInformationAsInitialized()
  {
    this.userProfileFacade.markCurrentInformationAsInitialized();
  }

  onCareerGoalSubmitted(careerGoalForm: CareerGoalForm)
  {
    this.roiModelFacadeService.processCareerGoalForm(careerGoalForm);
    this.accordionFacadeService.setCareerGoalValidity(careerGoalForm.isValid);
  }

  onEducationCostSubmitted(educationCostForm: EducationCostForm)
  {
    this.roiModelFacadeService.processEducationCostForm(educationCostForm);
    this.accordionFacadeService.setEducationCostValidity(educationCostForm.isValid);
  }

  onEducationFinancingSubmitted(educationFinancing: EducationFinancingDto)
  {
    this.roiModelFacadeService.processEducationFinancingForm(educationFinancing);
  }

  onReset()
  {
    this.userProfileFacade.resetUserProfile();
    this.roiModelFacadeService.requestResetRoiModel();
    this.accordionFacadeService.resetAccordion();
  }

  onPanelChange(accordionPanelEnum: AccordionPanelEnum)
  {
    this.accordionFacadeService.setActivePanel(accordionPanelEnum);
  }

  onToggleSave(isSaved: boolean, roiAggregateDto: RoiAggregateDto)
  {
    if (isSaved)
    {
      this.savedFacadeService.addToSaved(roiAggregateDto);
    }
    else
    {
      this.savedFacadeService.removeFromSaved(roiAggregateDto);
    }
  }

  onShareClick(roiAggregateDto: RoiAggregateDto)
  {
    console.log('SHARE MODEL', roiAggregateDto);
  }

}

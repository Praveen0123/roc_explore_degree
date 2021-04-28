import { Injectable } from '@angular/core';
import { CareerGoalForm, CurrentInformationForm, EducationCostForm } from '@app/core/models';
import { EducationFinancingDto, RoiAggregateDto } from '@app/domain';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import {
  addRoiModel,
  deleteRoiModel,
  loadSelectedRoiModelOrCreateANewOne,
  processCareerGoalForm,
  processCurrentInformationForm,
  processEducationCostForm,
  processEducationFinancingForm,
  removeSelectedRoiModel,
  requestResetRoiModel,
  updateRoiModelFromCareerGoal,
  updateRoiModelFromCurrentInformation,
  updateRoiModelFromEducationCost,
  updateRoiModelFromEducationFinancing,
} from './actions';
import { getRoiModelList, getSelectedRoiModel } from './selectors';


@Injectable({
  providedIn: 'root'
})
export class RoiModelFacadeService
{

  constructor
    (
      private store: Store
    )
  {
  }

  loadSelectedRoiModelOrCreateANewOne()
  {
    return this.store.dispatch(loadSelectedRoiModelOrCreateANewOne());
  }

  addRoiModel(roiAggregateDto: RoiAggregateDto)
  {
    return this.store.dispatch(addRoiModel({ roiAggregateDto }));
  }


  updateRoiModelFromCurrentInformation(roiAggregateDto: RoiAggregateDto)
  {
    return this.store.dispatch(updateRoiModelFromCurrentInformation({ roiAggregateDto }));
  }
  updateRoiModelFromCareerGoal(roiAggregateDto: RoiAggregateDto)
  {
    return this.store.dispatch(updateRoiModelFromCareerGoal({ roiAggregateDto }));
  }
  updateRoiModelFromEducationCost(roiAggregateDto: RoiAggregateDto)
  {
    return this.store.dispatch(updateRoiModelFromEducationCost({ roiAggregateDto }));
  }
  updateRoiModelFromEducationFinancing(roiAggregateDto: RoiAggregateDto)
  {
    return this.store.dispatch(updateRoiModelFromEducationFinancing({ roiAggregateDto }));
  }


  deleteRoiModel(roiAggregateDto: RoiAggregateDto)
  {
    return this.store.dispatch(deleteRoiModel({ roiAggregateDto }));
  }

  removeSelectedRoiModel()
  {
    return this.store.dispatch(removeSelectedRoiModel());
  }


  getRoiModelList$(): Observable<RoiAggregateDto[]>
  {
    return this.store.pipe(select(getRoiModelList));
  }

  getSelectedRoiModel$(): Observable<RoiAggregateDto>
  {
    return this.store.pipe(select(getSelectedRoiModel));
  }


  processCurrentInformationForm(currentInformationForm: CurrentInformationForm): void
  {
    this.store.dispatch(processCurrentInformationForm({ currentInformationForm }));
  }
  processCareerGoalForm(careerGoalForm: CareerGoalForm): void
  {
    this.store.dispatch(processCareerGoalForm({ careerGoalForm }));
  }
  processEducationCostForm(educationCostForm: EducationCostForm): void
  {
    this.store.dispatch(processEducationCostForm({ educationCostForm }));
  }
  processEducationFinancingForm(educationFinancingForm: EducationFinancingDto): void
  {
    this.store.dispatch(processEducationFinancingForm({ educationFinancingForm }));
  }


  requestResetRoiModel()
  {
    return this.store.dispatch(requestResetRoiModel());
  }


}

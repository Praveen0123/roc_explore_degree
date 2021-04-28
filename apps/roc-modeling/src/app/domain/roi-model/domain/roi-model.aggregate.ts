import { AggregateRoot, Guard, Result, UniqueEntityID } from '@vantage-point/ddd-core';

import { CareerGoalDto, CurrentInformationDto, EducationCostDto, EducationFinancingDto } from '../dtos';
import { CurrentInformationMapper } from '../mappers/current-information.mapper';
import { RoiCalculatorInput, RoiCalculatorOutputModel } from '../models';
import { CurrentInformation } from './current-information.model';
import { RoiModel } from './roi-model';
import { RoiModelAggregateId } from './roi-model-aggregate.id';
import { RoiModelId } from './roi-model.id';


interface RoiAggregateProps
{
  currentInformation?: CurrentInformation;
  roiModel?: RoiModel;
}


export class RoiAggregate extends AggregateRoot<RoiAggregateProps>
{
  private _roiModelAggregateId: RoiModelAggregateId;
  private _activeRoiModelId: RoiModelId;
  private store: Map<RoiModelId, RoiModel> = new Map();


  get roiModelAggregateId(): RoiModelAggregateId
  {
    return this._roiModelAggregateId;
  }
  get currentInformation(): CurrentInformation
  {
    return this.props.currentInformation;
  }
  get name(): string
  {
    return this.activeRoiModel.name;
  }
  get activeRoiModel(): RoiModel
  {
    if (this.store.has(this._activeRoiModelId))
    {
      return this.store.get(this._activeRoiModelId);
    }

    return null;
  }
  get roiCalculatorInput(): RoiCalculatorInput
  {
    return this.activeRoiModel.roiCalculatorInput;
  }


  private constructor(props: RoiAggregateProps, id?: UniqueEntityID)
  {
    super(props, id);

    this._roiModelAggregateId = RoiModelAggregateId.create(this._id);

    this.addNewRoiModel(props.roiModel);
  }

  static create(props: RoiAggregateProps, id?: UniqueEntityID): Result<RoiAggregate>
  {
    const propsResult = Guard.againstNullOrUndefinedBulk(
      [
      ]);

    if (!propsResult.succeeded)
    {
      return Result.failure<RoiAggregate>(propsResult.message || 'roi model properties error');
    }

    const roiModelAggregate = new RoiAggregate
      (
        {
          ...props,
          roiModel: props.roiModel ?? RoiAggregate.createEmptyRoiModel()
        },
        id
      );

    return Result.success<RoiAggregate>(roiModelAggregate);
  }

  private static createEmptyRoiModel(name?: string): RoiModel
  {
    const roiModelOrError: Result<RoiModel> = RoiModel.create
      (
        {
          name: name,
          careerGoal: null,
          educationCost: null,
          educationCostRefinement: null,
          educationFinancing: null,
          radiusInMiles: null,
          dateCreated: null,
          lastUpdated: null
        }
      );

    return roiModelOrError.getValue();
  }



  addNewRoiModel(roiModel: RoiModel)
  {
    this._activeRoiModelId = roiModel.roiModelId;
    this.store.set(roiModel.roiModelId, roiModel);
  }
  removeRoiModel(roiModel: RoiModel)
  {
    this.store.delete(roiModel.roiModelId);

    // LOAD NEXT ROI MODEL
    if (this.store.size > 1)
    {
      const iterator_obj = this.store.entries();
      const nextRoiModel: RoiModel = iterator_obj.next().value;
      this._activeRoiModelId = nextRoiModel.roiModelId;
    }

    //ELSE, CREATE AN EMPTY ROI MODEL
    else
    {
      this.addNewRoiModel(RoiAggregate.createEmptyRoiModel());
    }
  }


  updateCurrentInformation(currentInformationDto: CurrentInformationDto): void
  {
    const successOrError: Result<CurrentInformation> = CurrentInformationMapper.create().toDomain(currentInformationDto);

    if (successOrError.isSuccess)
    {
      this.props.currentInformation = successOrError.getValue();
    }
    else
    {
      throw successOrError.getError();
    }
  }
  updateCareerGoal(careerGoalDto: CareerGoalDto): void
  {
    this.activeRoiModel.updateCareerGoal(careerGoalDto);
  }
  updateEducationCost(educationCostDto: EducationCostDto): void
  {
    this.activeRoiModel.updateEducationCost(educationCostDto);
  }
  updateEducationFinancing(educationFinancingDto: EducationFinancingDto): void
  {
    this.activeRoiModel.updateEducationFinancing(educationFinancingDto);
  }
  calculateRoiCalculatorInput(): Promise<boolean>
  {
    return this.activeRoiModel.calculateRoiCalculatorInput(this.props.currentInformation).then((shouldCalculatorRun: boolean) =>
    {
      if (!this.isCurrentInformationValid())
      {
        return false;
      }

      return shouldCalculatorRun;
    });
  }
  updateRoiCalculatorOutput(roiCalculatorOutput: RoiCalculatorOutputModel): void
  {
    this.activeRoiModel.updateRoiCalculatorOutput(roiCalculatorOutput);
  }


  isCurrentInformationValid(): boolean
  {
    return this.props.currentInformation.isValid();
  }
  isCareerGoalValid(): boolean
  {
    return this.activeRoiModel.isCareerGoalValid();
  }
  isEducationCostValid(): boolean
  {
    return this.activeRoiModel.isEducationCostValid();
  }


  annualCostOfAttendance(): number
  {
    return this.activeRoiModel.annualCostOfAttendance();
  }
  cumulativeCostOfAttendance(): number
  {
    return this.activeRoiModel.cumulativeCostOfAttendance();
  }
  outOfPocketExpensesByYear(): number[]
  {
    return this.activeRoiModel.outOfPocketExpensesByYear();
  }

}

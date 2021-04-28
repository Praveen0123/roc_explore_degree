import { CONFIG } from '@app/config/config';
import { EducationLevelEnum } from '@app/core/models';
import { Entity, Guard, Result, UniqueEntityID } from '@vantage-point/ddd-core';
import hash from 'object-hash';

import
{
  CareerGoalDto,
  EducationCostDto,
  EducationFinancingDto,
} from '../dtos';
import { CareerGoalMapper } from '../mappers/career-goal.mapper';
import { EducationCostMapper } from '../mappers/education-cost.mapper';
import { EducationFinancingMapper } from '../mappers/education-financing.mapper';
import { RoiCalculatorInput, RoiCalculatorOutputModel } from '../models';
import { CareerGoal } from './career-goal.model';
import { CurrentInformation } from './current-information.model';
import
{
  EducationCost,
  EducationCostRefinement,
} from './education-costs.model';
import { EducationFinancing } from './education-financing.model';
import { RoiModelId } from './roi-model.id';

interface RoiModelProps
{
  name: string;
  careerGoal?: CareerGoal;
  educationCost?: EducationCost;
  educationCostRefinement?: EducationCostRefinement;
  educationFinancing?: EducationFinancing;
  radiusInMiles?: number;
  dateCreated: Date;
  lastUpdated: Date;
}

export class RoiModel extends Entity<RoiModelProps> {
  private _roiModelId: RoiModelId;
  private _roiCalculatorInput: RoiCalculatorInput;
  private _roiCalculatorInputHash: string;
  private _roiCalculatorOutput: RoiCalculatorOutputModel;

  get roiModelId(): RoiModelId
  {
    return this._roiModelId;
  }
  get name(): string
  {
    return this.props.name;
  }
  get careerGoal(): CareerGoal
  {
    return this.props.careerGoal;
  }
  get educationCost(): EducationCost
  {
    return this.props.educationCost;
  }
  get educationCostRefinement(): EducationCostRefinement
  {
    return this.props.educationCostRefinement;
  }
  get educationFinancing(): EducationFinancing
  {
    return this.props.educationFinancing;
  }
  get roiCalculatorInput(): RoiCalculatorInput
  {
    return this._roiCalculatorInput;
  }
  get hash(): string
  {
    return this._roiCalculatorInputHash;
  }
  get roiCalculatorOutput(): RoiCalculatorOutputModel
  {
    return this._roiCalculatorOutput;
  }
  get radiusInMiles(): number
  {
    return this.props.radiusInMiles;
  }
  get dateCreated(): Date
  {
    return this.props.dateCreated;
  }
  get lastUpdated(): Date
  {
    return this.props.lastUpdated;
  }

  private constructor(props: RoiModelProps, id?: UniqueEntityID)
  {
    super(props, id);

    this._roiModelId = RoiModelId.create(this._id);
  }

  static create(props: RoiModelProps, id?: UniqueEntityID): Result<RoiModel>
  {
    const propsResult = Guard.againstNullOrUndefinedBulk([]);

    if (!propsResult.succeeded)
    {
      return Result.failure<RoiModel>(
        propsResult.message || 'roi model properties error'
      );
    }

    const roiModel = new RoiModel(
      {
        ...props,
        name: props.name ?? 'Default ROI Model',
        radiusInMiles:
          props.radiusInMiles ?? CONFIG.USER_PROFILE.RADIUS_IN_MILES,
        dateCreated: props.dateCreated ?? new Date(),
        lastUpdated: props.lastUpdated ?? new Date(),
      },
      id
    );

    return Result.success<RoiModel>(roiModel);
  }

  updateCareerGoal(careerGoalDto: CareerGoalDto): void
  {
    const successOrError: Result<CareerGoal> = CareerGoalMapper.create().toDomain(
      careerGoalDto
    );

    if (successOrError.isSuccess)
    {
      this.props.careerGoal = successOrError.getValue();

      let yearsOfCollege = CONFIG.EDUCATION_COST.YEARS_OF_COLLEGE_HIGH_SCHOOL;
      switch (this.props.careerGoal.degreeLevel)
      {
        case EducationLevelEnum.NinthGradeStudent:
        case EducationLevelEnum.TenthGradeStudent:
        case EducationLevelEnum.EleventhGradeStudent:
        case EducationLevelEnum.TwelfthDegreeStudent:
        case EducationLevelEnum.HighSchoolGraduate:
          yearsOfCollege = CONFIG.EDUCATION_COST.YEARS_OF_COLLEGE_HIGH_SCHOOL;
          break;
        case EducationLevelEnum.AssociatesDegree:
          yearsOfCollege =
            CONFIG.EDUCATION_COST.YEARS_OF_COLLEGE_ASSOCIATES_DEGREE;
          break;
        case EducationLevelEnum.BachelorsDegree:
          yearsOfCollege =
            CONFIG.EDUCATION_COST.YEARS_OF_COLLEGE_BACHELORS_DEGREE;
          break;
        case EducationLevelEnum.MastersDegree:
          yearsOfCollege =
            CONFIG.EDUCATION_COST.YEARS_OF_COLLEGE_MASTERS_DEGREE;
          break;
        case EducationLevelEnum.DoctorateDegree:
          yearsOfCollege =
            CONFIG.EDUCATION_COST.YEARS_OF_COLLEGE_DOCTORATE_DEGREE;
          break;
        default:
          yearsOfCollege = CONFIG.EDUCATION_COST.YEARS_OF_COLLEGE_HIGH_SCHOOL;
      }

      if (this.props.careerGoal?.occupation?.typicalEducationLevelGroupId)
      {
        const defaultEducationLevelEnum: EducationLevelEnum = EducationLevelEnum.getEducationLevelByGroupId(
          this.props.careerGoal?.occupation?.typicalEducationLevelGroupId
        );
        this.props.careerGoal.updateEducationLevelEnum(
          defaultEducationLevelEnum
        );
      }

      // SEED NUMBER OF YEARS TO COMPLETE DEGREE BASED ON DESIRED EDUCATION LEVEL
      this.props.educationCost.updateYearsToCompleteDegree(yearsOfCollege);

      this.setLastUpdated();
    } else
    {
      throw successOrError.getError();
    }
  }
  updateEducationCost(educationCostDto: EducationCostDto): void
  {
    const successOrError: Result<EducationCost> = EducationCostMapper.create().toDomain(
      educationCostDto
    );

    if (successOrError.isSuccess)
    {
      this.props.educationCost = successOrError.getValue();

      // CALCULATE DEFAULT OUT OF POCKET AMOUNT BASED ON INSTITUTION AND NUMBER OF YEARS TO COMPLETE DEGREE
      const outOfPocketExpensesByYear: number[] = this.outOfPocketExpensesByYear();

      this.props.educationFinancing.updateOutOfPocketExpensesByYear(outOfPocketExpensesByYear);

      this.updateRoiModelName(this.props.educationCost.institutionName);
      this.setLastUpdated();
    } else
    {
      throw successOrError.getError();
    }
  }
  updateEducationFinancing(educationFinancingDto: EducationFinancingDto): void
  {
    const successOrError: Result<EducationFinancing> = EducationFinancingMapper.create().toDomain(
      educationFinancingDto
    );

    if (successOrError.isSuccess)
    {
      this.props.educationFinancing = successOrError.getValue();

      this.setLastUpdated();
    } else
    {
      throw successOrError.getError();
    }
  }
  calculateRoiCalculatorInput(
    currentInformation: CurrentInformation
  ): Promise<boolean>
  {
    return new Promise(async (resolve, reject) =>
    {
      try
      {
        const careerGoal: CareerGoal = this.props.careerGoal;
        const educationCost: EducationCost = this.props.educationCost;
        const educationFinancing: EducationFinancing = this.props
          .educationFinancing;
        const endDegreeLevel: number =
          careerGoal.degreeLevel?.value && careerGoal.degreeLevel.value > 0
            ? careerGoal.degreeLevel.value
            : 0;
        const goalStateOnetCode: string[] = careerGoal.occupation?.onetCode
          ? [careerGoal.occupation.onetCode]
          : [];
        const startDegreeLevel: number =
          currentInformation.educationLevel?.value &&
            currentInformation.educationLevel.value > 0
            ? currentInformation.educationLevel.value
            : 0;

        const annualCostOfAttendance: number = this.annualCostOfAttendance();
        const outOfPocketExpensesByYear: number[] = this.outOfPocketExpensesByYear();

        const roiCalculatorInput: RoiCalculatorInput = {
          currentZipCode: currentInformation.location?.zipCode,
          goalZipCode:
            careerGoal.location?.zipCode ??
            currentInformation.location?.zipCode,
          distance: this.props.radiusInMiles,
          currentStateOnetCode: [currentInformation.occupation?.onetCode],
          currentStateOccupationTitle: currentInformation.occupation?.title,
          goalStateOnetCode: goalStateOnetCode,
          goalStateOccupationTitle: careerGoal.occupation?.title,
          startDegreeLevel: startDegreeLevel,
          endDegreeLevel: endDegreeLevel,
          yearsOfCollege: educationCost.yearsToCompleteDegree,
          yearsToRetirement: Math.max(
            careerGoal.retirementAge - currentInformation.currentAge,
            1
          ),
          avgNetPrice: annualCostOfAttendance,
          avgNetPriceRaise: 0,
          livingCost: 0,
          livingCostRaise: 0,
          monthsToPayoffFederalLoan:
            educationFinancing.yearsToPayOffFederalLoan * 12,
          monthsToPayoffPrivateLoan:
            educationFinancing.yearsToPayOffPrivateLoan * 12,
          annualExpenseFromSavings: outOfPocketExpensesByYear,
          efc: null,
          participation: educationCost.isFulltime ? 1 : 0.5,
          workDuringStudy: false,
          ipedsGraduationTimeFactor: [1.0, 1.5, 2.0],
          ipedsGraduationProbability: [1.0, 1.0, 1.0],
          ipedsRetentionRate: [1.0, 1.0, 1.0],
        };

        const newHash: string = this.toHash(roiCalculatorInput);

        if (newHash !== this._roiCalculatorInputHash)
        {
          this._roiCalculatorInputHash = newHash;
          this._roiCalculatorInput = roiCalculatorInput;
          resolve(true);
        }

        resolve(false);
      } catch (error)
      {
        reject(error);
      }
    });
  }
  updateRoiCalculatorOutput(
    roiCalculatorOutput: RoiCalculatorOutputModel
  ): void
  {
    this._roiCalculatorOutput = roiCalculatorOutput;
  }

  isCareerGoalValid(): boolean
  {
    return this.props.careerGoal?.isValid() ?? false;
  }
  isEducationCostValid(): boolean
  {
    return this.props.educationCost?.isValid() ?? false;
  }

  annualCostOfAttendance(): number
  {
    return this.props.educationCost?.annualCostOfAttendance() ?? 0;
  }

  cumulativeCostOfAttendance(): number
  {
    return (
      this.props.educationCost?.cumulativeCostOfAttendance() ?? 0
    );
  }

  outOfPocketExpensesByYear(): number[]
  {
    const yearsToCompleteDegree: number =
      this.props.educationCost?.yearsToCompleteDegree ?? 0;

    if (yearsToCompleteDegree > 0)
    {
      if (this.props.educationFinancing?.outOfPocketExpensesByYear?.length)
      {
        return this.props.educationFinancing.outOfPocketExpensesByYear;
      } else
      {
        return new Array(yearsToCompleteDegree).fill(this.annualCostOfAttendance());
      }
    }

    return [0];
  }

  updateRoiModelName(name: string)
  {
    this.props.name = name;
  }

  private setLastUpdated(): void
  {
    this.props.lastUpdated = new Date();
  }

  private toHash(roiCalculatorInput: RoiCalculatorInput): string
  {
    return hash(roiCalculatorInput);
  }
}

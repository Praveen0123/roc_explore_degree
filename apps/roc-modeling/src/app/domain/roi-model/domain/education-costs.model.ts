import { CONFIG } from '@app/config/config';
import
{
  IncomeRangeEnum,
  LivingConditionTypeEnum,
  ResidencyTypeEnum,
} from '@app/core/models';
import { CostOfAttendanceInfo, Institution } from '@gql';
import { Entity, Guard, Result } from '@vantage-point/ddd-core';

interface EducationCostProps
{
  institution: Institution;
  startYear: number;
  incomeRange: IncomeRangeEnum;
  isFulltime: boolean;
  yearsToCompleteDegree: number;
}

export class EducationCost extends Entity<EducationCostProps> {
  get institution(): Institution
  {
    return this.props.institution;
  }
  get institutionName(): string
  {
    return this.props.institution.name;
  }
  get startYear(): number
  {
    return this.props.startYear;
  }
  get incomeRange(): IncomeRangeEnum
  {
    return this.props.incomeRange;
  }
  get isFulltime(): boolean
  {
    return this.props.isFulltime;
  }
  get yearsToCompleteDegree(): number
  {
    return this.props.yearsToCompleteDegree;
  }

  private constructor(props: EducationCostProps)
  {
    super(props);
  }

  public static create(props: EducationCostProps): Result<EducationCost>
  {
    const propsResult = Guard.againstNullOrUndefinedBulk([
      // { argument: props.institution, argumentName: 'institution' },
      // { argument: props.startYear, argumentName: 'start year' }
    ]);

    if (!propsResult.succeeded)
    {
      return Result.failure<EducationCost>(
        propsResult.message || 'education cost properties error'
      );
    }

    const careerGoal = new EducationCost({
      ...props,
      startYear: props.startYear ?? new Date().getFullYear(),
      incomeRange: props.incomeRange ?? IncomeRangeEnum.UNKNOWN,
      isFulltime: props.isFulltime ?? true,
      yearsToCompleteDegree:
        props.yearsToCompleteDegree ??
        CONFIG.EDUCATION_COST.YEARS_TO_COMPLETE_DEFAULT,
    });

    return Result.success<EducationCost>(careerGoal);
  }

  updateYearsToCompleteDegree(yearsToComplete: number)
  {
    this.props.yearsToCompleteDegree = yearsToComplete;
  }

  isValid(): boolean
  {
    const hasInstitution: boolean =
      this.props.institution !== null && this.props.institution !== undefined;
    const hasStartYear: boolean =
      this.props.startYear !== null && this.props.startYear !== undefined;
    const hasIncomeRange: boolean =
      this.props.incomeRange !== null && this.props.incomeRange !== undefined;

    return hasInstitution && hasStartYear && hasIncomeRange;
  }

  annualCostOfAttendance(): number
  {
    const costOfAttendanceInfo: CostOfAttendanceInfo = this.props.institution
      ?.costOfAttendanceInfo;

    let costOfAttendance = 0;
    if (costOfAttendanceInfo)
    {
      const tuitionAndFees =
        costOfAttendanceInfo.tuitionAndFees.inDistrict.expenseAmount ??
        costOfAttendanceInfo.tuitionAndFees.inState.expenseAmount ??
        costOfAttendanceInfo.tuitionAndFees.outOfState.expenseAmount ??
        0;

      const booksAndSupplies =
        costOfAttendanceInfo.booksAndSupplies.expenseAmount ?? 0;

      const roomAndBoard =
        costOfAttendanceInfo.livingArrangement.onCampus.roomAndBoard.expenseAmount ??
        costOfAttendanceInfo.livingArrangement.offCampusNotWithFamily
          .roomAndBoard.expenseAmount ??
        0;

      const otherLivingArrangementExpenses =
        costOfAttendanceInfo.livingArrangement.onCampus.otherExpenses.expenseAmount ??
        costOfAttendanceInfo.livingArrangement.offCampusNotWithFamily
          .otherExpenses.expenseAmount ??
        costOfAttendanceInfo.livingArrangement.offCampusWithFamily
          .otherExpenses.expenseAmount ?? 0;

      costOfAttendance =
        tuitionAndFees +
        booksAndSupplies +
        roomAndBoard +
        otherLivingArrangementExpenses;
    }

    return costOfAttendance;
  }

  cumulativeCostOfAttendance(): number
  {
    const annualCostOfAttendance: number = this.annualCostOfAttendance();
    return annualCostOfAttendance * this.props.yearsToCompleteDegree;
  }
}

/* #region  EDUCATION COST REFINEMENTS */

export interface EducationCostRefinement
{
  residencyType: ResidencyTypeEnum;
  livingConditionTypeEnum: LivingConditionTypeEnum;
  costOfAttendance: CostOfAttendance;
  grantsAndScholarships: GrantsAndScholarships;
}
export interface CostOfAttendance
{
  tuitionAndFees: number;
  booksAndSupplies: number;
  roomAndBoard: number;
  otherExpenses: number;
}
export interface GrantsAndScholarships
{
  federalPellGrant: number;
  otherFederalGrants: number;
  stateOrLocalGrants: number;
  institutionalGrants: number;
  otherGrants: number;
  giBillBenefits: number;
  dodTuitionAssistance: number;
}

/* #endregion */

const LOAN_CONSTANTS = {
  DEPENDENT: {
    FEDERAL_SUBSIDIZED: {
      YEAR_1: 3500,
      YEAR_2: 4500,
      YEAR_3_PLUS: 5500,
      TOTAL: 23000,
    },
    FEDERAL_UNSUBSIDIZED: {
      YEAR_1: 2000,
      YEAR_2: 2000,
      YEAR_3_PLUS: 2000,
      TOTAL: 8000,
    },
  },
  INDEPENDENT: {
    FEDERAL_SUBSIDIZED: {
      YEAR_1: 3500,
      YEAR_2: 4500,
      YEAR_3_PLUS: 7500,
      TOTAL: 23000,
    },
    FEDERAL_UNSUBSIDIZED: {
      YEAR_1: 6000,
      YEAR_2: 6000,
      YEAR_3_PLUS: 7000,
      TOTAL: 34500,
    },
  },
} as const;

export const getPellGrantAid = (
  costOfAttendance: number,
  efc: number,
  participation: number
) =>
{
  let maxLimit;
  if (participation === 1)
  {
    maxLimit = 5711;
  } else
  {
    maxLimit = 5100;
  }

  let r = (costOfAttendance - efc) * participation;

  if (r < 638) r = 0;
  else if (r > maxLimit) r = maxLimit;

  return r;
};

const computeNewLoans = (
  cumulativeUpToCurrentYearInfo: CumulativeUpToCurrentYearInfo,
  costOfAttendance: number,
  outOfPocketExpensesByYear: number[],
  isTaxIndependent: boolean,
  efc: number,
  participation: number
) =>
{
  const pell = getPellGrantAid(costOfAttendance, efc, participation);
  const currentYearInCollege = cumulativeUpToCurrentYearInfo.yearsInCollege;
  let outOfPocketExpensesForCurrentYear: number;
  if (currentYearInCollege < outOfPocketExpensesByYear.length)
  {
    outOfPocketExpensesForCurrentYear = outOfPocketExpensesByYear[currentYearInCollege];
  } else
  {
    outOfPocketExpensesForCurrentYear = outOfPocketExpensesByYear[outOfPocketExpensesByYear.length - 1];
  }
  let enableSubsidized = false;
  if (costOfAttendance > efc)
  {
    enableSubsidized = true;
  }

  const m = costOfAttendance - outOfPocketExpensesForCurrentYear - pell;

  if (m < 0)
  {
    throw new Error('Too big expenseFromSavings');
  }

  let maxFederalSubsidizedAllowed = 0;
  let maxFederalUnsubsidizedAllowed = 0;
  let federalSubsidizedLoan = 0;
  let federalUnsubsidizedLoan = 0;
  let commercialLoan = 0;

  maxFederalSubsidizedAllowed = getLoanLimit(
    isTaxIndependent,
    currentYearInCollege
  ).yearSubsidized;
  maxFederalUnsubsidizedAllowed = getLoanLimit(
    isTaxIndependent,
    currentYearInCollege
  ).yearUnsubsidized;

  if (enableSubsidized)
  {
    const t =
      (isTaxIndependent
        ? LOAN_CONSTANTS.INDEPENDENT.FEDERAL_SUBSIDIZED.TOTAL
        : LOAN_CONSTANTS.DEPENDENT.FEDERAL_SUBSIDIZED.TOTAL) -
      cumulativeUpToCurrentYearInfo.totalLoanSubsidizedFederal;

    if (t <= 0.0) maxFederalSubsidizedAllowed = 0.0;

    if (t < maxFederalSubsidizedAllowed) maxFederalSubsidizedAllowed = t;

    federalSubsidizedLoan = maxFederalSubsidizedAllowed;
  }

  const t1 = m - federalSubsidizedLoan;

  if (t1 <= 0.0)
  {
    commercialLoan = 0.0;
    federalUnsubsidizedLoan = 0.0;
    federalSubsidizedLoan = m;
  } else
  {
    const t2 =
      (isTaxIndependent
        ? LOAN_CONSTANTS.INDEPENDENT.FEDERAL_UNSUBSIDIZED.TOTAL
        : LOAN_CONSTANTS.DEPENDENT.FEDERAL_UNSUBSIDIZED.TOTAL) -
      cumulativeUpToCurrentYearInfo.totalLoanUnsubsidizedFederal;

    if (t2 <= 0) maxFederalUnsubsidizedAllowed = 0.0;

    if (t2 < maxFederalUnsubsidizedAllowed) maxFederalUnsubsidizedAllowed = t2;

    federalUnsubsidizedLoan = maxFederalUnsubsidizedAllowed;

    const t3 = m - federalSubsidizedLoan - federalUnsubsidizedLoan;

    if (t3 <= 0.0)
    {
      commercialLoan = 0;
      federalUnsubsidizedLoan = m - federalSubsidizedLoan;
    } else
    {
      commercialLoan = t3;
    }
  }

  const result = {
    pell: pell,
    federalSubsidizedLoan: federalSubsidizedLoan,
    federalUnsubsidizedLoan: federalUnsubsidizedLoan,
    commercialLoan: commercialLoan,
  } as const;

  return result;
};

interface CumulativeUpToCurrentYearInfo
{
  totalLoanSubsidizedFederal: number;
  totalLoanUnsubsidizedFederal: number;
  yearsInCollege: number;
}

export interface ModelLoanOutput
{
  federalSubsidizedLoanAmountByYear: number[];
  federalUnsubsidizedLoanAmountByYear: number[];
  federalLoanAmountByYear: number[];
  privateLoanAmountByYear: number[];
  pellGrantAidByYear: number[];
}

export interface CostOfAttendanceComponents
{
  tuitionAndFees: number;
  tuitionAndFeesRaise: number;
  booksAndSupplies: number;
  booksAndSuppliesRaise: number;
  roomAndBoard: number;
  roomAndBoardRaise: number;
  otherLivingExpenses: number;
  otherLivingExpensesRaise: number;
}

export const getCostOfAttendanceByYear = (
  components: CostOfAttendanceComponents,
  numYears: number
) =>
{
  const result = [];

  for (let yearIndex = 0; yearIndex < numYears; yearIndex++)
  {
    const costOfAttendanceForCurrentYear = (components.tuitionAndFees * Math.pow(1.0 + components.tuitionAndFeesRaise, yearIndex))
      + (components.booksAndSupplies * Math.pow(1.0 + components.booksAndSuppliesRaise, yearIndex))
      + (components.roomAndBoard * Math.pow(1.0 + components.roomAndBoardRaise, yearIndex))
      + (components.otherLivingExpenses * Math.pow(1.0 + components.otherLivingExpensesRaise, yearIndex));
    // console.log('tuition', components.tuitionAndFees * Math.pow(1.0 + components.tuitionAndFeesRaise, yearIndex));
    // console.log('booksAndSupplies', components.booksAndSupplies * Math.pow(1.0 + components.booksAndSuppliesRaise, yearIndex));
    // console.log('roomAndBoard', components.roomAndBoard * Math.pow(1.0 + components.roomAndBoardRaise, yearIndex));
    // console.log('otherLivingExpenses', components.otherLivingExpenses * Math.pow(1.0 + components.otherLivingExpensesRaise, yearIndex));
    // console.log(`🚀 ~ file: loan.ts ~ line 198 ~ costOfAttendanceForCurrentYear: ${yearIndex}`, costOfAttendanceForCurrentYear);

    result.push(costOfAttendanceForCurrentYear);
  }

  return result;
};

export const getAvgNetPriceExcludingPellGrantByYear = (
  costOfAttendanceByYear: number[],
  grantOrScholarshipAidExcludingPellGrant: number,
  numYears: number
) =>
{
  const result = [];

  for (let yearIndex = 0; yearIndex < numYears; yearIndex++)
  {
    result.push(costOfAttendanceByYear[yearIndex] - grantOrScholarshipAidExcludingPellGrant);
  }

  return result;
};



export const modelLoans = (
  costOfAttendanceComponents: CostOfAttendanceComponents,
  outOfPocketExpensesByYear: number[],
  numYears: number,
  isTaxIndependent: boolean,
  efc: number,
  participation: number
) =>
{

  if (efc === null)
  {
    efc = 1e20;
  }

  const output: ModelLoanOutput = {
    federalSubsidizedLoanAmountByYear: [],
    federalUnsubsidizedLoanAmountByYear: [],
    federalLoanAmountByYear: [],
    privateLoanAmountByYear: [],
    pellGrantAidByYear: [],
  };

  const currentYearInfo: CumulativeUpToCurrentYearInfo = {
    totalLoanSubsidizedFederal: 0,
    totalLoanUnsubsidizedFederal: 0,
    yearsInCollege: 0,
  };

  const costOfAttendanceForCurrentYear = getCostOfAttendanceByYear(costOfAttendanceComponents, numYears);

  for (let i = 0; i < numYears; i++)
  {
    currentYearInfo.yearsInCollege = i;


    const res = computeNewLoans(
      currentYearInfo,
      costOfAttendanceForCurrentYear[i],
      outOfPocketExpensesByYear,
      isTaxIndependent,
      efc,
      participation
    );

    output.pellGrantAidByYear.push(res.pell);
    output.federalSubsidizedLoanAmountByYear.push(res.federalSubsidizedLoan);
    output.federalUnsubsidizedLoanAmountByYear.push(res.federalUnsubsidizedLoan);
    output.privateLoanAmountByYear.push(res.commercialLoan);
    output.federalLoanAmountByYear.push(
      res.federalSubsidizedLoan + res.federalUnsubsidizedLoan
    );

    currentYearInfo.totalLoanSubsidizedFederal += res.federalSubsidizedLoan;
    currentYearInfo.totalLoanUnsubsidizedFederal += res.federalUnsubsidizedLoan;
  }
  return output;
};

const getLoanLimit = (isTaxIndependent: boolean, year: number) =>
{
  let yearSubsidized;
  let yearUnsubsidized;

  if (isTaxIndependent)
  {
    if (year === 0)
    {
      yearSubsidized = LOAN_CONSTANTS.INDEPENDENT.FEDERAL_SUBSIDIZED.YEAR_1;
      yearUnsubsidized = LOAN_CONSTANTS.INDEPENDENT.FEDERAL_UNSUBSIDIZED.YEAR_1;
    } else if (year === 1)
    {
      yearSubsidized = LOAN_CONSTANTS.INDEPENDENT.FEDERAL_SUBSIDIZED.YEAR_2;
      yearUnsubsidized = LOAN_CONSTANTS.INDEPENDENT.FEDERAL_UNSUBSIDIZED.YEAR_2;
    } else
    {
      yearSubsidized =
        LOAN_CONSTANTS.INDEPENDENT.FEDERAL_SUBSIDIZED.YEAR_3_PLUS;
      yearUnsubsidized =
        LOAN_CONSTANTS.INDEPENDENT.FEDERAL_UNSUBSIDIZED.YEAR_3_PLUS;
    }
  } else
  {
    if (year === 0)
    {
      yearSubsidized = LOAN_CONSTANTS.DEPENDENT.FEDERAL_SUBSIDIZED.YEAR_1;
      yearUnsubsidized = LOAN_CONSTANTS.DEPENDENT.FEDERAL_UNSUBSIDIZED.YEAR_1;
    } else if (year === 1)
    {
      yearSubsidized = LOAN_CONSTANTS.DEPENDENT.FEDERAL_SUBSIDIZED.YEAR_2;
      yearUnsubsidized = LOAN_CONSTANTS.DEPENDENT.FEDERAL_UNSUBSIDIZED.YEAR_2;
    } else
    {
      yearSubsidized = LOAN_CONSTANTS.DEPENDENT.FEDERAL_SUBSIDIZED.YEAR_3_PLUS;
      yearUnsubsidized =
        LOAN_CONSTANTS.DEPENDENT.FEDERAL_UNSUBSIDIZED.YEAR_3_PLUS;
    }
  }

  const result = {
    yearSubsidized,
    yearUnsubsidized,
  } as const;

  return result;
};

export const modelLoansNoInflation = (
  costOfAttendance: number,
  outOfPocketExpensesByYear: number[],
  numYears: number,
  isTaxIndependent: boolean,
  efc: number,
  participation: number
) =>
{
  const output: ModelLoanOutput = {
    federalSubsidizedLoanAmountByYear: [],
    federalUnsubsidizedLoanAmountByYear: [],
    federalLoanAmountByYear: [],
    privateLoanAmountByYear: [],
    pellGrantAidByYear: [],
  };

  const cumulativeUptoCurrentYearInfo: CumulativeUpToCurrentYearInfo = {
    totalLoanSubsidizedFederal: 0,
    totalLoanUnsubsidizedFederal: 0,
    yearsInCollege: 0,
  };

  for (let i = 0; i < numYears; i++)
  {
    cumulativeUptoCurrentYearInfo.yearsInCollege = i;

    const res = computeNewLoans(
      cumulativeUptoCurrentYearInfo,
      costOfAttendance,
      outOfPocketExpensesByYear,
      isTaxIndependent,
      efc,
      participation
    );

    output.pellGrantAidByYear.push(res.pell);
    output.federalSubsidizedLoanAmountByYear.push(res.federalSubsidizedLoan);
    output.federalUnsubsidizedLoanAmountByYear.push(res.federalUnsubsidizedLoan);
    output.privateLoanAmountByYear.push(res.commercialLoan);
    output.federalLoanAmountByYear.push(
      res.federalSubsidizedLoan + res.federalUnsubsidizedLoan
    );

    cumulativeUptoCurrentYearInfo.totalLoanSubsidizedFederal += res.federalSubsidizedLoan;
    cumulativeUptoCurrentYearInfo.totalLoanUnsubsidizedFederal += res.federalUnsubsidizedLoan;
  }
  return output;
};

export interface ModelLoanLimits
{
  federalSubsidizedLoanByYear: number[];
  federalUnsubsidizedLoanByYear: number[];
  federalSubsidizedLoanTotal: number;
  federalUnsubsidizedLoanTotal: number;
}

export const getLoanLimits = (isTaxIndependent: boolean, numYears: number) =>
{
  const federalSubsidizedLoanByYear = [];
  const federalUnsubsidizedLoanByYear = [];

  for (let i = 0; i < numYears; i++)
  {
    const r = getLoanLimit(isTaxIndependent, i);
    federalSubsidizedLoanByYear.push(r.yearSubsidized);
    federalUnsubsidizedLoanByYear.push(r.yearUnsubsidized);
  }

  const output: ModelLoanLimits = {
    federalSubsidizedLoanByYear,
    federalUnsubsidizedLoanByYear,
    federalSubsidizedLoanTotal: isTaxIndependent
      ? LOAN_CONSTANTS.INDEPENDENT.FEDERAL_SUBSIDIZED.TOTAL
      : LOAN_CONSTANTS.DEPENDENT.FEDERAL_SUBSIDIZED.TOTAL,
    federalUnsubsidizedLoanTotal: isTaxIndependent
      ? LOAN_CONSTANTS.INDEPENDENT.FEDERAL_UNSUBSIDIZED.TOTAL
      : LOAN_CONSTANTS.DEPENDENT.FEDERAL_UNSUBSIDIZED.TOTAL,
  } as const;

  return output;
};

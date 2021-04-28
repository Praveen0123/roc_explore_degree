export interface RoiCalculatorInput
{
  currentZipCode: string;
  goalZipCode: string;
  distance: number;
  currentStateOnetCode: string[];
  currentStateOccupationTitle: string;
  goalStateOnetCode: string[];
  goalStateOccupationTitle: string;
  startDegreeLevel: number;
  endDegreeLevel: number;
  yearsOfCollege: number;
  yearsToRetirement: number;
  avgNetPrice: number;
  avgNetPriceRaise: number;
  livingCost: number;
  livingCostRaise: number;
  monthsToPayoffFederalLoan: number;
  monthsToPayoffPrivateLoan: number;
  annualExpenseFromSavings: number[];
  efc: number;
  participation: number;
  workDuringStudy: boolean;
  ipedsGraduationTimeFactor: number[];
  ipedsGraduationProbability: number[];
  ipedsRetentionRate: number[];
}

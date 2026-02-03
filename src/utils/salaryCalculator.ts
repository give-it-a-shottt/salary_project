import {
  type DailyWorkRecord,
  type MonthlySettings,
  type TaxCalculation,
  type MonthlySalary,
} from "../types/salary";

/**
 * 일일 근무에 대한 급여를 계산합니다
 */
export const calculateDailyPay = (
  record: DailyWorkRecord,
  settings: MonthlySettings,
) => {
  const regularPay = record.regularHours * settings.hourlyWage;
  const overtimePay =
    record.overtimeHours * settings.hourlyWage * settings.overtimeRate;
  const nightPay = record.nightHours * settings.hourlyWage * settings.nightRate;
  const holidayPay =
    record.holidayHours * settings.hourlyWage * settings.holidayRate;

  return {
    regularPay,
    overtimePay,
    nightPay,
    holidayPay,
    totalPay: regularPay + overtimePay + nightPay + holidayPay,
  };
};

/**
 * 주휴수당을 계산합니다
 * 근무 일수 기준: (주 근무일수 / 5) × 8시간 × 시급
 * 주별로 개별 계산 후 합산
 */
export const calculateWeeklyHolidayAllowance = (
  workRecords: DailyWorkRecord[],
  hourlyWage: number,
): number => {
  // 주별로 근무일수 계산 (월요일 시작)
  const weeklyWorkDays = new Map<string, number>();

  workRecords.forEach((record) => {
    // 근무 시간이 0보다 크면 근무한 날로 계산
    if (record.regularHours > 0) {
      // Timezone 이슈 방지: 명시적으로 로컬 날짜 생성
      const [year, month, day] = record.date.split("-").map(Number);
      const date = new Date(year, month - 1, day);

      // 해당 주의 월요일 날짜를 키로 사용
      const weekKey = getWeekStart(date);
      const currentDays = weeklyWorkDays.get(weekKey) || 0;
      weeklyWorkDays.set(weekKey, currentDays + 1);
    }
  });

  // 각 주별로 주휴수당 계산
  let totalAllowance = 0;
  weeklyWorkDays.forEach((days) => {
    // 공식: (주 근무일수 / 5) × 8시간 × 시급
    // 예: 5일 근무 → (5/5) × 8 × 10,000 = 80,000원
    const weeklyAllowance = (days / 5) * 8 * hourlyWage;
    totalAllowance += weeklyAllowance;
  });

  return Math.floor(totalAllowance);
};

/**
 * 주의 시작일(월요일)을 YYYY-MM-DD 형식으로 반환합니다
 */
const getWeekStart = (date: Date): string => {
  const d = new Date(date);
  const day = d.getDay(); // 0=일요일, 1=월요일, ..., 6=토요일
  // 월요일까지의 거리 계산 (일요일인 경우 -6, 나머지는 1-day)
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);

  const year = d.getFullYear();
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const dayStr = d.getDate().toString().padStart(2, "0");

  return `${year}-${month}-${dayStr}`;
};

/**
 * 4대 보험 및 세금을 계산합니다
 */
export const calculateTax = (grossSalary: number): TaxCalculation => {
  // 1. 국민연금 (4.5%, 상한액 553만원 기준)
  const pensionBase = Math.min(grossSalary, 5530000);
  const nationalPension = Math.floor(pensionBase * 0.045);

  // 2. 건강보험 (3.545%)
  const healthInsurance = Math.floor(grossSalary * 0.03545);

  // 3. 장기요양보험 (건강보험의 12.95%)
  const longTermCare = Math.floor(healthInsurance * 0.1295);

  // 4. 고용보험 (0.9%)
  const employmentInsurance = Math.floor(grossSalary * 0.009);

  // 5. 소득세 계산 (간이세액표 기준 - 단순화)
  let incomeTax = 0;
  if (grossSalary <= 1060000) {
    incomeTax = 0;
  } else if (grossSalary <= 2100000) {
    incomeTax = Math.floor((grossSalary - 1060000) * 0.06);
  } else if (grossSalary <= 4200000) {
    incomeTax = Math.floor(62400 + (grossSalary - 2100000) * 0.15);
  } else if (grossSalary <= 8800000) {
    incomeTax = Math.floor(377400 + (grossSalary - 4200000) * 0.24);
  } else {
    incomeTax = Math.floor(1481400 + (grossSalary - 8800000) * 0.35);
  }

  // 6. 지방소득세 (소득세의 10%)
  const localIncomeTax = Math.floor(incomeTax * 0.1);

  const totalDeduction =
    nationalPension +
    healthInsurance +
    longTermCare +
    employmentInsurance +
    incomeTax +
    localIncomeTax;

  return {
    nationalPension,
    healthInsurance,
    longTermCare,
    employmentInsurance,
    incomeTax,
    localIncomeTax,
    totalDeduction,
  };
};

/**
 * 월별 급여를 계산합니다
 */
export const calculateMonthlySalary = (
  workRecords: DailyWorkRecord[],
  settings: MonthlySettings,
): MonthlySalary => {
  // 근무 시간 통계
  let totalRegularHours = 0;
  let totalOvertimeHours = 0;
  let totalNightHours = 0;
  let totalHolidayHours = 0;
  let totalWorkDays = 0;

  // 급여 계산
  let regularPay = 0;
  let overtimePay = 0;
  let nightPay = 0;
  let holidayPay = 0;

  workRecords.forEach((record) => {
    const dailyPay = calculateDailyPay(record, settings);

    totalRegularHours += record.regularHours;
    totalOvertimeHours += record.overtimeHours;
    totalNightHours += record.nightHours;
    totalHolidayHours += record.holidayHours;

    if (
      record.regularHours > 0 ||
      record.overtimeHours > 0 ||
      record.nightHours > 0 ||
      record.holidayHours > 0
    ) {
      totalWorkDays++;
    }

    regularPay += dailyPay.regularPay;
    overtimePay += dailyPay.overtimePay;
    nightPay += dailyPay.nightPay;
    holidayPay += dailyPay.holidayPay;
  });

  // 주휴수당 계산 (주별로 계산)
  const weeklyHolidayAllowance = calculateWeeklyHolidayAllowance(
    workRecords,
    settings.hourlyWage,
  );

  const grossSalary =
    regularPay + overtimePay + nightPay + holidayPay + weeklyHolidayAllowance;
  const taxCalculation = calculateTax(grossSalary);
  const netSalary = grossSalary - taxCalculation.totalDeduction;

  return {
    year: settings.year,
    month: settings.month,
    settings,
    totalRegularHours,
    totalOvertimeHours,
    totalNightHours,
    totalHolidayHours,
    totalWorkDays,
    regularPay,
    overtimePay,
    nightPay,
    holidayPay,
    weeklyHolidayAllowance,
    grossSalary,
    taxCalculation,
    netSalary,
    workRecords,
  };
};

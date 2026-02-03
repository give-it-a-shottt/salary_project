// 월급 계산기 타입 정의

// 일일 근무 기록
export interface DailyWorkRecord {
  id?: string;
  date: string; // YYYY-MM-DD 형식
  regularHours: number; // 정규 근무 시간
  overtimeHours: number; // 잔업 시간
  nightHours: number; // 야간 근무 시간
  holidayHours: number; // 휴일 근무 시간
  memo?: string; // 메모 (선택)
}

// 월별 설정 (시급, 수당률 등)
export interface MonthlySettings {
  year: number;
  month: number;
  hourlyWage: number; // 시급
  overtimeRate: number; // 잔업 수당 배율 (예: 1.5 = 150%)
  nightRate: number; // 야간 수당 배율 (예: 0.5 = 50% 추가)
  holidayRate: number; // 휴일 수당 배율 (예: 1.5 = 150%)
}

// 세금 계산 결과
export interface TaxCalculation {
  nationalPension: number; // 국민연금 (4.5%)
  healthInsurance: number; // 건강보험 (3.545%)
  longTermCare: number; // 장기요양보험 (건강보험의 12.95%)
  employmentInsurance: number; // 고용보험 (0.9%)
  incomeTax: number; // 소득세
  localIncomeTax: number; // 지방소득세 (소득세의 10%)
  totalDeduction: number; // 총 공제액
}

// 월별 급여 요약
export interface MonthlySalary {
  id?: string;
  year: number;
  month: number;
  settings: MonthlySettings;

  // 근무 통계
  totalRegularHours: number; // 총 정규 근무 시간
  totalOvertimeHours: number; // 총 잔업 시간
  totalNightHours: number; // 총 야간 근무 시간
  totalHolidayHours: number; // 총 휴일 근무 시간
  totalWorkDays: number; // 총 근무 일수

  // 급여 계산
  regularPay: number; // 정규 근무 급여
  overtimePay: number; // 잔업 수당
  nightPay: number; // 야간 수당
  holidayPay: number; // 휴일 수당
  weeklyHolidayAllowance: number; // 주휴수당
  grossSalary: number; // 총 급여 (세전)

  // 세금 및 공제
  taxCalculation: TaxCalculation;
  netSalary: number; // 실수령액

  // 근무 기록
  workRecords: DailyWorkRecord[];
}

import React from 'react';

interface SalaryResultProps {
  result: {
    nightShiftAllowance: number;
    totalAllowance: number;
    grossSalary: number;
    taxCalculation: {
      nationalPension: number;
      healthInsurance: number;
      longTermCare: number;
      employmentInsurance: number;
      incomeTax: number;
      localIncomeTax: number;
      totalDeduction: number;
    };
    totalDeduction: number;
    netSalary: number;
  } | null;
}

const SalaryResult: React.FC<SalaryResultProps> = ({ result }) => {
  if (!result) {
    return null;
  }

  // 숫자를 천 단위로 콤마를 찍어 포맷팅하는 함수
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ko-KR').format(Math.floor(num));
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 space-y-6">
      {/* 실수령액 강조 */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg p-6 shadow-lg">
        <h3 className="text-lg font-medium mb-2">실수령액</h3>
        <p className="text-4xl font-bold">
          {formatNumber(result.netSalary)}원
        </p>
      </div>

      {/* 수당 정보 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          수당 내역
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600">야간 수당</span>
            <span className="font-semibold text-blue-600">
              +{formatNumber(result.nightShiftAllowance)}원
            </span>
          </div>
          <div className="flex justify-between py-2 font-semibold">
            <span className="text-gray-800">총 수당</span>
            <span className="text-blue-600">
              +{formatNumber(result.totalAllowance)}원
            </span>
          </div>
        </div>
      </div>

      {/* 공제 내역 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          공제 내역
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600">국민연금 (4.5%)</span>
            <span className="text-red-600">
              -{formatNumber(result.taxCalculation.nationalPension)}원
            </span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600">건강보험 (3.545%)</span>
            <span className="text-red-600">
              -{formatNumber(result.taxCalculation.healthInsurance)}원
            </span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600">장기요양 (건보의 12.95%)</span>
            <span className="text-red-600">
              -{formatNumber(result.taxCalculation.longTermCare)}원
            </span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600">고용보험 (0.9%)</span>
            <span className="text-red-600">
              -{formatNumber(result.taxCalculation.employmentInsurance)}원
            </span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600">소득세</span>
            <span className="text-red-600">
              -{formatNumber(result.taxCalculation.incomeTax)}원
            </span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600">지방소득세 (소득세의 10%)</span>
            <span className="text-red-600">
              -{formatNumber(result.taxCalculation.localIncomeTax)}원
            </span>
          </div>
          <div className="flex justify-between py-3 pt-4 font-semibold text-lg">
            <span className="text-gray-800">총 공제액</span>
            <span className="text-red-600">
              -{formatNumber(result.totalDeduction)}원
            </span>
          </div>
        </div>
      </div>

      {/* 요약 정보 */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="space-y-3">
          <div className="flex justify-between py-2">
            <span className="text-gray-600">총 급여</span>
            <span className="font-semibold">
              {formatNumber(result.grossSalary)}원
            </span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-600">총 공제</span>
            <span className="font-semibold text-red-600">
              -{formatNumber(result.totalDeduction)}원
            </span>
          </div>
          <div className="h-px bg-gray-300 my-2"></div>
          <div className="flex justify-between py-2 text-lg">
            <span className="font-bold text-gray-800">실수령액</span>
            <span className="font-bold text-blue-600">
              {formatNumber(result.netSalary)}원
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalaryResult;

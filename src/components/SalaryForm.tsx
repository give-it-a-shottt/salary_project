import React, { useState } from "react";
import {
  type ShiftWork,
  type Allowance,
  type Deduction,
} from "../types/salary";
import { calculateFullSalary } from "../utils/salaryCalculator";

interface SalaryFormProps {
  onCalculate: (result: any) => void;
}

const SalaryForm: React.FC<SalaryFormProps> = ({ onCalculate }) => {
  // 상태 관리: useState 훅을 사용하여 폼 데이터를 관리합니다
  const [baseSalary, setBaseSalary] = useState<number>(0);
  const [nightShiftRate, setNightShiftRate] = useState<number>(0.5);

  // 3교대 근무 정보
  const [shiftWork, setShiftWork] = useState<ShiftWork>({
    dayShifts: 0,
    eveningShifts: 0,
    nightShifts: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // 폼 제출 시 페이지 새로고침 방지

    // 월급 계산 실행
    const result = calculateFullSalary(
      baseSalary,
      shiftWork,
      nightShiftRate,
      [], // 추가 수당 (나중에 구현)
      [], // 추가 공제 (나중에 구현)
    );

    // 부모 컴포넌트로 결과 전달
    onCalculate(result);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 제목 */}
        <h2 className="text-2xl font-bold text-gray-800 mb-6">월급 계산기</h2>

        {/* 기본급 입력 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            기본급 (원)
          </label>
          <input
            type="number"
            value={baseSalary || ""}
            onChange={(e) => setBaseSalary(Number(e.target.value))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="예: 2500000"
            required
          />
        </div>

        {/* 3교대 근무 정보 */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            3교대 근무 정보
          </h3>

          <div className="space-y-4">
            {/* 주간 근무 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                주간 근무 일수
              </label>
              <input
                type="number"
                min="0"
                max="31"
                value={shiftWork.dayShifts || ""}
                onChange={(e) =>
                  setShiftWork({
                    ...shiftWork,
                    dayShifts: Number(e.target.value),
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </div>

            {/* 저녁 근무 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                저녁 근무 일수
              </label>
              <input
                type="number"
                min="0"
                max="31"
                value={shiftWork.eveningShifts || ""}
                onChange={(e) =>
                  setShiftWork({
                    ...shiftWork,
                    eveningShifts: Number(e.target.value),
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </div>

            {/* 야간 근무 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                야간 근무 일수
              </label>
              <input
                type="number"
                min="0"
                max="31"
                value={shiftWork.nightShifts || ""}
                onChange={(e) =>
                  setShiftWork({
                    ...shiftWork,
                    nightShifts: Number(e.target.value),
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </div>

            {/* 야간 수당 비율 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                야간 수당 비율 (50% = 0.5)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="2"
                value={nightShiftRate}
                onChange={(e) => setNightShiftRate(Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="0.5"
              />
              <p className="mt-1 text-sm text-gray-500">
                0.5 = 50% 추가, 1.0 = 100% 추가
              </p>
            </div>
          </div>
        </div>

        {/* 계산 버튼 */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 shadow-md hover:shadow-lg">
          월급 계산하기
        </button>
      </form>
    </div>
  );
};

export default SalaryForm;

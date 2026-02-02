import { useState } from 'react'
import SalaryForm from './components/SalaryForm'
import SalaryResult from './components/SalaryResult'

function App() {
  // 계산 결과를 저장할 상태
  const [result, setResult] = useState<any>(null)

  // 계산 결과를 받아서 상태에 저장하는 함수
  const handleCalculate = (calculationResult: any) => {
    setResult(calculationResult)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            3교대 월급 계산기
          </h1>
          <p className="text-gray-600">
            야간 근무 수당을 포함한 정확한 실수령액을 계산해보세요
          </p>
        </header>

        {/* 메인 컨텐츠 */}
        <div className="space-y-8">
          {/* 입력 폼 */}
          <SalaryForm onCalculate={handleCalculate} />

          {/* 계산 결과 */}
          {result && <SalaryResult result={result} />}
        </div>
      </div>
    </div>
  )
}

export default App

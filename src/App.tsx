import { useState } from "react";
import Calendar from "./components/Calendar";
import WorkInputModal from "./components/WorkInputModal";
import MonthlySummary from "./components/MonthlySummary";
import SettingsModal from "./components/SettingsModal";
import { getToday } from "./utils/dateUtils";
import { calculateMonthlySalary } from "./utils/salaryCalculator";
import { useWorkRecords } from "./hooks/useWorkRecords";
import { useMonthlySettings } from "./hooks/useMonthlySettings";
import type { DailyWorkRecord, MonthlySettings } from "./types/salary";

function App() {
  const today = getToday();

  // 현재 보고 있는 월
  const [currentYear, setCurrentYear] = useState(today.year);
  const [currentMonth, setCurrentMonth] = useState(today.month);

  // Supabase에서 근무 기록 가져오기
  const {
    workRecords,
    loading: workLoading,
    error: workError,
    saveWorkRecord,
    deleteWorkRecord,
  } = useWorkRecords(currentYear, currentMonth);

  // Supabase에서 월별 설정 가져오기
  const {
    settings,
    loading: settingsLoading,
    error: settingsError,
    saveSettings,
  } = useMonthlySettings(currentYear, currentMonth);

  // 모달 상태
  const [isWorkModalOpen, setIsWorkModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // 날짜 클릭 핸들러
  const handleDateClick = (date: string) => {
    setSelectedDate(date);
    setIsWorkModalOpen(true);
  };

  // 근무 기록 저장
  const handleSaveWork = async (record: DailyWorkRecord) => {
    const result = await saveWorkRecord(record);
    if (result.success) {
      setIsWorkModalOpen(false);
    } else {
      alert(result.error || "저장에 실패했습니다");
    }
  };

  // 근무 기록 삭제
  const handleDeleteWork = async () => {
    if (selectedDate) {
      const result = await deleteWorkRecord(selectedDate);
      if (result.success) {
        setIsWorkModalOpen(false);
      } else {
        alert(result.error || "삭제에 실패했습니다");
      }
    }
  };

  // 설정 저장
  const handleSaveSettings = async (newSettings: MonthlySettings) => {
    const result = await saveSettings(newSettings);
    if (result.success) {
      setIsSettingsModalOpen(false);
    } else {
      alert(result.error || "설정 저장에 실패했습니다");
    }
  };

  // 월 변경
  const handleMonthChange = (year: number, month: number) => {
    setCurrentYear(year);
    setCurrentMonth(month);
  };

  // 선택된 날짜의 기록 찾기
  const selectedRecord = selectedDate
    ? workRecords.find((r) => r.date === selectedDate)
    : undefined;

  // 월별 급여 계산
  const monthlySalary =
    workRecords.length > 0
      ? calculateMonthlySalary(workRecords, settings)
      : null;

  // 로딩 중이면 로딩 표시
  if (workLoading || settingsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-100 via-violet-100 to-pink-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-cyan-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 에러가 있으면 에러 표시
  if (workError || settingsError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-100 via-violet-100 to-pink-100 p-4">
        <div className="backdrop-blur-xl bg-white/90 rounded-3xl p-8 shadow-2xl max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">연결 오류</h2>
          <p className="text-gray-600 mb-4">
            {workError || settingsError}
          </p>
          <p className="text-sm text-gray-500">
            .env.local 파일의 Supabase 설정을 확인해주세요.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 글라스모피즘 배경 */}
      <div className="fixed inset-0 -z-10">
        {/* 그라데이션 배경 */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-100 via-violet-100 to-pink-100" />

        {/* 애니메이션 원형 블러 효과 */}
        <div className="absolute top-0 -left-4 w-96 h-96 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
        <div className="absolute top-0 -right-4 w-96 h-96 bg-violet-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000" />
      </div>

      {/* 메인 컨텐츠 */}
      <div className="relative py-8 px-4">
        {/* 헤더 */}
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-cyan-600 via-violet-600 to-pink-600 bg-clip-text text-transparent">
            3교대 월급 계산기
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            매일 근무 시간을 기록하고 실수령액을 확인하세요
          </p>
          <p className="text-xs text-cyan-600 mt-2">
            ☁️ Supabase에 자동 저장됩니다
          </p>
        </header>

        {/* 월별 통계 */}
        <MonthlySummary
          monthlySalary={monthlySalary}
          onSettingsClick={() => setIsSettingsModalOpen(true)}
        />

        {/* 달력 */}
        <div className="mt-8">
          <Calendar
            year={currentYear}
            month={currentMonth}
            workRecords={workRecords}
            settings={settings}
            onDateClick={handleDateClick}
            onMonthChange={handleMonthChange}
          />
        </div>

        {/* 안내 문구 */}
        {workRecords.length === 0 && (
          <div className="max-w-4xl mx-auto mt-8 p-6 backdrop-blur-xl bg-white/40 rounded-3xl shadow-lg border border-white/60 text-center">
            <p className="text-gray-600 mb-4">
              달력에서 날짜를 클릭하여 근무 시간을 기록해보세요!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm text-gray-500">
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 rounded bg-gradient-to-br from-cyan-300/40 to-cyan-400/40 border border-cyan-400" />
                <span>정규 근무</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 rounded bg-gradient-to-br from-violet-300/40 to-violet-400/40 border border-violet-400" />
                <span>잔업</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 rounded bg-gradient-to-br from-indigo-300/40 to-indigo-400/40 border border-indigo-400" />
                <span>야간</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 모달들 */}
      <WorkInputModal
        isOpen={isWorkModalOpen}
        date={selectedDate || ""}
        existingRecord={selectedRecord}
        settings={settings}
        onClose={() => setIsWorkModalOpen(false)}
        onSave={handleSaveWork}
        onDelete={handleDeleteWork}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        settings={settings}
        onClose={() => setIsSettingsModalOpen(false)}
        onSave={handleSaveSettings}
      />
    </div>
  );
}

export default App;

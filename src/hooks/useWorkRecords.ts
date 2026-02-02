import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import type { DailyWorkRecord } from "../types/salary";

/**
 * 일일 근무 기록을 관리하는 커스텀 훅
 */
export const useWorkRecords = (year: number, month: number) => {
  const [workRecords, setWorkRecords] = useState<DailyWorkRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 해당 월의 근무 기록 가져오기
  const fetchWorkRecords = async () => {
    try {
      setLoading(true);
      setError(null);

      // 해당 월의 시작일과 종료일 계산
      const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
      const lastDay = new Date(year, month, 0).getDate();
      const endDate = `${year}-${String(month).padStart(2, "0")}-${lastDay}`;

      const { data, error: fetchError } = await supabase
        .from("daily_work_records")
        .select("*")
        .gte("date", startDate)
        .lte("date", endDate)
        .order("date", { ascending: true });

      if (fetchError) throw fetchError;

      // 데이터베이스 컬럼명(snake_case)을 TypeScript 타입(camelCase)으로 변환
      const records: DailyWorkRecord[] = (data || []).map((row: any) => ({
        id: row.id,
        date: row.date,
        regularHours: parseFloat(row.regular_hours) || 0,
        overtimeHours: parseFloat(row.overtime_hours) || 0,
        nightHours: parseFloat(row.night_hours) || 0,
        holidayHours: parseFloat(row.holiday_hours) || 0,
        memo: row.memo,
      }));

      setWorkRecords(records);
    } catch (err) {
      console.error("Error fetching work records:", err);
      setError(err instanceof Error ? err.message : "데이터를 불러오는데 실패했습니다");
    } finally {
      setLoading(false);
    }
  };

  // 근무 기록 저장/업데이트
  const saveWorkRecord = async (record: DailyWorkRecord) => {
    try {
      // camelCase를 snake_case로 변환
      const dbRecord = {
        date: record.date,
        regular_hours: record.regularHours,
        overtime_hours: record.overtimeHours,
        night_hours: record.nightHours,
        holiday_hours: record.holidayHours,
        memo: record.memo || null,
      };

      // upsert: 존재하면 업데이트, 없으면 삽입
      const { error: saveError } = await supabase
        .from("daily_work_records")
        .upsert(dbRecord, { onConflict: "date" });

      if (saveError) throw saveError;

      // 목록 새로고침
      await fetchWorkRecords();

      return { success: true };
    } catch (err) {
      console.error("Error saving work record:", err);
      return {
        success: false,
        error: err instanceof Error ? err.message : "저장에 실패했습니다",
      };
    }
  };

  // 근무 기록 삭제
  const deleteWorkRecord = async (date: string) => {
    try {
      const { error: deleteError } = await supabase
        .from("daily_work_records")
        .delete()
        .eq("date", date);

      if (deleteError) throw deleteError;

      // 목록 새로고침
      await fetchWorkRecords();

      return { success: true };
    } catch (err) {
      console.error("Error deleting work record:", err);
      return {
        success: false,
        error: err instanceof Error ? err.message : "삭제에 실패했습니다",
      };
    }
  };

  // 년/월이 변경될 때마다 데이터 새로 가져오기
  useEffect(() => {
    fetchWorkRecords();
  }, [year, month]);

  return {
    workRecords,
    loading,
    error,
    saveWorkRecord,
    deleteWorkRecord,
    refreshWorkRecords: fetchWorkRecords,
  };
};

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import type { MonthlySettings } from "../types/salary";

/**
 * 월별 시급 설정을 관리하는 커스텀 훅
 */
export const useMonthlySettings = (year: number, month: number) => {
  const [settings, setSettings] = useState<MonthlySettings>({
    year,
    month,
    hourlyWage: 10000, // 기본값
    overtimeRate: 1.5,
    nightRate: 0.5,
    holidayRate: 1.5,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 월별 설정 가져오기
  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("monthly_settings")
        .select("*")
        .eq("year", year)
        .eq("month", month)
        .single();

      if (fetchError) {
        // 데이터가 없으면 기본값 사용
        if (fetchError.code === "PGRST116") {
          setSettings({
            year,
            month,
            hourlyWage: 10000,
            overtimeRate: 1.5,
            nightRate: 0.5,
            holidayRate: 1.5,
          });
        } else {
          throw fetchError;
        }
      } else if (data) {
        // snake_case를 camelCase로 변환
        setSettings({
          year: data.year,
          month: data.month,
          hourlyWage: parseFloat(data.hourly_wage),
          overtimeRate: parseFloat(data.overtime_rate),
          nightRate: parseFloat(data.night_rate),
          holidayRate: parseFloat(data.holiday_rate) || 1.5,
        });
      }
    } catch (err) {
      console.error("Error fetching settings:", err);
      setError(err instanceof Error ? err.message : "설정을 불러오는데 실패했습니다");
    } finally {
      setLoading(false);
    }
  };

  // 설정 저장
  const saveSettings = async (newSettings: MonthlySettings) => {
    try {
      // camelCase를 snake_case로 변환
      const dbSettings = {
        year: newSettings.year,
        month: newSettings.month,
        hourly_wage: newSettings.hourlyWage,
        overtime_rate: newSettings.overtimeRate,
        night_rate: newSettings.nightRate,
        holiday_rate: newSettings.holidayRate,
      };

      // upsert: 존재하면 업데이트, 없으면 삽입
      const { error: saveError } = await supabase
        .from("monthly_settings")
        .upsert(dbSettings, {
          onConflict: "year,month",
        });

      if (saveError) throw saveError;

      // 로컬 상태 업데이트
      setSettings(newSettings);

      return { success: true };
    } catch (err) {
      console.error("Error saving settings:", err);
      return {
        success: false,
        error: err instanceof Error ? err.message : "설정 저장에 실패했습니다",
      };
    }
  };

  // 년/월이 변경될 때마다 설정 새로 가져오기
  useEffect(() => {
    fetchSettings();
  }, [year, month]);

  return {
    settings,
    loading,
    error,
    saveSettings,
    refreshSettings: fetchSettings,
  };
};

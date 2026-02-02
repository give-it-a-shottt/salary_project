-- 휴일 근무 기능 추가 마이그레이션
-- Supabase SQL Editor에서 실행하세요

-- 1. daily_work_records 테이블에 holiday_hours 컬럼 추가
ALTER TABLE daily_work_records
ADD COLUMN IF NOT EXISTS holiday_hours DECIMAL(5, 2) DEFAULT 0;

-- 2. monthly_settings 테이블에 holiday_rate 컬럼 추가
ALTER TABLE monthly_settings
ADD COLUMN IF NOT EXISTS holiday_rate DECIMAL(5, 2) DEFAULT 1.5;

-- 컬럼 설명 추가
COMMENT ON COLUMN daily_work_records.holiday_hours IS '휴일 근무 시간';
COMMENT ON COLUMN monthly_settings.holiday_rate IS '휴일 수당 배율 (예: 1.5 = 150%)';

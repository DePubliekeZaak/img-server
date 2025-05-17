-- View: main.gemeenten_grid

CREATE OR REPLACE VIEW main.gemeenten_grid AS
WITH RECURSIVE weeks AS (
    SELECT MIN(jaar_week) as start_week,
           MAX(jaar_week) as end_week
    FROM main.gemeenten
    WHERE jaar_week IS NOT NULL
),
week_series AS (
    -- Base case
    SELECT start_week as jaar_week
    FROM weeks
    UNION ALL
    -- Recursive case: increment the week
    SELECT 
        CASE 
            -- If week is 53 or (week is 52 and next year starts at week 1), increment year
            WHEN SPLIT_PART(jaar_week, '_', 2)::int >= 52 AND
                 TO_CHAR((TO_DATE(jaar_week, 'IYYY_IW') + INTERVAL '1 week')::date, 'IW')::int = 1
            THEN TO_CHAR((TO_DATE(jaar_week, 'IYYY_IW') + INTERVAL '1 week')::date, 'IYYY_IW')
            -- Otherwise just increment the week
            ELSE SPLIT_PART(jaar_week, '_', 1) || '_' || 
                 LPAD((SPLIT_PART(jaar_week, '_', 2)::int + 1)::text, 2, '0')
        END
    FROM week_series
    WHERE (
        -- Compare years first
        SPLIT_PART(jaar_week, '_', 1)::int < SPLIT_PART((SELECT end_week FROM weeks), '_', 1)::int
        OR 
        -- If same year, compare weeks
        (SPLIT_PART(jaar_week, '_', 1)::int = SPLIT_PART((SELECT end_week FROM weeks), '_', 1)::int
         AND SPLIT_PART(jaar_week, '_', 2)::int < SPLIT_PART((SELECT end_week FROM weeks), '_', 2)::int)
    )
),
combinations AS (
    SELECT DISTINCT gemeente, domein_code, regeling_code, zaaktype
    FROM main.gemeenten
    WHERE gemeente IS NOT NULL 
      AND domein_code IS NOT NULL 
      AND regeling_code IS NOT NULL 
      AND zaaktype IS NOT NULL
)
SELECT 
    w.jaar_week,
    c.gemeente, 
    c.domein_code, 
    c.regeling_code, 
    c.zaaktype
FROM week_series w
CROSS JOIN combinations c
ORDER BY w.jaar_week, gemeente, domein_code, regeling_code, zaaktype;

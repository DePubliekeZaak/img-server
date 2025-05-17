-- Test weeks CTE
WITH RECURSIVE weeks AS (
    SELECT MIN(jaar_week) as start_week,
           MAX(jaar_week) as end_week
    FROM main.gemeenten
    WHERE jaar_week IS NOT NULL
)
SELECT * FROM weeks;

-- Test week_series CTE
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
            -- If week is 52, increment year and set week to 1
            WHEN SPLIT_PART(jaar_week, '_', 2)::int = 52 
            THEN (SPLIT_PART(jaar_week, '_', 1)::int + 1)::text || '_01'
            -- Otherwise just increment the week
            ELSE SPLIT_PART(jaar_week, '_', 1) || '_' || 
                 LPAD((SPLIT_PART(jaar_week, '_', 2)::int + 1)::text, 2, '0')
        END
    FROM week_series
    WHERE jaar_week < (SELECT end_week FROM weeks)
)
SELECT * FROM week_series;

-- Test combinations CTE
WITH combinations AS (
    SELECT DISTINCT gemeente, domein_code, regeling_code, zaaktype
    FROM main.gemeenten
    WHERE gemeente IS NOT NULL 
      AND domein_code IS NOT NULL 
      AND regeling_code IS NOT NULL 
      AND zaaktype IS NOT NULL
)
SELECT * FROM combinations;

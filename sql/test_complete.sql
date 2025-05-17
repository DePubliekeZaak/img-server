-- Test for one specific combination to see how cumulative values progress
SELECT 
    jaar_week,
    ingediend_aantal,
    ingediend_cumul,
    beschikt_aantal,
    beschikt_cumul,
    toegekend_aantal,
    toegekend_cumul,
    besch_totaal_eur,
    besch_totaal_cumul_eur
FROM main.gemeenten_complete
WHERE gemeente = 'Aa en Hunze' 
  AND domein_code = 'FYSIEK' 
  AND regeling_code = 'FS' 
  AND zaaktype = 'S'
ORDER BY jaar_week
LIMIT 20;  -- Remove this to see all weeks

-- Compare with original data
SELECT 
    jaar_week,
    ingediend_aantal,
    ingediend_cumul,
    beschikt_aantal,
    beschikt_cumul,
    toegekend_aantal,
    toegekend_cumul,
    besch_totaal_eur,
    besch_totaal_cumul_eur
FROM main.gemeenten
WHERE gemeente = 'Aa en Hunze' 
  AND domein_code = 'FYSIEK' 
  AND regeling_code = 'FS' 
  AND zaaktype = 'S'
ORDER BY jaar_week;

-- Check number of weeks in 2020
SELECT TO_CHAR(date '2020-12-28', 'IYYY_IW') as last_week_2020,  -- Last Monday of 2020
       TO_CHAR(date '2021-01-04', 'IYYY_IW') as first_week_2021; -- First Monday of 2021

-- Check a few years
SELECT 
    generate_series('2019-12-28'::date, '2021-01-04'::date, '1 day') as date,
    TO_CHAR(generate_series, 'IYYY_IW') as iso_week;

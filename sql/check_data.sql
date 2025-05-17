-- Check if we have any data and what the jaar_week values look like
SELECT MIN(jaar_week), MAX(jaar_week), COUNT(*) 
FROM main.gemeenten 
WHERE jaar_week IS NOT NULL;

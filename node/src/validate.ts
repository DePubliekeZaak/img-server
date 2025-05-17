export function validateCumulativeTotals(data: any[]): { isValid: boolean; discrepancies: any[] } {
    
    // data = data.filter(row => row.gemeente === 'Overig');

    // Group data by unique combinations of identifiers
    const groups = new Map<string, any[]>();
    
    for (const row of data) {
        const groupKey = `${row.gemeente}_${row.domein_code}_${row.regeling_code}_${row.zaaktype}`;
        if (!groups.has(groupKey)) {
            groups.set(groupKey, []);
        }
        groups.get(groupKey)!.push(row);
    }

    const pairs = new Map<string, Map<string, { aantal: number[], cumul: number[], identifiers: any, jaar_weeks: any[] }>>();
    const discrepancies = [];

    // Process each group separately
    for (const [groupKey, groupData] of groups) {
        const groupPairs = new Map<string, { aantal: number[], cumul: number[], identifiers: any, jaar_weeks: any[] }>();
        
        // Get identifiers from first row of group
        const identifiers = {
            gemeente: groupData[0].gemeente,
            domein_code: groupData[0].domein_code,
            regeling_code: groupData[0].regeling_code,
            zaaktype: groupData[0].zaaktype
        };

        // First, identify all column pairs and collect their values
        for (const row of groupData) {
            const keys = Object.keys(row);
            for (const key of keys) {
                // Check for _aantal/_cumul pairs
                if (key.endsWith('_aantal')) {
                    const baseKey = key.replace('_aantal', '');
                    const cumulKey = `${baseKey}_cumul`;
                    
                    if (keys.includes(cumulKey)) {
                        if (!groupPairs.has(baseKey)) {
                            groupPairs.set(baseKey, { 
                                aantal: [], 
                                cumul: [], 
                                identifiers,
                                jaar_weeks: [] 
                            });
                        }
                        const pair = groupPairs.get(baseKey)!;
                        pair.aantal.push(Number(row[key]) || 0);
                        pair.cumul.push(Number(row[cumulKey]) || 0);
                        pair.jaar_weeks.push(row.jaar_week);
                    }
                }
                // Check for _eur/_cumul_eur pairs
                else if (key.endsWith('_eur') && !key.endsWith('_cumul_eur')) {
                    const baseKey = key.replace('_eur', '');
                    const cumulKey = `${baseKey}_cumul_eur`;
                    
                    if (keys.includes(cumulKey)) {
                        if (!groupPairs.has(baseKey)) {
                            groupPairs.set(baseKey, { 
                                aantal: [], 
                                cumul: [], 
                                identifiers,
                                jaar_weeks: [] 
                            });
                        }
                        const pair = groupPairs.get(baseKey)!;
                        pair.aantal.push(Number(row[key]) || 0);
                        pair.cumul.push(Number(row[cumulKey]) || 0);
                        pair.jaar_weeks.push(row.jaar_week);
                    }
                }
            }
        }

        pairs.set(groupKey, groupPairs);
    }


    // Validate each group's pairs
    for (const [groupKey, groupPairs] of pairs) {
       
        for (const [baseKey, values] of groupPairs.entries()) {
            console.log("baseKey: " + baseKey);
            // if (baseKey !== 'ingediend') {
            //     continue;
            // }
            let runningTotal = 0;
            let hasReportedDiscrepancy = false;  // Track if we've already reported a discrepancy for this series
            
            for (let i = 0; i < values.aantal.length; i++) {
                runningTotal += values.aantal[i];

                if (!hasReportedDiscrepancy && Math.abs(runningTotal - values.cumul[i]) > 0.01) {
                    discrepancies.push({
                        ...values.identifiers,
                        jaar_week: values.jaar_weeks[i],
                        metric: baseKey,
                        week: i + 1,
                        expectedCumul: runningTotal,
                        actualCumul: values.cumul[i],
                        difference: runningTotal - values.cumul[i],
                        weeklyAmount: values.aantal[i]
                    });
                    hasReportedDiscrepancy = true;  // Don't report any more discrepancies for this series
                }
            }
        }
    }

    return {
        isValid: discrepancies.length === 0,
        discrepancies: discrepancies.sort((a, b) => {
            // Helper function to safely compare possibly null values
            const safeCompare = (val1: any, val2: any) => {
                if (val1 === null && val2 === null) return 0;
                if (val1 === null) return -1;
                if (val2 === null) return 1;
                return val1.localeCompare(val2);
            };

            // Chain comparisons with null checks
            return safeCompare(a.gemeente, b.gemeente) || 
                   safeCompare(a.domein_code, b.domein_code) ||
                   safeCompare(a.regeling_code, b.regeling_code) ||
                   safeCompare(a.zaaktype, b.zaaktype) ||
                   safeCompare(a.jaar_week, b.jaar_week) ||
                   (a.week - b.week);
        })
    };
}
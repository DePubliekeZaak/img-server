-- View: main.gemeenten_complete

CREATE OR REPLACE VIEW main.gemeenten_complete AS
SELECT 
    grid.jaar_week,
    grid.gemeente, 
    grid.domein_code, 
    grid.regeling_code, 
    grid.zaaktype,
    COALESCE(g.ingediend_aantal, 0) as ingediend_aantal,
    COALESCE(g.ingediend_cumul,
        COALESCE(LAG(g.ingediend_cumul) OVER (
            PARTITION BY grid.gemeente, grid.domein_code, grid.regeling_code, grid.zaaktype 
            ORDER BY grid.jaar_week
        ), 0)
    ) as ingediend_cumul,
    COALESCE(g.beschikt_aantal, 0) as beschikt_aantal,
    COALESCE(g.beschikt_cumul,
        COALESCE(LAG(g.beschikt_cumul) OVER (
        LAG(g.beschikt_cumul) OVER (
            PARTITION BY grid.gemeente, grid.domein_code, grid.regeling_code, grid.zaaktype 
            ORDER BY grid.jaar_week
        ),
        0
            PARTITION BY grid.gemeente, grid.domein_code, grid.regeling_code, grid.zaaktype 
            ORDER BY grid.jaar_week
        )
    ) as beschikt_cumul,
    COALESCE(g.toegekend_aantal, 0) as toegekend_aantal,
    COALESCE(g.toegekend_cumul,
        LAG(g.toegekend_cumul) OVER (
            PARTITION BY grid.gemeente, grid.domein_code, grid.regeling_code, grid.zaaktype 
            ORDER BY grid.jaar_week
        ),
        0
            PARTITION BY grid.gemeente, grid.domein_code, grid.regeling_code, grid.zaaktype 
            ORDER BY grid.jaar_week
        )
    ) as toegekend_cumul,
    COALESCE(g.afgewezen_aantal, 0) as afgewezen_aantal,
    COALESCE(g.afgewezen_cumul,
        LAG(g.afgewezen_cumul) OVER (
            PARTITION BY grid.gemeente, grid.domein_code, grid.regeling_code, grid.zaaktype 
            ORDER BY grid.jaar_week
        ),
        0
            PARTITION BY grid.gemeente, grid.domein_code, grid.regeling_code, grid.zaaktype 
            ORDER BY grid.jaar_week
        )
    ) as afgewezen_cumul,
    COALESCE(g.anders_afgehandeld_aantal, 0) as anders_afgehandeld_aantal,
    COALESCE(g.anders_afgehandeld_cumul,
        LAG(g.anders_afgehandeld_cumul) OVER (
            PARTITION BY grid.gemeente, grid.domein_code, grid.regeling_code, grid.zaaktype 
            ORDER BY grid.jaar_week
        ),
        0
            PARTITION BY grid.gemeente, grid.domein_code, grid.regeling_code, grid.zaaktype 
            ORDER BY grid.jaar_week
        )
    ) as anders_afgehandeld_cumul,
    COALESCE(g.afgerond_aantal, 0) as afgerond_aantal,
    COALESCE(g.afgerond_cumul,
        LAG(g.afgerond_cumul) OVER (
            PARTITION BY grid.gemeente, grid.domein_code, grid.regeling_code, grid.zaaktype 
            ORDER BY grid.jaar_week
        ),
        0
            PARTITION BY grid.gemeente, grid.domein_code, grid.regeling_code, grid.zaaktype 
            ORDER BY grid.jaar_week
        )
    ) as afgerond_cumul,
    COALESCE(g.besch_totaal_eur, 0) as besch_totaal_eur,
    COALESCE(g.besch_totaal_cumul_eur,
        LAG(g.besch_totaal_cumul_eur) OVER (
            PARTITION BY grid.gemeente, grid.domein_code, grid.regeling_code, grid.zaaktype 
            ORDER BY grid.jaar_week
        ),
        0
            PARTITION BY grid.gemeente, grid.domein_code, grid.regeling_code, grid.zaaktype 
            ORDER BY grid.jaar_week
        )
    ) as besch_totaal_cumul_eur,
    COALESCE(g.besch_schade_eur, 0) as besch_schade_eur,
    COALESCE(g.besch_schade_cumul_eur,
        LAG(g.besch_schade_cumul_eur) OVER (
            PARTITION BY grid.gemeente, grid.domein_code, grid.regeling_code, grid.zaaktype 
            ORDER BY grid.jaar_week
        ),
        0
            PARTITION BY grid.gemeente, grid.domein_code, grid.regeling_code, grid.zaaktype 
            ORDER BY grid.jaar_week
        )
    ) as besch_schade_cumul_eur,
    COALESCE(g.bet_schade_eur, 0) as bet_schade_eur,
    COALESCE(g.bet_schade_cumul_eur,
        LAG(g.bet_schade_cumul_eur) OVER (
            PARTITION BY grid.gemeente, grid.domein_code, grid.regeling_code, grid.zaaktype 
            ORDER BY grid.jaar_week
        ),
        0
            PARTITION BY grid.gemeente, grid.domein_code, grid.regeling_code, grid.zaaktype 
            ORDER BY grid.jaar_week
        )
    ) as bet_schade_cumul_eur,
    COALESCE(g.bet_totaal_eur, 0) as bet_totaal_eur,
    COALESCE(g.bet_totaal_cumul_eur,
        LAG(g.bet_totaal_cumul_eur) OVER (
            PARTITION BY grid.gemeente, grid.domein_code, grid.regeling_code, grid.zaaktype 
            ORDER BY grid.jaar_week
        ),
        0
            PARTITION BY grid.gemeente, grid.domein_code, grid.regeling_code, grid.zaaktype 
            ORDER BY grid.jaar_week
        )
    ) as bet_totaal_cumul_eur,
    COALESCE(g.aos_gegrond_aantal, 0) as aos_gegrond_aantal,
    COALESCE(g.aos_gegrond_cumul,
        LAG(g.aos_gegrond_cumul) OVER (
            PARTITION BY grid.gemeente, grid.domein_code, grid.regeling_code, grid.zaaktype 
            ORDER BY grid.jaar_week
        ),
        0
            PARTITION BY grid.gemeente, grid.domein_code, grid.regeling_code, grid.zaaktype 
            ORDER BY grid.jaar_week
        )
    ) as aos_gegrond_cumul
FROM main.gemeenten_grid grid
LEFT JOIN main.gemeenten g ON grid.jaar_week = g.jaar_week 
    AND grid.gemeente = g.gemeente
    AND grid.domein_code = g.domein_code
    AND grid.regeling_code = g.regeling_code
    AND grid.zaaktype = g.zaaktype
ORDER BY grid.jaar_week, grid.gemeente, grid.domein_code, grid.regeling_code, grid.zaaktype;

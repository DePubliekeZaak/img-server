-- Table: public.gemeenten

-- DROP TABLE IF EXISTS public.gemeenten;

CREATE TABLE IF NOT EXISTS public.gemeenten
(
    jaar_week character varying(10) COLLATE pg_catalog."default",
    datum_maandag date,
    gemeente character varying(100) COLLATE pg_catalog."default",
    domein_code character varying(50) COLLATE pg_catalog."default",
    regeling_code character varying(50) COLLATE pg_catalog."default",
    zaaktype character varying(50) COLLATE pg_catalog."default",
    ingediend_aantal integer,
    ingediend_cumul integer,
    beschikt_aantal integer,
    beschikt_cumul integer,
    toegekend_aantal integer,
    toegekend_cumul integer,
    afgewezen_aantal integer,
    afgewezen_cumul integer,
    anders_afgehandeld_aantal integer,
    anders_afgehandeld_cumul integer,
    afgerond_aantal integer,
    afgerond_cumul integer,
    besch_totaal_eur numeric(15,2),
    besch_totaal_cumul_eur numeric(15,2),
    besch_schade_eur numeric(15,2),
    besch_schade_cumul_eur numeric(15,2),
    bet_schade_eur numeric(15,2),
    bet_schade_cumul_eur numeric(15,2),
    bet_totaal_eur numeric(15,2),
    bet_totaal_cumul_eur numeric(15,2),
    aos_gegrond_aantal integer,
    aos_gegrond_cumul integer
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.gemeenten
    OWNER to postgres;

    
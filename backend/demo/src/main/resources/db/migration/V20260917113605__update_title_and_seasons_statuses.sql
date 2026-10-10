
ALTER TABLE seasons DROP CONSTRAINT IF EXISTS seasons_status_check;
ALTER TABLE titles DROP CONSTRAINT IF EXISTS titles_status_check;

ALTER TABLE seasons 
    ADD CONSTRAINT seasons_status_check 
    CHECK (((status)::text = ANY (ARRAY[
        ('WATCHED'::character varying)::text, 
        ('PLANNED'::character varying)::text, 
        ('INPROGRESS'::character varying)::text, 
        ('DROPPED'::character varying)::text, 
        ('DEFAULT'::character varying)::text, 
        ('UPCOMING'::character varying)::text
    ])));

ALTER TABLE titles 
    ADD CONSTRAINT titles_status_check 
    CHECK (((status)::text = ANY (ARRAY[
        ('WATCHED'::character varying)::text, 
        ('PLANNED'::character varying)::text, 
        ('INPROGRESS'::character varying)::text, 
        ('DROPPED'::character varying)::text, 
        ('DEFAULT'::character varying)::text, 
        ('UPCOMING'::character varying)::text
    ])));
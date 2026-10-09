DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'seasons'
          AND column_name = 'image_url'
    ) THEN
ALTER TABLE public.seasons ADD COLUMN image_url VARCHAR(255) NULL;
END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'seasons'
          AND column_name = 'description'
    ) THEN
ALTER TABLE public.seasons ADD COLUMN description TEXT NULL;
END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'seasons'
          AND column_name = 'api_title_id'
    ) THEN
ALTER TABLE public.seasons ADD COLUMN api_title_id INTEGER NULL;
END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'seasons'
          AND column_name = 'season_type'
    ) THEN
ALTER TABLE public.seasons ADD COLUMN season_type VARCHAR(32) NULL;

UPDATE public.seasons
SET season_type = 'TV'
WHERE season_type IS NULL;

ALTER TABLE public.seasons
    ALTER COLUMN season_type SET DEFAULT 'TV',
ALTER COLUMN season_type SET NOT NULL;
END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.constraint_column_usage
        WHERE table_schema = 'public'
          AND table_name = 'seasons'
          AND constraint_name = 'chk_seasons_season_type'
    ) THEN
ALTER TABLE public.seasons
    ADD CONSTRAINT chk_seasons_season_type
        CHECK (season_type IN ('TV', 'FILM', 'OVA', 'CHIBI'));
END IF;

    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'seasons'
          AND column_name = 'status'
    ) THEN
UPDATE public.seasons
SET status = 'INPROGRESS'
WHERE status IS NULL;

ALTER TABLE public.seasons
    ALTER COLUMN status SET DEFAULT 'INPROGRESS',
ALTER COLUMN status SET NOT NULL;
END IF;

END $$;
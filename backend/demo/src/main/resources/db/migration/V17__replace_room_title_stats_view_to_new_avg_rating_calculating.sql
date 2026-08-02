DROP VIEW IF EXISTS v_room_title_stats;

CREATE VIEW v_room_title_stats AS
SELECT 
    rt.id as id,
    rt.room_id as room_id,
    AVG(user_avg.single_user_avg) as avg_rating,
    rt.title_name as title_name,
    rt.created_at as created_at
FROM room_titles rt
JOIN (
    SELECT 
        rtl_inner.room_title_id as room_title_id,
        t_inner.user_id as user_id,
        AVG(tr.value) as single_user_avg
    FROM room_title_links rtl_inner
    JOIN titles t_inner ON rtl_inner.user_title_record_id = t_inner.title_id
    LEFT JOIN title_ratings tr ON tr.title_id = t_inner.title_id AND tr.name = 'overall'
    GROUP BY rtl_inner.room_title_id, t_inner.user_id
) user_avg ON user_avg.room_title_id = rt.id
GROUP BY rt.id, rt.room_id, rt.title_name, rt.created_at;
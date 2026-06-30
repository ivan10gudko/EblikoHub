package project_z.demo.JavaUtil;

import java.util.Map;

import project_z.demo.enums.TitleStatus;

public final class TitleSortingUtils {
    private TitleSortingUtils() {} 

    public static final Map<TitleStatus, Integer> STATUS_PRIORITY = Map.of(
        TitleStatus.WATCHED, 1,
        TitleStatus.DROPPED, 2
    );
}
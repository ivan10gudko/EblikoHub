package project_z.demo.common.pagination.externalRawApi;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public record ExternalApiRawResponse<T>(
        Pagination pagination,
        List<T> data
) {
    public record Pagination(
            @JsonProperty("current_page") int currentPage,
            @JsonProperty("has_next_page") boolean hasNextPage,
            @JsonProperty("last_visible_page") int lastVisiblePage
    ) {
    }
}
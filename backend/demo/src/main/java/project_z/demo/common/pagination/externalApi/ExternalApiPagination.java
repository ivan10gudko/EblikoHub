package project_z.demo.common.pagination.externalApi;

import com.fasterxml.jackson.annotation.JsonProperty;

public record ExternalApiPagination(
        @JsonProperty("current_page") int currentPage,
        @JsonProperty("has_next_page") boolean hasNextPage,
        @JsonProperty("last_visible_page") int lastVisiblePage
) {}
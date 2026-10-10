package project_z.demo.common.pagination.externalApi;

import java.util.List;

public record ExternalApiPageResponse<T>(
        List<T> data,
        ExternalApiPagination pagination
) {
}
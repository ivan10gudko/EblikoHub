package project_z.demo.JavaUtil;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import project_z.demo.common.QueryParameters.QueryParameters;

public class PagingHelper {

    public static <T extends QueryParameters> Pageable toPageable(T params) {
        Sort.Direction direction = params.getOrder().equalsIgnoreCase("desc") 
                                   ? Sort.Direction.DESC 
                                   : Sort.Direction.ASC;

        String sortField = (params.getSortBy() == null || params.getSortBy().isEmpty()) 
                           ? "createdAt" 
                           : params.getSortBy();
        
        Sort sort = Sort.by(direction, sortField);
        sort = sort.and(Sort.by(Sort.Direction.ASC, "titleId"));
        int pageIndex = Math.max(0, params.getPage() - 1);
        int pageSize = Math.max(1, params.getLimit());

        return PageRequest.of(pageIndex, pageSize, sort);
    }
}
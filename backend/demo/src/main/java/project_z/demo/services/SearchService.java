package project_z.demo.services;

import org.springframework.stereotype.Service;

@Service
public interface SearchService<T> {
    T search(String text, int page); //TODO cache

}

package com.oet.application.usecases.manageArticles.service;

import com.oet.application.usecases.manageArticles.entity.Article;
import com.oet.application.usecases.manageArticles.repository.ArticleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ManageForInstructorService {

    private final ArticleRepository repository;

    public List<Article> listAssignmentsForInstructor() {
        return repository.findAll();
    }
}

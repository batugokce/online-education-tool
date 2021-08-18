package com.oet.application.usecases.manageArticles.service;

import com.oet.application.usecases.manageArticles.entity.ArticleText;
import com.oet.application.usecases.manageArticles.entity.DragDrop;
import com.oet.application.usecases.manageArticles.repository.ArticleTextRepository;
import com.oet.application.usecases.manageArticles.repository.DragDropRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ArticleTextService {
    private final ArticleTextRepository articleTextRepository;

    public ArticleText create(ArticleText articleText){return articleTextRepository.save(articleText);}
    public List<ArticleText> findAll() {
        return articleTextRepository.findAll();
    }
    public ArticleText findById(Long id) {return articleTextRepository.findById(id).orElse(null);}
    public void deleteAll() {
        articleTextRepository.deleteAll();
    }
    
}

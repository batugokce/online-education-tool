package com.oet.application.usecases.manageArticles.service;

import com.oet.application.usecases.manageArticles.entity.ArticleText;
import com.oet.application.usecases.manageArticles.entity.Matching;
import com.oet.application.usecases.manageArticles.repository.MatchingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MatchingService {
    private final MatchingRepository matchingRepository;

    public Matching create(Matching matching){return matchingRepository.save(matching);}
    public List<Matching> findAll() {
        return matchingRepository.findAll();
    }
    public Matching findById(Long id) {return matchingRepository.findById(id).orElse(null);}
    public void deleteAll() {
        matchingRepository.deleteAll();
    }
}

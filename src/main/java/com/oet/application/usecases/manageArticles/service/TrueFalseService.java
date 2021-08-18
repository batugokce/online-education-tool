package com.oet.application.usecases.manageArticles.service;

import com.oet.application.usecases.manageArticles.entity.Matching;
import com.oet.application.usecases.manageArticles.entity.TrueFalse;
import com.oet.application.usecases.manageArticles.repository.TrueFalseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TrueFalseService {
    private final TrueFalseRepository trueFalseRepository;

    public TrueFalse create(TrueFalse trueFalse){return trueFalseRepository.save(trueFalse);}
    public List<TrueFalse> findAll() {
        return trueFalseRepository.findAll();
    }
    public TrueFalse findById(Long id) {return trueFalseRepository.findById(id).orElse(null);}
    public void deleteAll() {
        trueFalseRepository.deleteAll();
    }
}

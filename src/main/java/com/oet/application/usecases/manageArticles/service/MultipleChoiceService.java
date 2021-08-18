package com.oet.application.usecases.manageArticles.service;

import com.oet.application.usecases.manageArticles.entity.MultipleChoice;
import com.oet.application.usecases.manageArticles.repository.MultipleChoiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MultipleChoiceService {
    private final MultipleChoiceRepository multipleChoiceRepository;
    public MultipleChoice create(MultipleChoice multipleChoice){return multipleChoiceRepository.save(multipleChoice);}
    public List<MultipleChoice> findAll(){return multipleChoiceRepository.findAll();}
    public MultipleChoice findById(Long id){return multipleChoiceRepository.findById(id).orElse(null);}
    public void deleteAll() {
        multipleChoiceRepository.deleteAll();
    }
    public void deleteById(Long id){multipleChoiceRepository.deleteById(id);}
}

package com.oet.application.usecases.manageArticles.service;

import com.oet.application.usecases.manageArticles.entity.WrittenQuestion;
import com.oet.application.usecases.manageArticles.repository.WrittenQuestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WrittenQuestionService {
    private final WrittenQuestionRepository writtenQuestionRepository;

    public WrittenQuestion create(WrittenQuestion writtenQuestion){return writtenQuestionRepository.save(writtenQuestion);}
    public List<WrittenQuestion> findAll(){return writtenQuestionRepository.findAll();}
    public WrittenQuestion findById(Long id){return writtenQuestionRepository.findById(id).orElse(null);}
    public void deleteAll() {
        writtenQuestionRepository.deleteAll();
    }
    public void deleteById(Long id){writtenQuestionRepository.deleteById(id);}
}

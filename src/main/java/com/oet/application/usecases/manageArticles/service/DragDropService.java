package com.oet.application.usecases.manageArticles.service;

import com.oet.application.usecases.manageArticles.entity.DragDrop;
import com.oet.application.usecases.manageArticles.repository.DragDropRepository;
import com.oet.application.usecases.manageClasses.entity.Classroom;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DragDropService {
    private final DragDropRepository dragDropRepository;

    public DragDrop create(DragDrop dragDrop){return dragDropRepository.save(dragDrop);}
    public List<DragDrop> findAll() {
        return dragDropRepository.findAll();
    }
    public DragDrop findById(Long id) {return dragDropRepository.findById(id).orElse(null);}
    public void deleteAll() {
        dragDropRepository.deleteAll();
    }
    public List<DragDrop> findByArticleId(Long id){
        return new ArrayList<>();
        //return dragDropRepository.getDragDrops(id);
    }
}

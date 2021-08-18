package com.oet.application.usecases.manageArticles.service;

import com.oet.application.usecases.manageArticles.entity.Ordering;
import com.oet.application.usecases.manageArticles.entity.TrueFalse;
import com.oet.application.usecases.manageArticles.repository.OrderingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderingService {
    private final OrderingRepository orderingRepository;

    public Ordering create(Ordering ordering){return orderingRepository.save(ordering);}
    public List<Ordering> findAll() {
        return orderingRepository.findAll();
    }
    public Ordering findById(Long id) {return orderingRepository.findById(id).orElse(null);}
    public void deleteAll() {
        orderingRepository.deleteAll();
    }
}

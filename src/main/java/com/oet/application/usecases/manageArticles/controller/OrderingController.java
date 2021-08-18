package com.oet.application.usecases.manageArticles.controller;

import com.oet.application.common.CommonMessages;
import com.oet.application.common.ResponseTemplate;
import com.oet.application.usecases.manageArticles.entity.MultipleChoice;
import com.oet.application.usecases.manageArticles.entity.Ordering;
import com.oet.application.usecases.manageArticles.service.OrderingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/v1/ordering")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('ADMIN')")
public class OrderingController  {
    private final OrderingService orderingService;

    @PostMapping
    public ResponseEntity<ResponseTemplate> createOrdering(@Valid @RequestBody Ordering ordering, BindingResult bindingresult) {
        if (bindingresult.hasErrors()) {
            return ResponseEntity.ok(new ResponseTemplate(CommonMessages.ERROR, bindingresult.getAllErrors().get(0).getDefaultMessage(), null));}
        Ordering newordering = orderingService.create(ordering);
        return ResponseEntity
                .ok(new ResponseTemplate(CommonMessages.SUCCESS, CommonMessages.ORDERING_IS_CREATED, newordering));
    }
    @GetMapping
    public ResponseEntity<ResponseTemplate> getAllOrdering() {
        List<Ordering> orderingList = orderingService.findAll();
        return ResponseEntity.ok(new ResponseTemplate(CommonMessages.SUCCESS, CommonMessages.RECORDS_FETCHED, orderingList));
    }
    @DeleteMapping
    public ResponseEntity<ResponseTemplate> deleteAllOrdering() {
        orderingService.deleteAll();
        return ResponseEntity.ok(new ResponseTemplate(CommonMessages.SUCCESS, CommonMessages.RECORDS_DELETED, null));
    }
    @GetMapping("/find/{id}")
    public ResponseEntity<ResponseTemplate> getOrderingById(@PathVariable Long id) {
        Ordering ordering = orderingService.findById(id);
        if (ordering != null) {
            return ResponseEntity.ok(new ResponseTemplate(CommonMessages.SUCCESS, CommonMessages.ORDERING_IS_FOUND, ordering));
        }
        return ResponseEntity
                .ok(new ResponseTemplate(CommonMessages.ERROR, CommonMessages.ORDERING_NOT_FOUND, null));
    }

}

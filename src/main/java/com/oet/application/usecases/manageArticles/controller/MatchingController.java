package com.oet.application.usecases.manageArticles.controller;

import com.oet.application.common.CommonMessages;
import com.oet.application.common.ResponseTemplate;
import com.oet.application.usecases.manageArticles.entity.Matching;
import com.oet.application.usecases.manageArticles.entity.Ordering;
import com.oet.application.usecases.manageArticles.service.MatchingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/v1/matching")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('ADMIN')")
public class MatchingController {
    private final MatchingService matchingService;

    @PostMapping
    public ResponseEntity<ResponseTemplate> createMatching(@Valid @RequestBody Matching matching, BindingResult bindingresult) {
        if (bindingresult.hasErrors()) {
            return ResponseEntity.ok(new ResponseTemplate(CommonMessages.ERROR, bindingresult.getAllErrors().get(0).getDefaultMessage(), null));}
        Matching newmatching = matchingService.create(matching);
        return ResponseEntity
                .ok(new ResponseTemplate(CommonMessages.SUCCESS, CommonMessages.MATCHING_IS_CREATED, newmatching));
    }
    @GetMapping
    public ResponseEntity<ResponseTemplate> getAllMatching() {
        List<Matching> matchingList = matchingService.findAll();
        return ResponseEntity.ok(new ResponseTemplate(CommonMessages.SUCCESS, CommonMessages.RECORDS_FETCHED, matchingList));
    }
    @DeleteMapping
    public ResponseEntity<ResponseTemplate> deleteAllMatching() {
        matchingService.deleteAll();
        return ResponseEntity.ok(new ResponseTemplate(CommonMessages.SUCCESS, CommonMessages.RECORDS_DELETED, null));
    }
    @GetMapping("/find/{id}")
    public ResponseEntity<ResponseTemplate> getOrderingById(@PathVariable Long id) {
        Matching matching = matchingService.findById(id);
        if (matching != null) {
            return ResponseEntity.ok(new ResponseTemplate(CommonMessages.SUCCESS, CommonMessages.MATCHING_IS_FOUND, matching));
        }
        return ResponseEntity
                .ok(new ResponseTemplate(CommonMessages.ERROR, CommonMessages.MATCHING_NOT_FOUND, null));
    }

}

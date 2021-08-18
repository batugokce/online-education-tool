package com.oet.application.usecases.manageArticles.controller;

import com.oet.application.common.CommonMessages;
import com.oet.application.common.ResponseTemplate;
import com.oet.application.usecases.manageArticles.entity.Matching;
import com.oet.application.usecases.manageArticles.entity.TrueFalse;
import com.oet.application.usecases.manageArticles.service.TrueFalseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/v1/truefalse")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('ADMIN')")
public class TrueFalseController {
    private final TrueFalseService trueFalseService;

    @PostMapping
    public ResponseEntity<ResponseTemplate> createTrueFalse(@Valid @RequestBody TrueFalse trueFalse, BindingResult bindingresult) {
        if (bindingresult.hasErrors()) {
            return ResponseEntity.ok(new ResponseTemplate(CommonMessages.ERROR, bindingresult.getAllErrors().get(0).getDefaultMessage(), null));}
        TrueFalse newtruefalse = trueFalseService.create(trueFalse);
        return ResponseEntity
                .ok(new ResponseTemplate(CommonMessages.SUCCESS, CommonMessages.TRUEFALSE_IS_CREATED, newtruefalse));
    }
    @GetMapping
    public ResponseEntity<ResponseTemplate> getAllTrueFalse() {
        List<TrueFalse> trueFalseList = trueFalseService.findAll();
        return ResponseEntity.ok(new ResponseTemplate(CommonMessages.SUCCESS, CommonMessages.RECORDS_FETCHED, trueFalseList));
    }
    @DeleteMapping
    public ResponseEntity<ResponseTemplate> deleteAllTrueFalse() {
        trueFalseService.deleteAll();
        return ResponseEntity.ok(new ResponseTemplate(CommonMessages.SUCCESS, CommonMessages.RECORDS_DELETED, null));
    }
    @GetMapping("/find/{id}")
    public ResponseEntity<ResponseTemplate> getTrueFalseById(@PathVariable Long id) {
        TrueFalse trueFalse = trueFalseService.findById(id);
        if (trueFalse != null) {
            return ResponseEntity.ok(new ResponseTemplate(CommonMessages.SUCCESS, CommonMessages.TRUEFALSE_IS_FOUND, trueFalse));
        }
        return ResponseEntity
                .ok(new ResponseTemplate(CommonMessages.ERROR, CommonMessages.TRUEFALSE_NOT_FOUND, null));
    }
}

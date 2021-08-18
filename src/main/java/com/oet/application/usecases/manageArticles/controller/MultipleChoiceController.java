package com.oet.application.usecases.manageArticles.controller;

import com.oet.application.common.CommonMessages;
import com.oet.application.common.ResponseTemplate;
import com.oet.application.usecases.manageArticles.entity.MultipleChoice;
import com.oet.application.usecases.manageArticles.service.MultipleChoiceService;
import com.oet.application.usecases.manageClasses.entity.Classroom;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/v1/multiplechoice")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('ADMIN')")
public class MultipleChoiceController {
    private final MultipleChoiceService multipleChoiceService;

    @PostMapping
    public ResponseEntity<ResponseTemplate> createMultipleChoice(@Valid @RequestBody MultipleChoice multipleChoice, BindingResult bindingresult) {
        if (bindingresult.hasErrors()) {
            return ResponseEntity.ok(new ResponseTemplate(CommonMessages.ERROR, bindingresult.getAllErrors().get(0).getDefaultMessage(), null));}
        MultipleChoice newmultipleChoice = multipleChoiceService.create(multipleChoice);
        return ResponseEntity
                .ok(new ResponseTemplate(CommonMessages.SUCCESS, CommonMessages.MULTIPLE_CHOICE_IS_CREATED, newmultipleChoice));
    }
    @GetMapping
    public ResponseEntity<ResponseTemplate> getAllMultipleChoices() {
        List<MultipleChoice> multipleChoiceList = multipleChoiceService.findAll();
        return ResponseEntity.ok(new ResponseTemplate(CommonMessages.SUCCESS, CommonMessages.RECORDS_FETCHED, multipleChoiceList));
    }
    @DeleteMapping
    public ResponseEntity<ResponseTemplate> deleteAllMultipleChoices() {
        multipleChoiceService.deleteAll();
        return ResponseEntity.ok(new ResponseTemplate(CommonMessages.SUCCESS, CommonMessages.RECORDS_DELETED, null));
    }
    @GetMapping("/find/{id}")
    public ResponseEntity<ResponseTemplate> getMultipleChoiceById(@PathVariable Long id) {
        MultipleChoice multipleChoice = multipleChoiceService.findById(id);
        if (multipleChoice != null) {
            return ResponseEntity.ok(new ResponseTemplate(CommonMessages.SUCCESS, CommonMessages.MULTIPLE_CHOICE_IS_FOUND, multipleChoice));
        }
        return ResponseEntity
                .ok(new ResponseTemplate(CommonMessages.ERROR, CommonMessages.MULTIPLE_CHOICE_NOT_FOUND, null));
    }



}

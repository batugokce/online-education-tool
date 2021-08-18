package com.oet.application.usecases.manageArticles.controller;

import com.oet.application.common.CommonMessages;
import com.oet.application.common.ResponseTemplate;
import com.oet.application.usecases.manageArticles.entity.DragDrop;
import com.oet.application.usecases.manageArticles.entity.MultipleChoice;
import com.oet.application.usecases.manageArticles.repository.DragDropRepository;
import com.oet.application.usecases.manageArticles.service.DragDropService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/v1/dragdrop")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('ADMIN')")
public class DragDropController {
    private final DragDropService dragDropService;

    @PostMapping
    public ResponseEntity<ResponseTemplate> createDragDrop(@Valid @RequestBody DragDrop dragDrop, BindingResult bindingresult) {
        if (bindingresult.hasErrors()) {
            return ResponseEntity.ok(new ResponseTemplate(CommonMessages.ERROR, bindingresult.getAllErrors().get(0).getDefaultMessage(), null));}
        DragDrop newdragdrop = dragDropService.create(dragDrop);
        return ResponseEntity
                .ok(new ResponseTemplate(CommonMessages.SUCCESS, CommonMessages.DRAG_DROP_IS_CREATED, newdragdrop));
    }
    @GetMapping
    public ResponseEntity<ResponseTemplate> getAllDragDrops() {
        List<DragDrop> dragDropList = dragDropService.findAll();
        return ResponseEntity.ok(new ResponseTemplate(CommonMessages.SUCCESS, CommonMessages.RECORDS_FETCHED, dragDropList));
    }
    @DeleteMapping
    public ResponseEntity<ResponseTemplate> deleteAllDragDrops() {
        dragDropService.deleteAll();
        return ResponseEntity.ok(new ResponseTemplate(CommonMessages.SUCCESS, CommonMessages.RECORDS_DELETED, null));
    }
    @GetMapping("/find/{articleId}")
    public ResponseEntity<ResponseTemplate> getDragDropById(@PathVariable Long articleId) {
        DragDrop dragDrop = dragDropService.findById(articleId);
        if (dragDrop != null) {
            return ResponseEntity.ok(new ResponseTemplate(CommonMessages.SUCCESS, CommonMessages.DRAG_DROP_IS_FOUND, dragDrop));
        }
        return ResponseEntity
                .ok(new ResponseTemplate(CommonMessages.ERROR, CommonMessages.DRAG_DROP_NOT_FOUND, null));
    }
}

package com.oet.application.usecases.manageArticles.controller;

import com.oet.application.common.CommonMessages;
import com.oet.application.common.ResponseTemplate;
import com.oet.application.usecases.manageArticles.DTO.AssignmentDTO;
import com.oet.application.usecases.manageArticles.entity.Article;
import com.oet.application.usecases.manageArticles.service.ManageForInstructorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static com.oet.application.common.CommonMessages.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/article")
@RequiredArgsConstructor
@PreAuthorize("hasAnyAuthority('INSTRUCTOR')")
public class ManageForInstructorController {

    private final ManageForInstructorService service;

    @GetMapping("/listForInstructor")
    public ResponseEntity<ResponseTemplate> listAssignmentsForInstructor() {
        List<Article> articles = service.listAssignmentsForInstructor();
        List<AssignmentDTO> assignmentDTOS =  articles.stream()
                .map(item -> new AssignmentDTO(item.getId(), item.getText().getTitle(), item.getEnglishLevel(), item.getOwnerClassrooms().size()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(new ResponseTemplate(SUCCESS, ARTICLE_FOUND, assignmentDTOS));
    }

}

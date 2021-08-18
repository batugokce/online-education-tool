package com.oet.application.usecases.manageReviews.controller;

import com.oet.application.common.ResponseTemplate;
import com.oet.application.usecases.manageAnswers.entity.AnswerForm;
import com.oet.application.usecases.manageReviews.DTO.ReviewDTO;
import com.oet.application.usecases.manageReviews.service.manageReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/v1/review")
@RequiredArgsConstructor
public class manageReviewController {
    private final manageReviewService service;

    @PostMapping
    public ResponseEntity<ResponseTemplate> getCompletedAssignmentsByClassIdAndArticleId(@RequestBody ReviewDTO reviewDTO){
        return service.getCompletedAssignmentsByClassIdAndArticleId(reviewDTO);
    }
    @PostMapping("/{username}")
    public ResponseEntity<ResponseTemplate> getCompletedAssignmentsByStudentUsername(@PathVariable String username){
        return service.getCompletedAssignmentsByStudentId(username);
    }
    @PostMapping("/getAssignmentById/{assignmentId}/{username}")
    public ResponseTemplate getCompletedAssignment(@PathVariable String username,@PathVariable Long assignmentId){
        return service.getCompletedAssignment(username,assignmentId);
    }

}

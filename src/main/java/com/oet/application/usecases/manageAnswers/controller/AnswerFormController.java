package com.oet.application.usecases.manageAnswers.controller;

import com.oet.application.common.ResponseTemplate;
import com.oet.application.usecases.manageAnswers.DTO.GetWrittenAssignmentDTO;
import com.oet.application.usecases.manageAnswers.DTO.FeedbackDTO;
import com.oet.application.usecases.manageAnswers.DTO.ResultDTO;
import com.oet.application.usecases.manageAnswers.DTO.WrittenAssignmentDTO;
import com.oet.application.usecases.manageAnswers.entity.AnswerForm;
import com.oet.application.usecases.manageAnswers.entity.AnswerSection;
import com.oet.application.usecases.manageAnswers.service.AnswerFormService;
import com.oet.application.usecases.manageAnswers.service.AnswerSavingService;
import com.oet.application.usecases.manageAnswers.service.SubmitService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import static com.oet.application.common.CommonMessages.*;

@RestController
@RequestMapping("/api/v1/answer")
@RequiredArgsConstructor
public class AnswerFormController {

    private final AnswerFormService service;
    private final AnswerSavingService savingService;
    private final SubmitService submitService;

    @PreAuthorize("hasAuthority('STUDENT') and #username == authentication.principal.username ")
    @DeleteMapping("/deleteAll/{username}")
    public ResponseEntity<ResponseTemplate> deleteAnswerForm(@PathVariable String username) {
        ResponseTemplate responseTemplate = service.deleteAnswerFormsByUsername(username);
        return ResponseEntity.ok(responseTemplate);
    }

    @PreAuthorize("hasAuthority('STUDENT') and #username == authentication.principal.username ")
    @PostMapping("/startAssignment/{articleId}/{username}")
    public ResponseEntity<ResponseTemplate> retrieveAnswerForm(@PathVariable Long articleId, @PathVariable String username) {
        ResponseTemplate responseTemplate = service.startAssignment(articleId, username);
        return ResponseEntity.ok(responseTemplate);
    }

    @PreAuthorize("hasAuthority('STUDENT') and #username == authentication.principal.username ")
    @PostMapping("/saveAnswers/{articleId}/{username}")
    public ResponseEntity<ResponseTemplate> saveAnswerForm(@PathVariable Long articleId, @PathVariable String username, @RequestBody AnswerForm answerForm) {
        ResponseTemplate responseTemplate = savingService.saveAnswerForm(articleId, username, answerForm);
        return ResponseEntity.ok(responseTemplate);
    }

    @PreAuthorize("hasAuthority('STUDENT') and #username == authentication.principal.username ")
    @PostMapping("/saveSection/{articleId}/{username}")
    public ResponseEntity<ResponseTemplate> saveSection(@PathVariable Long articleId, @PathVariable String username, @RequestBody AnswerSection section){
        if (section.getId() != null) {
            ResponseTemplate responseTemplate = savingService.saveSection(articleId, username, section);
            return ResponseEntity.ok(responseTemplate);
        }
        return ResponseEntity.ok(new ResponseTemplate(ERROR, SECTION_DOES_NOT_CONTAIN_ID, null));
    }

    @PreAuthorize("hasAuthority('STUDENT') and #username == authentication.principal.username ")
    @PostMapping("/submit/{articleId}/{username}")
    public ResponseEntity<ResponseTemplate> submit(@PathVariable Long articleId, @PathVariable String username, @RequestBody AnswerForm answerForm) {
        ResponseTemplate responseTemplate = submitService.submit(articleId, username, answerForm);
        return ResponseEntity.ok(responseTemplate);
    }

    @PreAuthorize("hasAuthority('STUDENT') and #username == authentication.principal.username ")
    @GetMapping("/pastAssignments/{username}")
    public ResponseEntity<ResponseTemplate> getPastAssignments(@PathVariable String username) {
        ResponseTemplate responseTemplate = service.getPastAssignments(username);
        return ResponseEntity.ok(responseTemplate);
    }

    @PreAuthorize("hasAuthority('INSTRUCTOR')")
    @GetMapping("/writtenAssignments/{articleId}/{classId}")
    public ResponseEntity<ResponseTemplate> getWrittenAssignmentsByClassIdAndArticleId(@PathVariable Long classId, @PathVariable Long articleId) {
        ResponseTemplate responseTemplate = service.getWrittenAssignmentDTOsByClassIdAndAssignmentId(classId, articleId);
        return ResponseEntity.ok(responseTemplate);
    }

    @PreAuthorize("hasAuthority('INSTRUCTOR')")
    @GetMapping("/writtenAssignment/{articleId}/{username}")
    public ResponseEntity<ResponseTemplate> getWrittenAssignmentByArticleIdAndUsername(@PathVariable Long articleId, @PathVariable String username) {
        ResponseTemplate responseTemplate = service.getWrittenAssignmentByArticleIdAndUsername(articleId, username);
        return ResponseEntity.ok(responseTemplate);
    }

    @PreAuthorize("hasAuthority('INSTRUCTOR') and #instructorUsername == authentication.principal.username ")
    @GetMapping("/writtenAssignments/{instructorUsername}")
    public ResponseEntity<ResponseTemplate> getWrittenAssignmentOfInstructorClasses(@PathVariable String instructorUsername) {
        ResponseTemplate responseTemplate = service.getAssignmentsByUsername(instructorUsername);
        return ResponseEntity.ok(responseTemplate);
    }

    @PreAuthorize("hasAuthority('INSTRUCTOR') and #instructorUsername == authentication.principal.username")
    @PostMapping("/writtenAssignmentsByParameters/{instructorUsername}")
    public ResponseEntity<ResponseTemplate> getWrittenAssignmentOfInstructorClassesByParameters(@PathVariable String instructorUsername, @RequestBody GetWrittenAssignmentDTO getWrittenAssignmentDTO) {
        ResponseTemplate responseTemplate = service.getAssignmentsByParameters(instructorUsername, getWrittenAssignmentDTO);
        return ResponseEntity.ok(responseTemplate);
    }

    @PreAuthorize("hasAuthority('INSTRUCTOR') and #instructorUsername == authentication.principal.username ")
    @PostMapping("/writtenAssignment/{articleId}/{instructorUsername}/{studentUsername}")
    public ResponseEntity<ResponseTemplate> saveFeedback(@PathVariable Long articleId, @PathVariable String studentUsername, @PathVariable String instructorUsername, @RequestBody WrittenAssignmentDTO  writtenAssignmentDTO) {
        ResponseTemplate responseTemplate = service.saveFeedback(articleId, studentUsername, instructorUsername, writtenAssignmentDTO);
        return ResponseEntity.ok(responseTemplate);
    }

    @PreAuthorize("hasAuthority('INSTRUCTOR')")
    @GetMapping("/assignments/{instructorUserName}")
    public ResponseEntity<ResponseTemplate> getAllAssignmentOfInstructor(@PathVariable String instructorUserName){
        ResponseTemplate responseTemplate=service.getAllAssignmentsByUsername(instructorUserName);
        return ResponseEntity.ok(responseTemplate);
    }
    @PreAuthorize("hasAuthority('INSTRUCTOR')")
    @PostMapping("/assignments/{instructorUsername}/saveFeedback")
    public ResponseEntity<ResponseTemplate> saveTestFeedback(@PathVariable String instructorUsername, @RequestBody FeedbackDTO feedbackDTO){
        ResponseTemplate responseTemplate=service.saveFeedbackOfTest(feedbackDTO, instructorUsername);
        return ResponseEntity.ok(responseTemplate);
    }
    @PreAuthorize("hasAuthority('INSTRUCTOR') OR hasAuthority('STUDENT')")
    @GetMapping("/assignments/getFeedback/{articleID}/{studentUsername}")
    public ResponseEntity<ResponseTemplate> getStudentFeedback(@PathVariable Long articleID,@PathVariable String studentUsername){
        ResponseTemplate responseTemplate=service.getFeedback(articleID,studentUsername);
        return ResponseEntity.ok(responseTemplate);
    }
    @PreAuthorize("hasAuthority('INSTRUCTOR') and #instructorUsername == authentication.principal.username ")
    @GetMapping("/assignments/getParameters/{instructorUsername}")
    public ResponseEntity<ResponseTemplate> getParameters( @PathVariable String instructorUsername) {
        ResponseTemplate responseTemplate = service.getListSearchBarParameters(instructorUsername);
        return ResponseEntity.ok(responseTemplate);
    }


}

package com.oet.application.usecases.manageComments.controller;

import com.oet.application.common.CommonMessages;
import com.oet.application.common.ResponseTemplate;
import com.oet.application.usecases.manageComments.dto.CommentDTO;
import com.oet.application.usecases.manageComments.entity.Comment;
import com.oet.application.usecases.manageComments.mapper.CommentMapper;
import com.oet.application.usecases.manageComments.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Set;

@RestController
@RequestMapping("/api/v1/comment")
@RequiredArgsConstructor
public class CommentController {
    private final CommentService commentService;
    private final CommentMapper commentMapper;

    @PreAuthorize("hasAuthority('STUDENT') and #username == authentication.principal.username ")
    @PostMapping("/save/{articleId}/{username}")
    public ResponseEntity<ResponseTemplate> saveComment(@PathVariable Long articleId, @PathVariable String username, @Valid @RequestBody Comment comment ) {
        return commentService.save(articleId, username, comment);
    }

    @PreAuthorize("hasAuthority('STUDENT') and #username == authentication.principal.username ")
    @GetMapping("/get/{articleId}/{username}")
    public ResponseEntity<ResponseTemplate> getAllComments(@PathVariable Long articleId, @PathVariable String username) {
        return commentService.findAllByArticleIdAndUsername(articleId, username);
    }

    @PreAuthorize("hasAuthority('STUDENT') and #username == authentication.principal.username ")
    @PostMapping("/update/{articleId}/{username}")
    public ResponseEntity<ResponseTemplate> updateComment(@PathVariable Long articleId, @PathVariable String username, @Valid @RequestBody Comment comment ) {
       return commentService.update(articleId, username, comment);
    }

    @PreAuthorize("hasAuthority('STUDENT') and #username == authentication.principal.username ")
    @DeleteMapping("/delete/{creationTimestamp}/{articleId}/{username}")
    public ResponseEntity<ResponseTemplate> deleteComment(@PathVariable Long articleId, @PathVariable String username,  @PathVariable Long creationTimestamp  ) {
        return commentService.delete(articleId, username, creationTimestamp);
    }

}

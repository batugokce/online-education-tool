package com.oet.application.usecases.manageComments.service;

import com.oet.application.common.CommonMessages;
import com.oet.application.common.ResponseTemplate;
import com.oet.application.entity.Student;
import com.oet.application.service.StudentService;
import com.oet.application.usecases.manageArticles.entity.Article;
import com.oet.application.usecases.manageArticles.service.ArticleService;
import com.oet.application.usecases.manageComments.entity.Comment;
import com.oet.application.usecases.manageComments.repository.CommentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import javax.transaction.Transactional;
import java.util.Optional;
import java.util.Set;

import static com.oet.application.common.CommonMessages.ERROR;

@Service
@RequiredArgsConstructor
public class CommentService {
    private final CommentRepository commentRepository;
    private final StudentService studentService;
    private final ArticleService articleService;

    @Transactional
    public ResponseEntity<ResponseTemplate> save(Long articleId, String username, Comment comment) {
        Student studentDB = studentService.findByUsername(username);
        Article articleDB = articleService.findById(articleId);

        if (articleDB == null || studentDB == null) {
            return null;
        }
        comment.setStudent(studentDB);
        comment.setStudentId(studentDB.getId());
        comment.setUsername(studentDB.getUsername());
        comment.setArticleId(articleId);
        Comment newComment = commentRepository.save(comment);
        return ResponseEntity
                .ok(new ResponseTemplate(CommonMessages.SUCCESS, CommonMessages.COMMENT_SAVED, newComment));
    }

    public ResponseEntity<ResponseTemplate>  findAllByArticleIdAndUsername(Long articleId, String username) {
        Set<Comment> commentList = commentRepository.findAllByArticleIdAndUsername(articleId, username);
        return ResponseEntity.ok(new ResponseTemplate(CommonMessages.SUCCESS, CommonMessages.RECORDS_FETCHED, commentList));
    }

    public ResponseEntity<ResponseTemplate> update(Long articleId, String username, Comment newComment) {
        Optional<Comment> commentOptional =commentRepository.findByArticleIdAndUsernameAndCreationTimestamp(articleId, username, newComment.getCreationTimestamp());
        if(commentOptional.isPresent()){
            Comment commentFromDB = commentOptional.get();
            commentFromDB.setMessage(newComment.getMessage());
            Comment updatedComment = commentRepository.save(commentFromDB);
            return ResponseEntity
                    .ok(new ResponseTemplate(CommonMessages.SUCCESS, CommonMessages.COMMENT_UPDATED, updatedComment));
        }
        else{
            return ResponseEntity
                    .ok(new ResponseTemplate(ERROR, CommonMessages.COMMENT_DELETED, null));
        }
    }

    public ResponseEntity<ResponseTemplate> delete(Long articleId, String username, Long creationTimestamp) {
        Optional<Comment> commentOptional =commentRepository.findByArticleIdAndUsernameAndCreationTimestamp(articleId, username, creationTimestamp);
        if(commentOptional.isPresent()){
            Comment commentFromDB = commentOptional.get();
            commentRepository.delete(commentFromDB);
            return ResponseEntity
                    .ok(new ResponseTemplate(CommonMessages.SUCCESS, CommonMessages.COMMENT_DELETED, null));
        }
        else{
            return ResponseEntity
                    .ok(new ResponseTemplate(ERROR, CommonMessages.COMMENT_NOT_FOUND, null));
        }
    }


}

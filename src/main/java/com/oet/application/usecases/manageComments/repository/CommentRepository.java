package com.oet.application.usecases.manageComments.repository;

import com.oet.application.usecases.manageComments.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.Set;

@Repository
public interface CommentRepository extends JpaRepository<Comment,Long> {

    @Query("SELECT c FROM Comment c LEFT JOIN FETCH c.student " +
            "WHERE c.articleId = :articleId AND c.username = :username " +
            "ORDER BY c.id")
    Set<Comment> findAllByArticleIdAndUsername(Long articleId, String username);

    Optional<Comment> findByArticleIdAndUsernameAndCreationTimestamp(Long articleId, String username, Long creationTimestamp);

}

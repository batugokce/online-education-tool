package com.oet.application.usecases.manageAnswers.repository;

import com.oet.application.usecases.manageAnswers.DTO.AssignmentSummary;
import com.oet.application.usecases.manageAnswers.entity.AnswerForm;
import com.oet.application.usecases.manageAnswers.entity.questiontypes.WrittenAnswer;
import com.oet.application.usecases.manageClasses.DTO.StudentAverages;
import com.oet.application.usecases.manageReviews.DTO.ReviewDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;

@Repository
public interface AnswerFormRepository extends JpaRepository<AnswerForm, Long> {

    @Query("SELECT af FROM AnswerForm AS af LEFT JOIN FETCH af.student " +
            "                               LEFT JOIN FETCH af.articleText AS at " +
            "                               LEFT JOIN FETCH af.answerSections AS ass " +
            "                               LEFT JOIN FETCH ass.gapFillingMain AS gfm " +
            "                               LEFT JOIN FETCH gfm.gapFillingAnswers AS gp " +
            "                               LEFT JOIN FETCH ass.matchingAnswers AS ma" +
            "                               LEFT JOIN FETCH ass.multipleChoiceAnswers AS mc" +
            "                               LEFT JOIN FETCH ass.orderingAnswers AS or " +
            "                               LEFT JOIN FETCH ass.trueFalseAnswers AS tf " +
            "                               LEFT JOIN FETCH ass.writtenAnswer AS wa " +
            "WHERE af.articleId = :articleId AND af.username = :username " +
            "ORDER BY ass.order")
    AnswerForm getAnswerFormByArticleIdAndAndStudentId(Long articleId, String username);

    @Query("SELECT af FROM AnswerForm AS af LEFT JOIN FETCH af.student " +
            "                               LEFT JOIN FETCH af.articleText AS at " +
            "                               INNER JOIN FETCH af.answerSections AS ass " +
            "                               LEFT JOIN FETCH ass.writtenAnswer AS wa " +
            "WHERE af.articleId = :articleId AND af.username = :username ")
    AnswerForm getWrittenAssignmentByArticleIdAndAndUsername(Long articleId, String username);

    Set<AnswerForm> findAnswerFormsByUsernameAndIsCompletedIsTrue(String username);

    Set<AnswerForm> findAnswerFormsByArticleId(Long articleId);

    @Query("SELECT new com.oet.application.usecases.manageAnswers.DTO.AssignmentSummary(af.articleId, AVG(af.pointTaken), COUNT(af)) " +
            "FROM AnswerForm AS af " +
            "WHERE af.isCompleted = true AND af.articleId IN :articleIDs  " +
            "GROUP BY af.articleId")
    List<AssignmentSummary> calculateAveragePoints(List<Long> articleIDs);

    void deleteAnswerFormsByStudentId(Long studentId);

    void deleteAnswerFormsByArticleId(Long articleId);

    @Query("SELECT af FROM AnswerForm AS af LEFT JOIN FETCH af.student " +
            "                               LEFT JOIN FETCH af.articleText AS at " +
            "                               LEFT JOIN FETCH af.answerSections AS ass " +
            "                               LEFT JOIN FETCH ass.gapFillingMain AS gfm " +
            "                               LEFT JOIN FETCH gfm.gapFillingAnswers AS gp " +
            "                               LEFT JOIN FETCH ass.matchingAnswers AS ma" +
            "                               LEFT JOIN FETCH ass.multipleChoiceAnswers AS mc" +
            "                               LEFT JOIN FETCH ass.orderingAnswers AS or " +
            "                               LEFT JOIN FETCH ass.trueFalseAnswers AS tf " +
            "                               LEFT JOIN FETCH ass.writtenAnswer AS wa " +
            "WHERE af.username = :username " +
            "ORDER BY ass.order")
    Set<AnswerForm> getAnswerFormByUsername(String username);

    @Query("SELECT af FROM AnswerForm AS af LEFT JOIN FETCH af.student " +
            "                               LEFT JOIN FETCH af.articleText AS at " +
            "                               LEFT JOIN FETCH af.answerSections AS ass " +
            "                               LEFT JOIN FETCH ass.gapFillingMain AS gfm " +
            "                               LEFT JOIN FETCH gfm.gapFillingAnswers AS gp " +
            "                               LEFT JOIN FETCH ass.matchingAnswers AS ma" +
            "                               LEFT JOIN FETCH ass.multipleChoiceAnswers AS mc" +
            "                               LEFT JOIN FETCH ass.orderingAnswers AS or " +
            "                               LEFT JOIN FETCH ass.trueFalseAnswers AS tf " +
            "                               LEFT JOIN FETCH ass.writtenAnswer AS wa " +
            "WHERE af.studentId= :id  AND af.isCompleted=true " +
            "ORDER BY ass.order")
    Set<AnswerForm> getAnswerFormByUsernameAndIsCompleted(Long id);

    @Query("SELECT af FROM AnswerForm AS af LEFT JOIN FETCH af.student " +
            "WHERE af.username= :username AND af.articleId=:articleId")
    AnswerForm getAnswerFormByAssignmentId(Long articleId,String username);



    @Query("SELECT af FROM AnswerForm AS af  LEFT JOIN FETCH af.articleText AS at " +
            "                               LEFT JOIN FETCH af.answerSections AS ass " +
            "                               LEFT JOIN FETCH ass.writtenAnswer AS wa " +
            "WHERE af.articleText.title = :articleName ")
    List<AnswerForm> getWrittenAssignmentsByArticleName(String articleName);

    @Query("SELECT new com.oet.application.usecases.manageClasses.DTO.StudentAverages(af.studentId,'','',AVG(af.pointTaken),SUM(af.pointTaken),COUNT(af))" +
            "FROM AnswerForm AS af " +
            "WHERE af.isCompleted = true AND af.studentId IN :studentIDS  " +
            "GROUP BY af.studentId")
    List<StudentAverages> calculateStudentAverages(List<Long> studentIDS);
}

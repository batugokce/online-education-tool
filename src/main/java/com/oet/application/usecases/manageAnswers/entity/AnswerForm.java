package com.oet.application.usecases.manageAnswers.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.oet.application.common.BaseEntity;
import com.oet.application.entity.Student;
import com.oet.application.usecases.manageArticles.entity.ArticleText;
import com.oet.application.usecases.manageArticles.entity.WordDef;
import lombok.*;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Entity
@Getter
@Setter
@SequenceGenerator(name = "idGenerator", sequenceName = "questionForm_sequence")
@NoArgsConstructor
@AllArgsConstructor
public class AnswerForm extends BaseEntity {

    @ManyToOne
    @JsonIgnore
    private Student student;

    @Column(name = "OWNER_STUDENT_ID")
    private Long studentId;

    @Column(name = "OWNER_STUDENT_USERNAME")
    private String username;

    @Column(name = "ARTICLE_ID")
    private Long articleId;

    @OneToMany(cascade = CascadeType.ALL)
    @OrderBy("order ASC")
    private Set<AnswerSection> answerSections;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private ArticleText articleText;

    @Column(name = "IS_COMPLETED")
    private Boolean isCompleted = false;

    @JsonIgnore
    private Long startTimestamp;

    @JsonIgnore
    private Long finishTimestamp;

    @JsonIgnore
    private Float pointTaken;

    @JsonIgnore
    private Float maxPoint;

    @Transient
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Long timeTaken;

    @Transient
    private Set<WordDef> definitions = new HashSet<>();

    @Column(name = "LAST_SAVED_DATE")
    private String lastSavedDate;

    /* may be added later if required
    @ManyToOne
    private Article article;*/

    @Column(name="FEEDBACK_GIVEN")
    private Boolean feedbackGiven=false;

    @Column(name="FEEDBACK")
    private String feedback="";
    public void setLastSavedTime() {
        String mostRecentSavedTime = this.answerSections.stream().map(AnswerSection::getLastSavedDate)
                .filter(Objects::nonNull)
                .max(String::compareTo)
                .orElse(null);

        DateTimeFormatter formatter
                = DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss");
        LocalDateTime dateTimeFromSections = mostRecentSavedTime != null ? LocalDateTime.parse(mostRecentSavedTime, formatter) : null;
        LocalDateTime dateTime = this.lastSavedDate !=null ? LocalDateTime.parse(this.lastSavedDate, formatter) : null;
        if (mostRecentSavedTime != null && (this.lastSavedDate==null || dateTime.isBefore(dateTimeFromSections))) {
            this.lastSavedDate = mostRecentSavedTime;
        }
    }

    public Boolean isOnlyOneSectionAndWrittenType() {
        return answerSections.size() == 1 && answerSections.stream().iterator().next().getWrittenAnswer() != null;
    }
}

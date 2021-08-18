package com.oet.application.usecases.manageAnswers.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.oet.application.common.BaseEntity;
import com.oet.application.usecases.manageAnswers.DTO.PointDTO;
import com.oet.application.usecases.manageAnswers.entity.questiontypes.*;
import com.oet.application.usecases.manageArticles.entity.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Entity
@Getter
@Setter
@SequenceGenerator(name = "idGenerator", sequenceName = "answerSection_sequence")
@NoArgsConstructor
@AllArgsConstructor
public class AnswerSection extends BaseEntity {

    @Column(name = "NUMBER")
    private Integer order;

    @Column(name = "DESCRIPTION", columnDefinition = "TEXT")
    private String description;

    @Column(name = "POINT")
    private int point;

    @Column(name = "LAST_SAVED_DATE")
    private String lastSavedDate;

    @OrderBy("num ASC")
    @OneToMany(fetch= FetchType.LAZY,cascade = CascadeType.ALL)
    private Set<MultipleChoiceAnswer> multipleChoiceAnswers = new HashSet<>();

    @OrderBy("text ASC")
    @OneToMany(fetch= FetchType.LAZY,cascade = CascadeType.ALL)
    private Set<OrderingAnswer> orderingAnswers = new HashSet<>();

    @OrderBy("text ASC")
    @OneToMany(fetch= FetchType.LAZY,cascade = CascadeType.ALL)
    private Set<TrueFalseAnswer> trueFalseAnswers = new HashSet<>();

    @OrderBy("number ASC")
    @OneToMany(fetch= FetchType.LAZY,cascade = CascadeType.ALL)
    private Set<MatchingAnswer> matchingAnswers = new HashSet<>();

    @OneToOne(fetch= FetchType.LAZY,cascade = CascadeType.ALL)
    private GapFillingMainAnswer gapFillingMain;

    @OneToOne(fetch= FetchType.LAZY,cascade = CascadeType.ALL)
    private WrittenAnswer writtenAnswer;

    public AnswerSection(Integer order, String description, int point) {
        super();
        this.description = description;
        this.order = order;
        this.point = point;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        if (!super.equals(o)) return false;
        AnswerSection that = (AnswerSection) o;
        return order.equals(that.order) &&
                description.equals(that.description);
    }

    public PointDTO calculatePoint(Section section) {
        float maxPoint = section.getPoint();
        if (multipleChoiceAnswers.size() > 0) {
            float pointPerQuestion = maxPoint/multipleChoiceAnswers.size();
            float point = 0;
            MultipleChoiceAnswer answer; MultipleChoice question;
            for (MultipleChoiceAnswer multipleChoiceAnswer : multipleChoiceAnswers) {
                question = section.getMultipleChoices().stream().filter(item -> item.getNum().equals(multipleChoiceAnswer.getNum())).findFirst().orElse(null);
                if (question != null) {
                    question.setStudentAnswer(multipleChoiceAnswer.getStudentAnswer());
                    if (multipleChoiceAnswer.getStudentAnswer().equals(question.getCorrectAnswer())) {
                        point += pointPerQuestion;
                    }
                }
            }
            return new PointDTO(point, maxPoint);
        }
        else if (orderingAnswers.size() > 0) {
            float pointPerQuestion = maxPoint/orderingAnswers.size();
            float point = 0;
            OrderingAnswer answer; Ordering question;
            List<OrderingAnswer> answerList = orderingAnswers.stream().sorted(Comparator.comparing(OrderingAnswer::getText)).collect(Collectors.toList());
            List<Ordering> questionList = section.getOrderings().stream().sorted(Comparator.comparing(Ordering::getText)).collect(Collectors.toList());
            Iterator<OrderingAnswer> answerIterator = answerList.iterator();
            Iterator<Ordering> questionIterator = questionList.iterator();
            while (answerIterator.hasNext()) {
                answer = answerIterator.next();
                question = questionIterator.next();
                if (answer.getStudentOrder() != null) {
                    if (answer.getStudentOrder().equals(question.getCorrectOrder())) {
                        point += pointPerQuestion;
                    }
                    question.setStudentOrder(answer.getStudentOrder());
                }
            }
            return new PointDTO(point, maxPoint);
        }
        else if (trueFalseAnswers.size() > 0) {
            float pointPerQuestion = maxPoint/trueFalseAnswers.size();
            float point = 0;
            TrueFalse question;
            for (TrueFalseAnswer trueFalseAnswer : trueFalseAnswers) {
                question = section.getTrueFalses().stream().filter(item -> item.getText().equals(trueFalseAnswer.getText())).findFirst().orElse(null);
                if (trueFalseAnswer.getStudentAnswer() != null && question != null) {
                    if (trueFalseAnswer.getStudentAnswer().equals(question.getCorrectAnswer())) {
                        point += pointPerQuestion;
                    }
                    question.setStudentAnswer(trueFalseAnswer.getStudentAnswer());
                }
            }
            return new PointDTO(point, maxPoint);
        }
        else if (matchingAnswers.size() > 0 ) {
            float pointPerQuestion = maxPoint/matchingAnswers.size();
            float point = 0;
            Matching question;
            for (MatchingAnswer matchingAnswer : matchingAnswers) {
                question = section.getMatchings().stream().filter(item -> item.getNumber() == matchingAnswer.getNumber()).findFirst().orElse(null);
                if (question != null) {
                    if (matchingAnswer.getStudentRightPart().equals(question.getRightPart())) {
                        point += pointPerQuestion;
                    }
                    question.setStudentRightPart(matchingAnswer.getStudentRightPart());
                    question.setRandomRightPart(matchingAnswer.getRandomRightPart());
                }
            }
            return new PointDTO(point, maxPoint);
        }
        else if (gapFillingMain != null) {
            float pointPerQuestion = maxPoint/gapFillingMain.getGapFillingAnswers().size();
            float point = 0;
            GapFilling question;
            for (GapFillingAnswer gapFillingAnswer : gapFillingMain.getGapFillingAnswers()) {
                question = section.getGapFillingMain().getGapFillings().stream().filter(item -> item.getNum().equals(gapFillingAnswer.getNum())).findFirst().orElse(null);
                if (question != null) {
                    if (gapFillingAnswer.getStudentAnswer().equals(question.getAnswer())) {
                        point += pointPerQuestion;
                    }
                    question.setStudentAnswer(gapFillingAnswer.getStudentAnswer());
                }
            }
            return new PointDTO(point, maxPoint);
        }
        else if (writtenAnswer != null) {
            writtenAnswer.setPoint(0f);
            writtenAnswer.setGraded(false);
            section.getWrittenQuestion().setStudentAnswer(writtenAnswer.getText());
            section.getWrittenQuestion().setGraded(false);
            section.getWrittenQuestion().setPoint(0f);
            return new PointDTO(0,maxPoint);
        }
        else {
            System.out.println("There is a problem in grading..");
            return new PointDTO(0,0);
        }
    }

}

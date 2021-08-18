package com.oet.application;

import com.oet.application.entity.Authority;
import com.oet.application.entity.Instructor;
import com.oet.application.entity.Student;
import com.oet.application.usecases.manageAnswers.entity.AnswerForm;
import com.oet.application.usecases.manageAnswers.entity.AnswerSection;
import com.oet.application.usecases.manageAnswers.entity.questiontypes.MatchingAnswer;
import com.oet.application.usecases.manageAnswers.entity.questiontypes.MultipleChoiceAnswer;
import com.oet.application.usecases.manageAnswers.entity.questiontypes.OrderingAnswer;
import com.oet.application.usecases.manageAnswers.entity.questiontypes.TrueFalseAnswer;
import com.oet.application.usecases.manageArticles.entity.*;
import com.oet.application.usecases.manageClasses.entity.Classroom;
import com.oet.application.usecases.manageClasses.enums.EnglishLevel;
import com.oet.application.usecases.manageComments.entity.Comment;

import java.util.Arrays;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

public class CommonEntities {

    public static AnswerForm getNonCompleteAnswerForm() {
        AnswerForm answerForm = new AnswerForm();
        answerForm.setId(1L);
        answerForm.setIsCompleted(false);
        answerForm.setAnswerSections(new HashSet<>());
        answerForm.setStartTimestamp(new Date().getTime());
        answerForm.setArticleText(getArticleText());
        answerForm.setStudent(getStudent());
        return answerForm;
    }

    public static AnswerForm getCompleteAnswerForm() {
        AnswerForm answerForm = new AnswerForm();
        answerForm.setId(1L);
        answerForm.setIsCompleted(true);
        answerForm.setAnswerSections(new HashSet<>());
        answerForm.setStartTimestamp(new Date().getTime());
        answerForm.setFinishTimestamp(new Date().getTime()+10000L);
        answerForm.setPointTaken(40f);
        answerForm.setMaxPoint(100f);
        answerForm.setArticleText(getArticleText());
        return answerForm;
    }

    public static Student getStudent() {
        Student student = new Student();
        student.setId(1L);
        student.setUsername("username");
        student.setStudentNo("e123456");
        student.setAuthorities(new HashSet<>());
        student.setClassroom(getClassroom());
        return student;
    }

    public static Instructor getInstructor() {
        Instructor instructor = new Instructor();
        instructor.setId(1L);
        instructor.setClassrooms(new HashSet<>());
        return instructor;
    }

    public static Authority getAuthority() {
        Authority authority = new Authority();
        authority.setAuthority("USER");
        return authority;
    }

    public static Article getArticle() {
        Article article = new Article();
        article.setSections(new HashSet<>());
        article.setId(1L);
        article.setText(getArticleText());
        article.getText().setTitle("Title");
        article.setClassroomId(1L);
        article.setOwnerClassrooms(new HashSet<>());
        return article;
    }

    public static ArticleText getArticleText() {
        ArticleText articleText = new ArticleText();
        articleText.setText("text of article");
        articleText.setTitle("title");
        articleText.setId(1L);
        return articleText;
    }

    public static Section getSection() {
        Section section = new Section();
        section.setId(1L);
        section.setOrder(1);
        section.setDescription("This is a description");
        section.setPoint(20);
        return section;
    }

    public static Classroom getClassroom() {
        Classroom classroom = new Classroom();
        classroom.setCapacity(10);
        classroom.setClassName("Class Name");
        classroom.setId(1L);
        classroom.setEnglishLevel(EnglishLevel.ELEMENTARY);
        classroom.setInstructors(new HashSet<>());
        classroom.setStudents(new HashSet<>());
        classroom.setArticles(new HashSet<>());
        return classroom;
    }

    public static Comment getComment() {
        Comment comment = new Comment();
        comment.setMessage("Comment message");
        comment.setColor("White");
        comment.setCreationTimestamp(new Date().getTime());
        return comment;
    }

    public static AnswerSection getMCAnswerSection() {
        AnswerSection answerSection = new AnswerSection(1, "This is a description", 20);
        answerSection.setId(1L);
        answerSection.setOrder(1);
        MultipleChoiceAnswer multipleChoiceAnswer = new MultipleChoiceAnswer();
        multipleChoiceAnswer.setNum(1);
        multipleChoiceAnswer.setStudentAnswer("correct");
        Set<MultipleChoiceAnswer> multipleChoiceAnswers = Set.of(multipleChoiceAnswer);
        answerSection.setMultipleChoiceAnswers(multipleChoiceAnswers);
        return answerSection;
    }



    public static AnswerSection getTFAnswerSection() {
        AnswerSection answerSection = new AnswerSection(1, "This is a description", 20);
        answerSection.setId(2L);
        answerSection.setOrder(2);
        TrueFalseAnswer trueFalseAnswer = new TrueFalseAnswer();
        trueFalseAnswer.setStudentAnswer(1);
        trueFalseAnswer.setText("question text");
        trueFalseAnswer.setId(1L);
        answerSection.setTrueFalseAnswers(Set.of(trueFalseAnswer));
        return answerSection;
    }

    public static AnswerSection getOrderingAnswerSection() {
        AnswerSection answerSection = new AnswerSection(1, "This is a description", 20);
        answerSection.setId(3L);
        answerSection.setOrder(3);
        OrderingAnswer orderingAnswer = new OrderingAnswer();
        orderingAnswer.setStudentOrder(1);
        orderingAnswer.setText("question text");
        orderingAnswer.setId(1L);
        answerSection.setOrderingAnswers(Set.of(orderingAnswer));
        return answerSection;
    }

    public static AnswerSection getMatchingAnswerSection() {
        AnswerSection answerSection = new AnswerSection(1, "This is a description", 20);
        answerSection.setId(4L);
        answerSection.setOrder(4);
        MatchingAnswer matchingAnswer = new MatchingAnswer();
        matchingAnswer.setLeftPart("left");
        matchingAnswer.setStudentRightPart("right");
        matchingAnswer.setNumber(1);
        matchingAnswer.setId(1L);
        answerSection.setMatchingAnswers(Set.of(matchingAnswer));
        return answerSection;
    }

    public static Section getMCSection() {
        Section section = getSection();
        section.setId(1L);
        section.setOrder(1);
        MultipleChoice multipleChoice = new MultipleChoice();
        multipleChoice.setStudentAnswer("");
        multipleChoice.setCorrectAnswer("correct");
        multipleChoice.setNum(1);
        Set<MultipleChoice> multipleChoices = Set.of(multipleChoice);
        section.setMultipleChoices(multipleChoices);
        return section;
    }

    public static Section getTFSection() {
        Section section = getSection();
        section.setId(2L);
        section.setOrder(2);
        TrueFalse trueFalse = new TrueFalse();
        trueFalse.setStudentAnswer(1);
        trueFalse.setCorrectAnswer(1);
        trueFalse.setText("question text");
        trueFalse.setId(1L);
        section.setTrueFalses(Set.of(trueFalse));
        return section;
    }

    public static Section getOrderingSection() {
        Section section = getSection();
        section.setId(3L);
        section.setOrder(3);
        Ordering ordering = new Ordering();
        ordering.setStudentOrder(1);
        ordering.setCorrectOrder(1);
        ordering.setText("question text");
        ordering.setId(1L);
        section.setOrderings(Set.of(ordering));
        return section;
    }

    public static Section getMatchingSection() {
        Section section = getSection();
        section.setId(4L);
        section.setOrder(4);
        Matching matching = new Matching();
        matching.setLeftPart("left");
        matching.setRightPart("right");
        matching.setId(1L);
        matching.setNumber(1);
        matching.setStudentRightPart("right");
        section.setMatchings(Set.of(matching));
        return section;
    }



    public static Set<Section> getSectionSetWithQuestions() {
        Set<Section> sections = new HashSet<>();
        sections.add(getMCSection());
        sections.add(getTFSection());
        sections.add(getOrderingSection());
        sections.add(getMatchingSection());
        return sections;
    }

    public static Set<AnswerSection> getAnswerSectionSetWithAnswers() {
        Set<AnswerSection> answerSections = new HashSet<>();
        answerSections.add(getMCAnswerSection());
        answerSections.add(getTFAnswerSection());
        answerSections.add(getOrderingAnswerSection());
        answerSections.add(getMatchingAnswerSection());
        return answerSections;
    }

}

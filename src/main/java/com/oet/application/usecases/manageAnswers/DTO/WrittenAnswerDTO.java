package com.oet.application.usecases.manageAnswers.DTO;

import com.oet.application.usecases.manageAnswers.entity.questiontypes.WrittenAnswer;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Getter
@Setter
@AllArgsConstructor
public class WrittenAnswerDTO {

    private WrittenAnswer writtenAnswer;

    private Boolean isLastFeedbackGiven;

    private String lastFeedback;

    private Boolean isCompleted;

    private String title;

    private String username;

    private Long articleId;

    private Float point;
}

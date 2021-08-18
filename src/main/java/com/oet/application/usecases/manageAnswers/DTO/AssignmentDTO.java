package com.oet.application.usecases.manageAnswers.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Getter
@Setter
@AllArgsConstructor
public class AssignmentDTO {

    private Long classId;

    private String className;

    private Long studentId;

    private String name;

    private String Surname;

    private String studentNo;

    private String articleName;

    private Boolean isWritten;

    private Feedback2DTO links;

    private Boolean feedbackGiven;
    
}

package com.oet.application.usecases.manageAnswers.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class AssignmentListParametersDTO {
    List<String> names;

    List<String> classrooms;

    List<String> titles;
}

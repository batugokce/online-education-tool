package com.oet.application.usecases.manageClasses.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@AllArgsConstructor

@Getter

@Setter
public class AssignmentSummaryDTO {
    private Set<AssignmentPoints> completedSet;

    private Set<AssignmentPoints> allSet;
}

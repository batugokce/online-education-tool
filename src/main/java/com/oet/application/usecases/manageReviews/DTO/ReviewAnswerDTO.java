package com.oet.application.usecases.manageReviews.DTO;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Getter
@AllArgsConstructor
@Setter
public class ReviewAnswerDTO {
    private long studentID;
    private String name;
    private String surname;


}

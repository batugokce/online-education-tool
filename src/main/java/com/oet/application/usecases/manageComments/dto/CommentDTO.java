package com.oet.application.usecases.manageComments.dto;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Getter;


@Getter
@Builder
public class CommentDTO {
    public final String message;
    public final String color;

    @JsonCreator
    public CommentDTO(@JsonProperty("message") String message,
                       @JsonProperty("color") String color){
        this.message = message;
        this.color = color;

    }
}

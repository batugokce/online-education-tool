package com.oet.application.common;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
public class ResponseTemplate {
    private String type;

    private String message;

    private Object data;
}

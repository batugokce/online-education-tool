package com.oet.application.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
@AllArgsConstructor
public class ForgotPasswordDTO {
    public String type;
    public String text;
}

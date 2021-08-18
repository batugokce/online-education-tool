package com.oet.application.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
@AllArgsConstructor
public class ChangePasswordDTO {
    public String token;
    public String password;
}

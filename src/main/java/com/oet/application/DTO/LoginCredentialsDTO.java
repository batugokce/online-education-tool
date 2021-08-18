package com.oet.application.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
@AllArgsConstructor
public class LoginCredentialsDTO {

    private final String username;

    private final String password;

}

package com.oet.application.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
@AllArgsConstructor
public class UserInfoDTO {
    private String name;
    private String surname;
    private String username;
    private String telephoneNumber;
    private String emailAddress;
}

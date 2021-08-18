package com.oet.application.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ChangePasswordFromProfileDTO {
    private String oldPass;
    private String newPass;
    private String username;
}

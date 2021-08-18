package com.oet.application.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class EditProfileDTO {

    private String username;

    private String email;

    private String telephoneNumber;
}

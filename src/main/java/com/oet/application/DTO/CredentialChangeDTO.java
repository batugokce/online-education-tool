package com.oet.application.DTO;

import lombok.*;

@Getter
@AllArgsConstructor
@Builder
public class CredentialChangeDTO {

    private final Long id;
    private final String oldPassword;
    private final String newPassword;

}

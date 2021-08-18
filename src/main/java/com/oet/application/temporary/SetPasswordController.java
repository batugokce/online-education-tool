package com.oet.application.temporary;

import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/resetAllPasswords")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('ADMIN')")
public class SetPasswordController {

    private final SetPasswordService service;

    @PutMapping
    public void resetAllPasswords() {
        service.resetAllPasswords();
    }

}

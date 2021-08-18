package com.oet.application.controller;

import com.oet.application.DTO.CredentialChangeDTO;
import com.oet.application.common.CommonMessages;
import com.oet.application.common.PersonEntity;
import com.oet.application.common.ResponseTemplate;
import com.oet.application.entity.Student;
import com.oet.application.repository.PersonRepository;
import com.oet.application.service.PersonService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/person")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('ADMIN')")
public class PersonController {

    private final PersonService service;

    @PutMapping("/changePassword")
    public ResponseEntity<ResponseTemplate> changePassword(@RequestBody CredentialChangeDTO object) {
        PersonEntity person = service.changePassword(object.getId(),object.getOldPassword(),object.getNewPassword());
        if (person == null) {
            return ResponseEntity
                    .ok(new ResponseTemplate(CommonMessages.ERROR, CommonMessages.PASSWORD_CHANGE_FAILURE, null));
        }
        return ResponseEntity
                .ok(new ResponseTemplate(CommonMessages.SUCCESS, CommonMessages.PASSWORD_CHANGE_SUCCESS, person));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseTemplate> deleteRecord(@PathVariable Long id) {
        service.deleteRecord(id);
        return ResponseEntity.ok(new ResponseTemplate(CommonMessages.SUCCESS,CommonMessages.RECORD_DELETED, null));
    }

}

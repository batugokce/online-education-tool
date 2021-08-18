package com.oet.application.controller;

import com.oet.application.DTO.CredentialChangeDTO;
import com.oet.application.common.CommonMessages;
import com.oet.application.common.ResponseTemplate;
import com.oet.application.entity.Admin;
import com.oet.application.entity.Student;
import com.oet.application.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('ADMIN')")
public class AdminController {

    private final AdminService service;

    @PostMapping
    public ResponseEntity<ResponseTemplate> createAdmin(@RequestBody Admin admin) {
        Admin returnedAdmin = service.create(admin);
        return ResponseEntity
                .ok(new ResponseTemplate(CommonMessages.SUCCESS, CommonMessages.USER_CREATED, returnedAdmin));
    }

    @GetMapping
    public ResponseEntity<ResponseTemplate> getAllAdmins() {
        List<Admin> admins = service.findAll();
        return ResponseEntity.ok(new ResponseTemplate(CommonMessages.SUCCESS, CommonMessages.RECORDS_FETCHED, admins));
    }

    @DeleteMapping
    public ResponseEntity<ResponseTemplate> deleteAllAdmins() {
        service.deleteAll();
        return ResponseEntity.ok(new ResponseTemplate(CommonMessages.SUCCESS, CommonMessages.RECORDS_DELETED, null));
    }

    @GetMapping("/find/{id}")
    public ResponseEntity<ResponseTemplate> getAdminById(@PathVariable Long id) {
        Admin admin = service.findById(id);
        if (admin != null) {
            return ResponseEntity.ok(new ResponseTemplate(CommonMessages.SUCCESS, CommonMessages.USER_FOUND, admin));
        }
        return ResponseEntity
                .ok(new ResponseTemplate(CommonMessages.ERROR, CommonMessages.USER_NOT_FOUND, null));
    }

}

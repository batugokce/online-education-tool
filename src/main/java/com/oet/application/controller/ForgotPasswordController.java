package com.oet.application.controller;

import com.oet.application.DTO.ChangePasswordDTO;
import com.oet.application.DTO.ChangePasswordFromProfileDTO;
import com.oet.application.DTO.ForgotPasswordDTO;
import com.oet.application.common.CommonMessages;
import com.oet.application.common.PersonEntity;
import com.oet.application.common.ResponseTemplate;
import com.oet.application.service.ForgotPasswordService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/forgot-password")
@RequiredArgsConstructor
public class ForgotPasswordController {
    private final ForgotPasswordService service;

    @PostMapping
    public ResponseEntity<ResponseTemplate> forgotPassword(@RequestBody ForgotPasswordDTO forgotPasswordDTO)
    {
           return ResponseEntity.ok(service.forgotPassword(forgotPasswordDTO));
    }
    @PostMapping("/validate")
    public ResponseEntity<ResponseTemplate> validate(@RequestBody ChangePasswordDTO changePasswordDTO)
    {
        if(service.validateToken(changePasswordDTO.getToken())){
            return ResponseEntity.ok(new ResponseTemplate(CommonMessages.SUCCESS,CommonMessages.SUCCESS,null));
        }
        else{
            return ResponseEntity.ok(new ResponseTemplate(CommonMessages.ERROR,CommonMessages.ERROR,null));
        }
    }
    @PostMapping("/change")
    public ResponseEntity<ResponseTemplate> changePassword(@RequestBody ChangePasswordDTO changePasswordDTO){
        return service.changePassword(changePasswordDTO.getToken(),changePasswordDTO.getPassword());
    }
    @PostMapping("/changePass")
    public ResponseEntity<ResponseTemplate> changePassword(@RequestBody ChangePasswordFromProfileDTO changePasswordDTO){
        return service.changePasswordFromProfile(changePasswordDTO.getOldPass(),changePasswordDTO.getNewPass(),changePasswordDTO.getUsername());
    }


}

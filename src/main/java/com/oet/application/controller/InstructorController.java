package com.oet.application.controller;

import com.oet.application.DTO.StudentInfoDTO;
import com.oet.application.DTO.UserInfoDTO;
import com.oet.application.common.MailService;
import com.oet.application.DTO.PasswordService;
import com.oet.application.common.CommonMessages;
import com.oet.application.common.ResponseTemplate;
import com.oet.application.entity.Instructor;
import com.oet.application.service.InstructorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import javax.validation.Valid;
import org.springframework.validation.BindingResult;

@RestController
@RequestMapping("/api/v1/instructor")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('ADMIN')")
public class InstructorController {

    private final InstructorService service;
    private final JavaMailSender javaMailSender;
    private final MailService mailService;

    @PostMapping
    public ResponseEntity<ResponseTemplate> createInstructor(@Valid @RequestBody Instructor instructor,BindingResult bindingresult) {
        if (bindingresult.hasErrors()) {
           return ResponseEntity.ok(new ResponseTemplate(CommonMessages.ERROR, bindingresult.getAllErrors().get(0).getDefaultMessage(), null));}
        PasswordService pass=new PasswordService();
        //MailService mail=new MailService();
        String password=pass.newpassword(12);
        /*SimpleMailMessage msg=mail.mail_template(instructor,password);
        javaMailSender.send(msg);*/
        System.out.println(password);
        instructor.setPassword(password);
        Instructor returnedInstructor = service.create(instructor);
        if (returnedInstructor == null) {
            return ResponseEntity.ok(new ResponseTemplate(CommonMessages.ERROR, CommonMessages.USERNAME_EXISTS, null));
        }
        return ResponseEntity
                .ok(new ResponseTemplate(CommonMessages.SUCCESS, CommonMessages.USER_CREATED, returnedInstructor));}

    @GetMapping
    public ResponseEntity<ResponseTemplate> getAllInstructors() {
        List<Instructor> instructors = service.findAll();
        return ResponseEntity.ok(new ResponseTemplate(CommonMessages.SUCCESS, CommonMessages.RECORDS_FETCHED, instructors));
    }

    @DeleteMapping
    public ResponseEntity<ResponseTemplate> deleteAllInstructors() {
        service.deleteAll();
        return ResponseEntity.ok(new ResponseTemplate(CommonMessages.SUCCESS, CommonMessages.RECORDS_DELETED, null));
    }

    @GetMapping("/find/{id}")
    public ResponseEntity<ResponseTemplate> getInstructorById(@PathVariable Long id) {
        Instructor instructor = service.findById(id);
        if (instructor != null) {
            return ResponseEntity.ok(new ResponseTemplate(CommonMessages.SUCCESS, CommonMessages.USER_FOUND, instructor));
        }
        return ResponseEntity
                .ok(new ResponseTemplate(CommonMessages.ERROR, CommonMessages.USER_NOT_FOUND, null));
    }

    @GetMapping("/findByUsername/{username}")
    @PreAuthorize("hasAuthority('INSTRUCTOR')")
    public ResponseEntity<ResponseTemplate> getInstructorByUsername(@PathVariable String username) {
        Instructor instructor = service.findByUsername(username);
        if (instructor != null) {
            UserInfoDTO userInfoDTO = new UserInfoDTO(instructor.getName(), instructor.getSurname(), instructor.getUsername(), instructor.getTelephoneNumber(), instructor.getEmailAddress());
            return ResponseEntity.ok(new ResponseTemplate(CommonMessages.SUCCESS, CommonMessages.USER_FOUND, userInfoDTO));
        }

        return ResponseEntity
                .ok(new ResponseTemplate(CommonMessages.ERROR, CommonMessages.USER_NOT_FOUND, null));
    }

}

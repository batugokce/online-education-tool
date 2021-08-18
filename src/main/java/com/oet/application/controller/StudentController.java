package com.oet.application.controller;

import com.oet.application.DTO.*;

import static com.oet.application.common.CommonMessages.*;

import com.oet.application.common.MailService;
import com.oet.application.common.ResponseTemplate;
import com.oet.application.entity.Student;
import com.oet.application.enums.Level;
import com.oet.application.enums.StudentLevel;
import com.oet.application.service.StudentService;
import com.oet.application.usecases.manageProfilePictures.entity.ProfilePicture;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.mail.javamail.JavaMailSender;

import java.io.IOException;
import java.util.List;
import java.util.Objects;
import javax.validation.Valid;
import org.springframework.validation.BindingResult;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/student")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('ADMIN')")
public class StudentController {

    private final StudentService service;
    private final JavaMailSender javaMailSender;
    private final MailService mailService;
    private final PasswordEncoder passwordEncoder;


    @PostMapping
    public ResponseEntity<ResponseTemplate> createStudent(@Valid @RequestBody Student student, BindingResult bindingresult) {
        if (bindingresult.hasErrors()) {
            return ResponseEntity.ok(new ResponseTemplate(ERROR, bindingresult.getAllErrors().get(0).getDefaultMessage(), null));}

        PasswordService pass=new PasswordService();
        //MailService mail=new MailService();
        String password=pass.newpassword(12);
        student.setPassword(password);
        student.setLevel(StudentLevel.NEWBIE);
        System.out.println(password);
        student.setBanned(false);
        Student returnedStudent = service.create(student);
        if (returnedStudent == null){
            return ResponseEntity.ok(new ResponseTemplate(ERROR, USERNAME_OR_STUDENT_NO_EXISTS, null));
        }
        /*SimpleMailMessage msg=mail.mail_template(student,password);
        javaMailSender.send(msg);*/
        return ResponseEntity
                .ok(new ResponseTemplate(SUCCESS, USER_CREATED, null));
    }

    @GetMapping
    public ResponseEntity<ResponseTemplate> getAllStudents() {
        List<Student> students = service.findAll();
        return ResponseEntity.ok(new ResponseTemplate(SUCCESS, RECORDS_FETCHED, students));
    }

    @GetMapping("/credentials")
    public ResponseEntity<ResponseTemplate> getStudentsCredentials() {
        List<LoginCredentialsDTO> students = service.findStudentsWithCredentials();
        return ResponseEntity.ok(new ResponseTemplate(SUCCESS, RECORDS_FETCHED, students));
    }

    @DeleteMapping
    public ResponseEntity<ResponseTemplate> deleteAllStudents() {
        service.deleteAll();
        return ResponseEntity.ok(new ResponseTemplate(SUCCESS, RECORDS_DELETED, null));
    }

    @GetMapping("/find/{id}")
    public ResponseEntity<ResponseTemplate> getStudentById(@PathVariable Long id) {
        Student student = service.findById(id);
        if (student != null) {
            return ResponseEntity.ok(new ResponseTemplate(SUCCESS, USER_FOUND, student));
        }
        return ResponseEntity
                .ok(new ResponseTemplate(ERROR, USER_NOT_FOUND, null));
    }
    @PreAuthorize("hasAnyAuthority('STUDENT','INSTRUCTOR')")
    @GetMapping("/findByName/{username}")
    public ResponseEntity<ResponseTemplate> getStudentByUsername(@PathVariable String username) {
        Student student = service.findByUsername(username);
        if (student == null) {
            return ResponseEntity.ok(new ResponseTemplate(ERROR, USER_NOT_FOUND, null));
        }
        StudentInfoDTO userInfoDTO = student.getClassroom() != null ?
                new StudentInfoDTO(student.getId(),student.getStudentNo(), student.getClassroom().getClassName(), student.getClassroom().getEnglishLevel().lowerCase, student.getName(),student.getSurname(),student.getUsername(),student.getTelephoneNumber(),student.getEmailAddress(), student.getLevel().lowerCase) :
                new StudentInfoDTO(student.getId(),student.getStudentNo(), "No classroom", "Undefined", student.getName(),student.getSurname(),student.getUsername(),student.getTelephoneNumber(),student.getEmailAddress(), student.getLevel().lowerCase);

        return ResponseEntity.ok(new ResponseTemplate(SUCCESS, USER_FOUND, userInfoDTO));
    }
    @PreAuthorize("hasAnyAuthority('STUDENT')")
    @PostMapping("/changeName/{username}")
    public ResponseEntity<ResponseTemplate> changeName(@PathVariable String username,@RequestParam String newname) {
        Student student=service.findByUsername(username);
        service.changeName(student,newname);
        return ResponseEntity.ok(new ResponseTemplate(SUCCESS, FIELD_CHANGED,null));
    }
    @PreAuthorize("hasAnyAuthority('STUDENT')")
    @PostMapping("/changeSurname/{username}")
    public ResponseEntity<ResponseTemplate> changeSurname(@PathVariable String username,@RequestParam String surname) {
        Student student=service.findByUsername(username);
        service.changeSurname(student,surname);
        return ResponseEntity.ok(new ResponseTemplate(SUCCESS, FIELD_CHANGED,null));
    }
    @PreAuthorize("hasAnyAuthority('STUDENT')")
    @PostMapping("/changeEmail/{username}")
    public ResponseEntity<ResponseTemplate> changeEmail(@PathVariable String username,@RequestParam String email) {
        Student student=service.findByUsername(username);
        service.changeEmailAddress(student,email);
        return ResponseEntity.ok(new ResponseTemplate(SUCCESS, FIELD_CHANGED,null));
    }
    @PreAuthorize("hasAnyAuthority('STUDENT')")
    @PostMapping("/changeTelephone/{username}")
    public ResponseEntity<ResponseTemplate> changeTelephoneNumber(@PathVariable String username,@RequestParam String telnum) {
        Student student=service.findByUsername(username);
        service.changeTelephoneNumber(student,telnum);
        return ResponseEntity.ok(new ResponseTemplate(SUCCESS, FIELD_CHANGED,null));
    }
    @PreAuthorize("hasAnyAuthority('STUDENT')")
    @PostMapping("/changePassword/{username}")
    public ResponseEntity<ResponseTemplate> changePassword(@PathVariable String username,@RequestBody PasswordInfoDTO passwordInfoDTO) {
        Student student=service.findByUsername(username);
        if (null == student || !passwordEncoder.matches(passwordInfoDTO.getOldpass(), student.getPassword())){
            return ResponseEntity.ok(new ResponseTemplate(ERROR, WRONG_PASSWORD,null));
        }
        service.changePassword(student,passwordInfoDTO.getNewpass());
        return ResponseEntity.ok(new ResponseTemplate(SUCCESS, PASSWORD_CHANGE_SUCCESS,null));
    }
    @PreAuthorize("hasAnyAuthority('STUDENT')")
    @PostMapping("/changeImage/{username}")
    public ResponseEntity<ResponseTemplate> changeImage(@PathVariable String username, @RequestParam("file") MultipartFile file) throws IOException {
        try {
            service.changeImage(username, file);
            return ResponseEntity.ok(new ResponseTemplate(SUCCESS, FIELD_CHANGED, null));
        }
            catch(Exception e){
                return ResponseEntity.ok(new ResponseTemplate(ERROR,ERROR,null));
            }
    }
    @PreAuthorize("hasAnyAuthority('STUDENT')")
    @GetMapping("/getImage/{username}")
    public ResponseEntity<ResponseTemplate> getImage(@PathVariable String username){
        try
        {
            ProfilePicture profilePicture=service.getImage(username);
            return ResponseEntity.ok(new ResponseTemplate(SUCCESS, RECORDS_FETCHED, profilePicture));
        }
        catch (Exception e)
        {
            return ResponseEntity.ok(new ResponseTemplate(ERROR,ERROR,null));
        }
    }
    @PreAuthorize("hasAnyAuthority('STUDENT')")
    @GetMapping("/removeImage/{username}")
    public ResponseEntity<ResponseTemplate> removeImage(@PathVariable String username){
        try
        {
            service.removeImage(username);
            return ResponseEntity.ok(new ResponseTemplate(SUCCESS, RECORDS_FETCHED, null));
        }
        catch (Exception e)
        {
            return ResponseEntity.ok(new ResponseTemplate(ERROR,ERROR,null));
        }
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @PutMapping("/ban/{id}")
    public ResponseEntity<ResponseTemplate> banStudent(@PathVariable Long id) {
        ResponseTemplate responseTemplate = service.ban(id);
        return ResponseEntity.ok(responseTemplate);
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @PutMapping("/unban/{id}")
    public ResponseEntity<ResponseTemplate> unbanStudent(@PathVariable Long id) {
        ResponseTemplate responseTemplate = service.unban(id);
        return ResponseEntity.ok(responseTemplate);
    }
}







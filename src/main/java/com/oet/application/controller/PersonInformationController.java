package com.oet.application.controller;

import com.oet.application.DTO.EditProfileDTO;
import com.oet.application.common.CommonMessages;
import com.oet.application.common.PersonEntity;
import com.oet.application.common.ResponseTemplate;
import com.oet.application.service.PersonInformationService;
import com.oet.application.usecases.manageClasses.DTO.InstructorDTO;
import com.oet.application.usecases.manageClasses.DTO.StudentDTO;
import com.oet.application.usecases.managePeopleForAdmin.service.ManagePeopleService;
import com.oet.application.usecases.manageProfilePictures.entity.ProfilePicture;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

import static com.oet.application.common.CommonMessages.*;
import static com.oet.application.common.CommonMessages.ERROR;

@RestController
@RequestMapping("/api/v1/personInformation")
@RequiredArgsConstructor
public class PersonInformationController {
    private final PersonInformationService personInformationService;
    private final ManagePeopleService managePeopleService;

    @GetMapping("get/{username}")
    public ResponseEntity<ResponseTemplate> getByUsername(@PathVariable String username){
        return personInformationService.findByUsername(username);
    }
    @GetMapping("getClass/{username}")
    public ResponseEntity<ResponseTemplate> getClassroomByUsername(@PathVariable String username)
    {
        return personInformationService.findClass(username);
    }
    @PostMapping("/changeImage/{username}")
    public ResponseEntity<ResponseTemplate> changeImage(@PathVariable String username, @RequestParam("file") MultipartFile file) throws IOException {
        try {
            personInformationService.changeImage(username, file);
            return ResponseEntity.ok(new ResponseTemplate(SUCCESS, FIELD_CHANGED, null));
        }
        catch(Exception e){
            return ResponseEntity.ok(new ResponseTemplate(ERROR,ERROR,null));
        }
    }
    @GetMapping("/getImage/{username}")
    public ResponseEntity<ResponseTemplate> getImage(@PathVariable String username){
        try
        {
            ProfilePicture profilePicture=personInformationService.getImage(username);
            return ResponseEntity.ok(new ResponseTemplate(SUCCESS, RECORDS_FETCHED, profilePicture));
        }
        catch (Exception e)
        {
            return ResponseEntity.ok(new ResponseTemplate(ERROR,ERROR,null));
        }
    }
    @PreAuthorize("hasAuthority('INSTRUCTOR')")
    @PutMapping("/updateInstructor")
    public ResponseEntity<ResponseTemplate> updateInstructor(@RequestBody InstructorDTO instructorDTO) {
        return managePeopleService.updateInstructor(instructorDTO);
    }
    @PreAuthorize("hasAuthority('STUDENT')")
    @PutMapping("/updateStudent")
    public ResponseEntity<ResponseTemplate> updateStudent(@RequestBody StudentDTO StudentDTO) {
        return managePeopleService.updateStudent(StudentDTO);
    }
    @PostMapping("editProfile/{username}")
    public ResponseEntity<ResponseTemplate> editProfile(@PathVariable String username, @RequestBody EditProfileDTO editProfileDTO){
        return ResponseEntity.ok(personInformationService.editProfile(username,editProfileDTO));
    }
    @PreAuthorize("#username == authentication.principal.username ")
    @GetMapping("/removeImage/{username}")
    public ResponseEntity<ResponseTemplate> removeImage(@PathVariable String username){
        return ResponseEntity.ok(personInformationService.removeImage(username));
    }


}

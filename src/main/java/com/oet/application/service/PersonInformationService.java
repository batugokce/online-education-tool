package com.oet.application.service;

import com.oet.application.DTO.EditProfileDTO;
import com.oet.application.DTO.InstructorInfoDTO;
import com.oet.application.DTO.PersonInformationDTO;
import com.oet.application.DTO.StudentInfoDTO;
import com.oet.application.common.CommonMessages;
import com.oet.application.common.PersonEntity;
import com.oet.application.common.ResponseTemplate;
import com.oet.application.entity.Authority;
import com.oet.application.entity.Instructor;
import com.oet.application.entity.Student;
import com.oet.application.repository.InstructorRepository;
import com.oet.application.repository.PersonRepository;
import com.oet.application.repository.StudentRepository;
import com.oet.application.usecases.manageClasses.entity.Classroom;
import com.oet.application.usecases.manageProfilePictures.entity.ProfilePicture;
import com.oet.application.usecases.manageProfilePictures.service.ProfilePictureService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashSet;
import java.util.Set;

import static com.oet.application.common.CommonMessages.*;
import static com.oet.application.common.CommonMessages.USER_FOUND;

@Service
@RequiredArgsConstructor
@Transactional
public class PersonInformationService {
    private final PersonRepository personRepository;
    private final StudentRepository studentRepository;
    private final InstructorRepository instructorRepository;
    private final ProfilePictureService profilePictureService;
    private final StudentService studentService;
    private final InstructorService instructorService;

    public ResponseEntity<ResponseTemplate> findByUsername(String username){
       Student student=studentService.findByUsername(username);
        if (student == null) {
            Instructor instructor=instructorService.findByUsername(username);
            if(instructor==null)
                return ResponseEntity.ok(new ResponseTemplate(ERROR, USER_NOT_FOUND, null));
            else{
                InstructorInfoDTO userInfoDto=new InstructorInfoDTO("INSTRUCTOR",instructor.getId(),instructor.getName(),instructor.getSurname(),instructor.getUsername(),instructor.getTelephoneNumber(),instructor.getEmailAddress());
                return ResponseEntity.ok(new ResponseTemplate(SUCCESS, USER_FOUND, userInfoDto));
            }
        }
        StudentInfoDTO userInfoDTO = student.getClassroom() != null ?
                new StudentInfoDTO(student.getId(),student.getStudentNo(), student.getClassroom().getClassName(), student.getClassroom().getEnglishLevel().lowerCase, student.getName(),student.getSurname(),student.getUsername(),student.getTelephoneNumber(),student.getEmailAddress(), student.getLevel().lowerCase) :
                new StudentInfoDTO(student.getId(),student.getStudentNo(), "No classroom", "Undefined", student.getName(),student.getSurname(),student.getUsername(),student.getTelephoneNumber(),student.getEmailAddress(), student.getLevel().lowerCase);

        return ResponseEntity.ok(new ResponseTemplate(SUCCESS, USER_FOUND, userInfoDTO));
    }
    public ResponseEntity<ResponseTemplate> findClass(String username){
        PersonEntity personEntity=personRepository.findByUsername(username);
        Set<Authority> authorities=personEntity.getAuthorities();
        for(Authority authority:authorities){
            if(authority.getId()==1){
                return findClassOfStudent(username);
            }
            else if (authority.getId()==2){
                return findClassesOfInstructor(username);
            }
        }
        return ResponseEntity.ok(new ResponseTemplate(CommonMessages.ERROR,CommonMessages.ERROR,null));
    }
    public ResponseEntity<ResponseTemplate> findType(String username){
        Student student=studentService.findByUsername(username);
        if(student==null){
            Instructor instructor=instructorService.findByUsername(username);
            if(instructor==null){
                return ResponseEntity.ok(new ResponseTemplate(ERROR,ERROR,null));
            }
            else{
                return ResponseEntity.ok(new ResponseTemplate(CommonMessages.SUCCESS,CommonMessages.RECORDS_FETCHED,"INSTRUCTOR"));
            }
        }
        else{
            return ResponseEntity.ok(new ResponseTemplate(CommonMessages.SUCCESS,CommonMessages.RECORDS_FETCHED,"STUDENT"));
        }
    }
    public ResponseTemplate removeImage(String username){
        profilePictureService.removeImage(username);
        return new ResponseTemplate(SUCCESS,SUCCESS,null);
    }
    public ResponseEntity<ResponseTemplate> findClassOfStudent(String username){
        Student student=studentRepository.findByUsername(username);
        return ResponseEntity.ok(new ResponseTemplate(CommonMessages.SUCCESS,CommonMessages.RECORDS_FETCHED,student.getClassroom()));
    }
    public ResponseEntity<ResponseTemplate> findClassesOfInstructor(String username) {
        Instructor instructor=instructorRepository.findByUsername(username);
        Set<Classroom> classrooms=instructor.getClassrooms();
        return ResponseEntity.ok(new ResponseTemplate(CommonMessages.SUCCESS,CommonMessages.RECORDS_FETCHED,classrooms));
    }
    public void changeImage(String username, MultipartFile file) throws IOException
    {
        ProfilePicture profilePicture=profilePictureService.findByUsername(username);
        if(profilePicture!=null)
        {
            profilePicture.setImage(file.getBytes());
            profilePictureService.save(profilePicture);
        }
        else
        {
            profilePictureService.create(file,username);
        }
    }
    public ProfilePicture getImage(String username){
        return profilePictureService.findByUsername(username);
    }
    public ResponseTemplate editProfile(String username, EditProfileDTO editProfileDTO){
        if (editProfileDTO.getUsername()==username){
            PersonEntity personEntity=personRepository.findByUsername(username);
            if(personEntity!=null){
                personEntity.setEmailAddress(editProfileDTO.getEmail());
                personEntity.setTelephoneNumber(editProfileDTO.getTelephoneNumber());
                personRepository.save(personEntity);
                return new ResponseTemplate(SUCCESS,SUCCESS,null);
            }
            else{
                return new ResponseTemplate(ERROR,NO_SUCH_USER,null);
            }
        }
        else{
            return new ResponseTemplate(ERROR,NO_AUTHORITY,null);
        }
    }
}

package com.oet.application.service;

import com.oet.application.DTO.LoginCredentialsDTO;
import com.oet.application.common.ResponseTemplate;
import com.oet.application.entity.Admin;
import com.oet.application.entity.Authority;
import com.oet.application.entity.Student;
import com.oet.application.enums.Level;
import com.oet.application.enums.StudentLevel;
import com.oet.application.repository.AuthorityRepository;
import com.oet.application.repository.StudentRepository;
import com.oet.application.usecases.managePeopleForAdmin.service.ManagePeopleService;
import com.oet.application.usecases.manageProfilePictures.entity.ProfilePicture;
import com.oet.application.usecases.manageProfilePictures.repository.ProfilePictureRepository;
import com.oet.application.usecases.manageProfilePictures.service.ProfilePictureService;
import lombok.RequiredArgsConstructor;
import static com.oet.application.common.CommonMessages.*;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.transaction.Transactional;
import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class StudentService {

    private final StudentRepository repository;
    private final AuthorityRepository authorityRepository;
    private final ProfilePictureRepository profilePictureRepository;
    private final ProfilePictureService profilePictureService;
    private final ManagePeopleService managePeopleService;
    private final PasswordEncoder passwordEncoder;

    public Student create(Student student) {
        if (repository.existsByUsernameOrStudentNo(student.getUsername(),student.getStudentNo())){
            return null;
        }
        Authority authority = authorityRepository.findByAuthority("STUDENT");
        student.setAuthorities(Set.of(authority));
        student.setLevel(StudentLevel.NEWBIE);
        student.setPassword(passwordEncoder.encode(student.getPassword()));
        return repository.save(student);
    }

    public List<Student> findAll() {
        return repository.findAll();
    }

    public Student findById(Long id) {
        return repository.findById(id).orElse(null);
    }

    public Student findByUsername(String username) {
        return repository.findByUsername(username);
    }

    public Student findByStudentNo(String studentNo) {
        return repository.findByStudentNo(studentNo);
    }
    public List<Student> findByNameAndSurname(String name){
        return repository.findByNameAndSurname(name);
    }

    public void deleteAll() {
        repository.deleteAll();
    }

    public List<LoginCredentialsDTO> findStudentsWithCredentials() {
        List<Student> students = repository.findAll();
        return students.stream()
                .map(item -> new LoginCredentialsDTO(item.getUsername(), item.getPassword())).collect(Collectors.toList());
    }
  //  public ResponseTemplate changeName(String username,String newName){
    //    Student student=findByUsername(username);
      //  student.setName(newName);
        //return new ResponseTemplate(SUCCESS,SUCCESS,)
    //}
    public void changeName(Student student,String newname){
        student.setName(newname);
        repository.save(student);
    }
    public void changeSurname(Student student,String newsurname){
        student.setSurname(newsurname);
    }
    public void changeTelephoneNumber(Student student,String telnumber){
        student.setTelephoneNumber(telnumber);
    }
    public void changeEmailAddress(Student student ,String email){

            student.setEmailAddress(email);
    }
    public void changePassword(Student student,String pass){
        student.setPassword(passwordEncoder.encode(pass));
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
    public void removeImage(String username){
        profilePictureService.removeImage(username);
    }


    public ResponseTemplate ban(Long id) {
        Student student = repository.findById(id).orElse(null);

        if (student != null) {
            if (student.getBanned()) {
                return new ResponseTemplate(WARNING, ACCOUNT_ALREADY_BANNED, null);
            }
            student.setBanned(true);
            repository.save(student);
            return new ResponseTemplate(SUCCESS, ACCOUNT_BANNED, managePeopleService.listStudentsForAdmin());
        }
        return new ResponseTemplate(ERROR, USER_NOT_FOUND, null);
    }

    public ResponseTemplate unban(Long id) {
        Student student = repository.findById(id).orElse(null);

        if (student != null) {
            if (student.getBanned()) {
                student.setBanned(false);
                repository.save(student);
                return new ResponseTemplate(SUCCESS, ACCOUNT_UNBANNED, managePeopleService.listStudentsForAdmin());
            }
            return new ResponseTemplate(WARNING, ACCOUNT_IS_NOT_BANNED, null);
        }
        return new ResponseTemplate(ERROR, USER_NOT_FOUND, null);
    }
}


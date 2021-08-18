package com.oet.application.service;

import com.oet.application.DTO.LoginCredentialsDTO;
import com.oet.application.entity.Authority;
import com.oet.application.entity.Student;
import com.oet.application.repository.AuthorityRepository;
import com.oet.application.repository.StudentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

import static com.oet.application.CommonEntities.*;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class StudentServiceTest {

    @Mock
    StudentRepository repository;

    @Mock
    AuthorityRepository authorityRepository;

    @InjectMocks
    StudentService studentService;

    @Mock
    PasswordEncoder passwordEncoder;

    Student student;
    Authority authority;

    @BeforeEach
    void setUp() {
        student = getStudent();
        authority = getAuthority();
    }

    @Test
    void createAlreadyExistingUsername() {
        when(repository.existsByUsernameOrStudentNo(anyString(), anyString())).thenReturn(true);

        Student response = studentService.create(student);

        assertNull(response);
    }


    @Test
     void createSuccess() {
        when(repository.existsByUsernameOrStudentNo(anyString(), anyString())).thenReturn(false);
        when(repository.save(any())).thenReturn(student);
        when(authorityRepository.findByAuthority(anyString())).thenReturn(authority);
        when(passwordEncoder.encode(student.getPassword())).thenReturn("xYzsjfö8.g");

        Student response = studentService.create(student);

        assertNotNull(response);
        verify(repository).save(any());
    }


    @Test
    void findAll() {
        when(repository.findAll()).thenReturn(List.of(student));

        List<Student> students = studentService.findAll();

        assertEquals(1, students.size());
    }

    @Test
    void findById() {
        when(repository.findById(anyLong())).thenReturn(Optional.of(student));

        Student student = studentService.findById(1L);

        assertNotNull(student);
    }

    @Test
    void findByUsername() {
        when(repository.findByUsername(anyString())).thenReturn(student);

        Student student = studentService.findByUsername("username");

        assertNotNull(student);
    }

    @Test
    void deleteAll() {
        studentService.deleteAll();

        verify(repository).deleteAll();
    }

    @Test
    void findStudentsWithCredentials() {
        when(repository.findAll()).thenReturn(List.of(student));

        List<LoginCredentialsDTO> credentialsDTOS = studentService.findStudentsWithCredentials();

        assertEquals(1, credentialsDTOS.size());
    }

    @Test
    void changeName() {
        studentService.changeName(student, "name");

        verify(repository).save(any());
    }

    //@Test
    //void changeImage() throws IOException {
      //  studentService.changeImage(student, new MockMultipartFile("name", new byte[200]));

    //    verify(repository).save(any());
    //}
}
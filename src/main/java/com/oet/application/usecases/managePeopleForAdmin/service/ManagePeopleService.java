package com.oet.application.usecases.managePeopleForAdmin.service;

import com.oet.application.common.ResponseTemplate;
import com.oet.application.entity.Instructor;
import com.oet.application.entity.Student;
import com.oet.application.repository.AdminRepository;
import com.oet.application.repository.InstructorRepository;
import com.oet.application.repository.StudentRepository;
import com.oet.application.usecases.manageClasses.DTO.InstructorDTO;
import com.oet.application.usecases.manageClasses.DTO.StudentDTO;
import com.oet.application.usecases.manageClasses.utilities.ClassroomMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

import static com.oet.application.common.CommonMessages.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class ManagePeopleService {

    private final StudentRepository studentRepository;
    private final InstructorRepository instructorRepository;
    private final AdminRepository adminRepository;

    public Set<StudentDTO> listStudentsForAdmin() {
        List<Student> students = studentRepository.findAll();
        return ClassroomMapper.mapStudentsToDTO(students);
    }

    public Set<InstructorDTO> listInstructorsForAdmin() {
        List<Instructor> instructors = instructorRepository.findAll();
        return ClassroomMapper.mapInstructorsToDTO(instructors);
    }

    public ResponseEntity<ResponseTemplate> updateStudent(StudentDTO studentDTO) {
        Student studentDB = studentRepository.findById(studentDTO.getId()).orElse(null);

        if (studentDB == null) {
            return ResponseEntity.ok(new ResponseTemplate(ERROR, USER_NOT_FOUND, null));
        }

        studentDB.setName(studentDTO.getName());
        studentDB.setSurname(studentDB.getSurname());
        studentDB.setStudentNo(studentDTO.getStudentNumber());
        studentDB.setEmailAddress(studentDTO.getEmailAddress());
        studentDB.setTelephoneNumber(studentDTO.getTelephoneNumber());

        studentRepository.save(studentDB);

        return ResponseEntity.ok(new ResponseTemplate(SUCCESS, USER_FOUND, listStudentsForAdmin()));
    }

    public ResponseEntity<ResponseTemplate> deleteStudent(Long id) {
        studentRepository.deleteById(id);
        return ResponseEntity.ok(new ResponseTemplate(SUCCESS, RECORD_DELETED, listStudentsForAdmin()));
    }

    public ResponseEntity<ResponseTemplate> updateInstructor(InstructorDTO instructorDTO) {
        Instructor instructorDB = instructorRepository.findById(instructorDTO.getId()).orElse(null);

        if (instructorDB == null) {
            return ResponseEntity.ok(new ResponseTemplate(ERROR, USER_NOT_FOUND, null));
        }

        instructorDB.setName(instructorDTO.getName());
        instructorDB.setSurname(instructorDTO.getSurname());
        instructorDB.setEmailAddress(instructorDTO.getEmailAddress());
        instructorDB.setTelephoneNumber(instructorDTO.getTelephoneNumber());

        instructorRepository.save(instructorDB);
        return ResponseEntity.ok(new ResponseTemplate(SUCCESS, USER_FOUND, listInstructorsForAdmin()));
    }

    public ResponseEntity<ResponseTemplate> deleteInstructor(Long id) {
        instructorRepository.deleteById(id);
        return ResponseEntity.ok(new ResponseTemplate(SUCCESS, RECORD_DELETED, listInstructorsForAdmin()));
    }
}

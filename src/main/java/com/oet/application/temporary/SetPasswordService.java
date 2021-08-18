package com.oet.application.temporary;

import com.oet.application.entity.Instructor;
import com.oet.application.entity.Student;
import com.oet.application.repository.InstructorRepository;
import com.oet.application.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SetPasswordService {

    private final StudentRepository studentRepository;
    private final InstructorRepository instructorRepository;
    private final PasswordEncoder passwordEncoder;

    public void resetAllPasswords() {
        List<Student> students = studentRepository.findAll();
        List<Instructor> instructors = instructorRepository.findAll();

        for (Student student: students) {
            student.setPassword(passwordEncoder.encode(student.getUsername()));
        }

        for (Instructor instructor: instructors) {
            instructor.setPassword(passwordEncoder.encode(instructor.getUsername()));
        }

        studentRepository.saveAll(students);
        instructorRepository.saveAll(instructors);
    }
}

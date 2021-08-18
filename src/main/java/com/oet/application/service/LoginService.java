package com.oet.application.service;

import com.oet.application.entity.Authority;
import com.oet.application.entity.Student;
import com.oet.application.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LoginService {

    private final StudentRepository studentRepository;

    public String extractAuthority(UserDetails userDetails) {
        Object[] authorities = userDetails.getAuthorities().toArray();
        if (authorities.length > 0) {
            return ((Authority)authorities[0]).getAuthority();
        }
        return null;
    }

    public boolean isBannedStudent(String username) {
        Student student = studentRepository.findByUsername(username);
        return student == null || student.getBanned();
    }
}

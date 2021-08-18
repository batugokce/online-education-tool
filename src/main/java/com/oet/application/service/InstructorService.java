package com.oet.application.service;

import com.oet.application.entity.Admin;
import com.oet.application.entity.Authority;
import com.oet.application.entity.Instructor;
import com.oet.application.repository.AuthorityRepository;
import com.oet.application.repository.InstructorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class InstructorService {

    private final InstructorRepository repository;
    private final AuthorityRepository authorityRepository;
    private final PasswordEncoder passwordEncoder;

    public Instructor create(Instructor instructor) {
        if (repository.existsByUsername(instructor.getUsername())){
            return null;
        }
        Authority authority = authorityRepository.findByAuthority("INSTRUCTOR");
        instructor.setAuthorities(Set.of(authority));
        instructor.setPassword(passwordEncoder.encode(instructor.getPassword()));
        return repository.save(instructor);
    }

    public List<Instructor> findAll() {
        return repository.findAll();
    }

    public Instructor findById(Long id) {
        return repository.findById(id).orElse(null);
    }

    public void deleteAll() {
        repository.deleteAll();
    }
    public Instructor findByUsername(String name){
        return repository.findByUsername(name);
    }
}

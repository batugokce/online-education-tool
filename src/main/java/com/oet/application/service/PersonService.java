package com.oet.application.service;

import com.oet.application.common.PersonEntity;
import com.oet.application.entity.Student;
import com.oet.application.repository.PersonRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PersonService {

    private final PersonRepository repository;
    private final PasswordEncoder passwordEncoder;

    public PersonEntity changePassword(Long id, String oldPassword, String newPassword) {
        PersonEntity person = repository.findById(id).orElse(null);

        if (person == null || person.getPassword() == null || !passwordEncoder.matches(oldPassword, person.getPassword())) {
            return null;
        }
        person.setPassword(passwordEncoder.encode(newPassword));
        repository.save(person);
        return person;
    }

    public void deleteRecord(Long id) {
        repository.deleteById(id);
    }
}

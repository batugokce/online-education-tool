package com.oet.application.service;

import com.oet.application.entity.Admin;
import com.oet.application.entity.Authority;
import com.oet.application.repository.AdminRepository;
import com.oet.application.repository.AuthorityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final AdminRepository repository;
    private final AuthorityRepository authorityRepository;
    private final PasswordEncoder passwordEncoder;

    public Admin create(Admin admin) {
        Authority authority = authorityRepository.findByAuthority("ADMIN");
        admin.setAuthorities(Set.of(authority));
        admin.setPassword(passwordEncoder.encode(admin.getPassword()));
        return repository.save(admin);
    }

    public void createAdminWithCredentials(String username, String password) {
        Authority authority = authorityRepository.findByAuthority("ADMIN");
        Admin admin = new Admin();
        admin.setEmailAddress("admin@gmail.com");
        admin.setName("admin");
        admin.setSurname("admin");
        admin.setTelephoneNumber("1111111");
        admin.setUsername(username);
        admin.setPassword(passwordEncoder.encode(password));
        admin.setAuthorities(Set.of(authority));
        repository.save(admin);
    }

    public List<Admin> findAll() {
        return repository.findAll();
    }

    public Admin findById(Long id) {
        return repository.findById(id).orElse(null);
    }

    public void deleteAll() {
        repository.deleteAll();
    }

}

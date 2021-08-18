package com.oet.application.service;

import com.oet.application.common.PersonEntity;
import com.oet.application.repository.PersonRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static com.oet.application.CommonEntities.*;
import static com.oet.application.common.CommonMessages.*;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class PersonServiceTest {

    @Mock
    PersonRepository repository;
    @InjectMocks
    PersonService personService;
    @Mock
    PersonEntity personEntity;
    @Mock
    PasswordEncoder passwordEncoder;

    @BeforeEach
    void setUp() {
        personEntity = getStudent();
    }

    @Test
    void changePasswordNull() {
        when(repository.findById(anyLong())).thenReturn(Optional.empty());

        PersonEntity personEntity = personService.changePassword(1L, "oldPassword", "newPassword");

        assertNull(personEntity);
    }


    @Test
    void changePasswordSuccess() {
        final String oldPassword = "oldPassword";
        final String newPassword = "newPassword";

        personEntity.setPassword("deufhos2746sfr");
        when(repository.findById(anyLong())).thenReturn(Optional.of(personEntity));
        when(passwordEncoder.matches(oldPassword, personEntity.getPassword())).thenReturn(true);
        when(passwordEncoder.encode(newPassword)).thenReturn("Adsgbnjc5.stxj");

        PersonEntity personEntity = personService.changePassword(1L, oldPassword, newPassword);

        assertEquals("Adsgbnjc5.stxj", personEntity.getPassword());
        assertNotNull(personEntity);
    }

    @Test
    void deleteRecord() {
        personService.deleteRecord(1L);

        verify(repository).deleteById(1L);
    }
}
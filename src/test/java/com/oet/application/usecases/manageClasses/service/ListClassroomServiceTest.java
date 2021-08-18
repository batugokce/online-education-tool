package com.oet.application.usecases.manageClasses.service;

import com.oet.application.usecases.manageClasses.DTO.ClassroomForAdminDTO;
import com.oet.application.usecases.manageClasses.entity.Classroom;
import com.oet.application.usecases.manageClasses.repository.ClassroomRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static com.oet.application.CommonEntities.*;
import static com.oet.application.common.CommonMessages.*;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class ListClassroomServiceTest {

    @Mock
    ClassroomRepository repository;

    @InjectMocks
    ListClassroomService listClassroomService;

    Classroom classroom;

    @BeforeEach
    void setUp() {
        classroom = getClassroom();
    }

    @Test
    void listClassrooms() {
        when(repository.findAll()).thenReturn(List.of(classroom));

        List<ClassroomForAdminDTO> classrooms = listClassroomService.listClassrooms();

        assertEquals(1, classrooms.size());
    }

    @Test
    void displayClassInfoNull() {
        when(repository.findById(anyLong())).thenReturn(Optional.empty());

        ClassroomForAdminDTO classroom = listClassroomService.displayClassInfo(1L);

        assertNull(classroom);
    }

    @Test
    void displayClassInfoSuccess() {
        when(repository.findById(anyLong())).thenReturn(Optional.of(classroom));

        ClassroomForAdminDTO classroom = listClassroomService.displayClassInfo(1L);

        assertNotNull(classroom);
    }



}
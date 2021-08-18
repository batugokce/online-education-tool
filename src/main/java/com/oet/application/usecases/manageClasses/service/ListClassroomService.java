package com.oet.application.usecases.manageClasses.service;

import com.oet.application.entity.Instructor;
import com.oet.application.repository.InstructorRepository;
import com.oet.application.usecases.manageClasses.DTO.ClassroomForAdminDTO;
import com.oet.application.usecases.manageClasses.DTO.ClassroomForInstructorDTO;
import com.oet.application.usecases.manageClasses.entity.Classroom;
import com.oet.application.usecases.manageClasses.repository.ClassroomRepository;
import com.oet.application.usecases.manageClasses.utilities.ClassroomMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ListClassroomService {

    private final ClassroomRepository repository;
    private final InstructorRepository instructorRepository;

    public List<ClassroomForAdminDTO> listClassrooms() {
        List<Classroom> classrooms = repository.findAll();
        return classrooms.stream()
                .map(item -> new ClassroomForAdminDTO(item.getId(), item.getClassName(),
                        item.getEnglishLevel(),item.getStudents().size(), item.getCapacity(), new HashSet<>(), new HashSet<>()))
                .collect(Collectors.toList());
    }

    public ClassroomForAdminDTO displayClassInfo(Long classID) {
        Classroom classroom = repository.findById(classID).orElse(null);

        if (classroom != null) {
            return ClassroomMapper.mapClassroomToDTO(classroom);
        }

        return null;
    }

    public Set<ClassroomForInstructorDTO> listClassroomsForInstructor(String username) {
        Instructor instructor = instructorRepository.findByUsername(username);

        if (instructor == null) {
            return new HashSet<>();
        }

        return ClassroomMapper.mapClassroomsToDTO(instructor.getClassrooms());
    }

    public List<String> listClassroomNamesForInstructor(String username) {
        Instructor instructor = instructorRepository.findByUsername(username);
        List<String> classroomNames = new ArrayList<>();
        if (instructor == null) {
            return classroomNames;
        }

        ClassroomMapper.mapClassroomsToDTO(instructor.getClassrooms()).forEach(classroomForInstructorDTO -> classroomNames.add(classroomForInstructorDTO.getClassName()));
        return classroomNames;
    }
}

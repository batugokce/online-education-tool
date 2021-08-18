package com.oet.application.usecases.adjustLevel.service;

import com.oet.application.entity.Student;
import com.oet.application.enums.Level;
import com.oet.application.enums.StudentLevel;
import com.oet.application.repository.StudentRepository;
import com.oet.application.usecases.manageAnswers.DTO.PointDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import static com.oet.application.enums.StudentLevel.*;

@Service
@RequiredArgsConstructor
public class LevelAdjustmentService {

    private final StudentRepository studentRepository;

    public void adjustStudentLevel(String username, PointDTO pointDTO) {
        Student student = studentRepository.findByUsername(username);
        if (student != null) {
            adjustStudentLevel(student, pointDTO);
        }
    }

    public void adjustStudentLevel(Student student, PointDTO pointDTO) {
        int deltaScore = (int) ((pointDTO.getPoint()/ pointDTO.getMaxPoint())*100);
        int finalScore = (int) (student.getGeneralScore()*0.85 + deltaScore*0.15);
        student.setGeneralScore(finalScore);
        if (finalScore < 15) {
            student.setLevel(NEWBIE);
        } else if (finalScore < 30) {
            student.setLevel(AMATEUR);
        } else if (finalScore < 45) {
            student.setLevel(NORMAL);
        } else if (finalScore < 60) {
            student.setLevel(SEMI_PRO);
        } else if (finalScore < 75) {
            student.setLevel(PROFESSIONAL);
        } else if (finalScore < 90) {
            student.setLevel(LEGEND);
        } else {
            student.setLevel(ULTIMATE);
        }
        studentRepository.save(student);
    }
}

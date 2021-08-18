package com.oet.application.repository;

import com.oet.application.entity.Instructor;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InstructorRepository extends JpaRepository<Instructor,Long> {

    boolean existsByUsername(String username);

    Instructor findByUsername(String username);

}

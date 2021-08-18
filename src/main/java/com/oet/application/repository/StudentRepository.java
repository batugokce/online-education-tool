package com.oet.application.repository;

import com.oet.application.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Set;

@Repository
@Transactional
public interface StudentRepository extends JpaRepository<Student,Long> {

    Student findByUsername(String username);

    boolean existsByUsernameOrStudentNo(String username, String studentNo);

    Set<Student> findAllByClassroomNull();

    Student findByStudentNo(String studentNo);

    @Query("SELECT st from Student as st where concat(st.name,' ',st.surname)=:name ")
    List<Student> findByNameAndSurname(String name);
}

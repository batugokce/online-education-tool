package com.oet.application.usecases.manageProfilePictures.repository;


import com.oet.application.usecases.manageProfilePictures.entity.ProfilePicture;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProfilePictureRepository extends JpaRepository<ProfilePicture,Long> {
    ProfilePicture findByUsername(String username);
    void deleteByUsername(String username);
}

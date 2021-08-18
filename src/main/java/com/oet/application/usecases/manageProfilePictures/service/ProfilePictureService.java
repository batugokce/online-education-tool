package com.oet.application.usecases.manageProfilePictures.service;

import com.oet.application.usecases.manageProfilePictures.entity.ProfilePicture;
import com.oet.application.usecases.manageProfilePictures.repository.ProfilePictureRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.transaction.Transactional;
import java.io.IOException;

@Service
@RequiredArgsConstructor
@Transactional
public class ProfilePictureService {
        private final ProfilePictureRepository repository;
        public ProfilePicture create(MultipartFile file,String username) throws IOException {
            ProfilePicture profilePicture=new ProfilePicture(file,username);
            return repository.save(profilePicture);
        }
        public ProfilePicture findByUsername(String username){
            return repository.findByUsername(username);
        }
        public void save(ProfilePicture profilePicture){
            repository.save(profilePicture);
    }
    public void removeImage(String username)
    {
        repository.deleteByUsername(username);
    }
}

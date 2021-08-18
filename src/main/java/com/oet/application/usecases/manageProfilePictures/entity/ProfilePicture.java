package com.oet.application.usecases.manageProfilePictures.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.oet.application.common.BaseEntity;
import com.oet.application.entity.Student;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import javax.persistence.*;
import java.io.IOException;

@Entity
@Getter
@Setter
@SequenceGenerator(name = "idGenerator", sequenceName = "profile_picture_sequence")
public class ProfilePicture extends BaseEntity {
    @Column(name="IMAGE")
    @Lob
    private byte[] image;

    private String username;
    public ProfilePicture()
    {

    }
    public ProfilePicture(MultipartFile file,String username) throws IOException {
        this.image=file.getBytes();
        this.username=username;
    }
}


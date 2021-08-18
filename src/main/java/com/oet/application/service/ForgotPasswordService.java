package com.oet.application.service;

import com.oet.application.DTO.ForgotPasswordDTO;
import com.oet.application.common.MailService;
import com.oet.application.common.CommonMessages;
import com.oet.application.common.PersonEntity;
import com.oet.application.common.ResponseTemplate;
import com.oet.application.entity.ConfirmationToken;
import com.oet.application.repository.ConfirmationTokenRepository;
import com.oet.application.repository.PersonRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import org.springframework.transaction.annotation.Transactional;
import java.util.Date;

@Service
@Transactional
@RequiredArgsConstructor
public class ForgotPasswordService {
    private final PersonRepository personRepository;
    private final ConfirmationTokenRepository confirmationTokenRepository;
    private final JavaMailSender javaMailSender;
    private final MailService mailService;
    private final PasswordEncoder passwordEncoder;


    public ResponseTemplate forgotPassword(ForgotPasswordDTO forgotPasswordDTO){
        PersonEntity person;
        if(forgotPasswordDTO.getType().equals("username")) {
            person = personRepository.getByUsername(forgotPasswordDTO.getText());
        }
        else {
            person = personRepository.getByEmailAddress(forgotPasswordDTO.getText());
        }
        if(person==null)
            return new ResponseTemplate(CommonMessages.ERROR,CommonMessages.NO_SUCH_USER,null);
        confirmationTokenRepository.deleteByUserId(person.getId());
        ConfirmationToken confirmationToken=new ConfirmationToken(person,person.getId());
        confirmationTokenRepository.save(confirmationToken);
        SimpleMailMessage message=mailService.forgot_password_template(confirmationToken.getToken(),person.getEmailAddress());
        javaMailSender.send(message);
        return new ResponseTemplate(CommonMessages.SUCCESS,CommonMessages.USER_EXISTS,null);

    }
    public ResponseEntity<ResponseTemplate> changePassword(String token, String password){
        ConfirmationToken confirmationToken=confirmationTokenRepository.getByToken(token);
        if(confirmationToken==null)
            return ResponseEntity.ok(new ResponseTemplate(CommonMessages.ERROR,CommonMessages.NO_SUCH_USER,null));
        PersonEntity person=personRepository.findById(confirmationToken.getUserId()).orElse(null);
        if(person==null)
            return ResponseEntity.ok(new ResponseTemplate(CommonMessages.ERROR,CommonMessages.NO_SUCH_USER,null));
        if(passwordEncoder.matches(password, person.getPassword())){
            return ResponseEntity.ok(new ResponseTemplate(CommonMessages.ERROR,CommonMessages.SAME_PASS,null));
        }
        confirmationTokenRepository.delete(confirmationToken);
        person.setPassword(passwordEncoder.encode(password));
        personRepository.save(person);
        return ResponseEntity.ok(new ResponseTemplate(CommonMessages.SUCCESS,CommonMessages.PASSWORD_CHANGE_SUCCESS,null));
    }
    public boolean validateToken(String token)
    {
        ConfirmationToken confirmationToken=confirmationTokenRepository.getByToken(token);
        if(confirmationToken==null)
            return false;
        Date date=confirmationToken.getCreationTime();
        Date now=new Date();
        long diff=now.getTime()-date.getTime();
        long minutes=(diff / (1000 * 60 * 60)) % 24;
        if (minutes>60*12){
            confirmationTokenRepository.delete(confirmationToken);
            return false;
        }
        return true;
    }
    public ResponseEntity<ResponseTemplate> changePasswordFromProfile(String oldPass,String newPass,String username){
        PersonEntity person=personRepository.findByUsername(username);
        if(person==null){
            return  ResponseEntity.ok(new ResponseTemplate(CommonMessages.ERROR,CommonMessages.ERROR,null));
        }

        if(!passwordEncoder.matches(oldPass,person.getPassword())){
            return  ResponseEntity.ok(new ResponseTemplate(CommonMessages.ERROR,CommonMessages.WRONG_PASSWORD,null));
        }
        if(passwordEncoder.matches(newPass,person.getPassword())){
            return  ResponseEntity.ok(new ResponseTemplate(CommonMessages.ERROR,CommonMessages.SAME_PASS,null));
        }
        else{
            //person.setPassword(passwordEncoder.encode(newPass));
            //personRepository.save(person);
            return ResponseEntity.ok(new ResponseTemplate(CommonMessages.WARNING,CommonMessages.CHANGE_PASSWORD_PROHIBITED,null));
        }

    }
}

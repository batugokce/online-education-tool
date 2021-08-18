package com.oet.application.controller;

import com.oet.application.DTO.LoginCredentialsDTO;
import com.oet.application.DTO.LoginResponseDTO;
import com.oet.application.common.CommonMessages;
import com.oet.application.common.PersonEntity;
import com.oet.application.common.ResponseTemplate;
import com.oet.application.configuration.CustomUserDetailsService;
import com.oet.application.entity.Authority;
import com.oet.application.service.LoginService;
import com.oet.application.utililties.JwtUtilities;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Service
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1")
public class LoginController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtilities jwtUtilities;
    private final CustomUserDetailsService userDetailsService;
    private final LoginService loginService;

    @PostMapping("/login")
    public ResponseEntity<ResponseTemplate> authenticate(@RequestBody LoginCredentialsDTO loginDTO) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginDTO.getUsername(),loginDTO.getPassword())
            );
        }
        catch (Exception e){
            return ResponseEntity.ok(new ResponseTemplate(CommonMessages.ERROR, CommonMessages.LOGIN_FAILURE, null));
        }

        final UserDetails userDetails = userDetailsService.loadUserByUsername(loginDTO.getUsername());

        final String jwt = jwtUtilities.generateToken(userDetails);

        String typeOfUser = loginService.extractAuthority(userDetails);
        if (typeOfUser != null) {
            if (typeOfUser.equals("STUDENT") && loginService.isBannedStudent(userDetails.getUsername())) {
                return ResponseEntity.ok(new ResponseTemplate(CommonMessages.WARNING, CommonMessages.YOU_ARE_BANNED, null));
            }
            LoginResponseDTO responseBody = new LoginResponseDTO(typeOfUser, jwt);
            return ResponseEntity.ok().body(new ResponseTemplate(CommonMessages.SUCCESS, CommonMessages.LOGIN_SUCCESSFUL, responseBody));
        }
        return ResponseEntity.ok(new ResponseTemplate(CommonMessages.ERROR,CommonMessages.NO_AUTHORITY, null));

    }
}

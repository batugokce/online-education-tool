package com.oet.application;

import com.oet.application.entity.Authority;
import com.oet.application.repository.AuthorityRepository;
import com.oet.application.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
@SpringBootApplication
public class Application {

	private final AuthorityRepository repository;
	private final AdminService service;

	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
	}


	@PostConstruct
	private void initialize(){
		Authority authority = repository.findById(1L).orElse(null);
		if (authority == null){
			List<Authority> authorities = new ArrayList<>();
			authorities.add(new Authority("STUDENT"));
			authorities.add(new Authority("INSTRUCTOR"));
			authorities.add(new Authority("ADMIN"));
			repository.saveAll(authorities);
			service.createAdminWithCredentials("admin","pass");
		}
	}
}

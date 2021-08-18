package com.oet.application.usecases.translate.controller;

import com.oet.application.common.ResponseTemplate;
import com.oet.application.usecases.translate.service.TranslationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import static com.oet.application.common.CommonMessages.*;
import static com.oet.application.common.LogMessages.*;

@RestController
@RequestMapping("/api/v1/translate")
@RequiredArgsConstructor
@Slf4j
public class TranslationController {

    private final TranslationService service;

    @PreAuthorize("hasAuthority('STUDENT')")
    @Cacheable(value = "translation", key = "#word")
    @GetMapping("/{word}")
    public ResponseEntity<ResponseTemplate> translate(@PathVariable String word) {
        if (word.contains(" ")) {
            log.info(String.format(L_TRANSLATION_CONTAIN_SPACES, word));
            return ResponseEntity.ok(new ResponseTemplate(ERROR, QUERY_MUST_BE_JUST_ONE_WORD, null));
        }
        else if (word.length() > 20) {
            log.info(String.format(L_TRANSLATION_TOO_LONG, word));
            return ResponseEntity.ok(new ResponseTemplate(ERROR, WORD_IS_LONG, null));
        }
        log.info(String.format(L_TRANSLATION_SUCCESS, word));
        ResponseTemplate responseTemplate = service.translate(word);
        return ResponseEntity.ok(responseTemplate);
    }

}

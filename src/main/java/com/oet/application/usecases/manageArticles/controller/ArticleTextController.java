package com.oet.application.usecases.manageArticles.controller;

import com.oet.application.common.CommonMessages;
import com.oet.application.common.ResponseTemplate;
import com.oet.application.usecases.manageArticles.entity.ArticleText;
import com.oet.application.usecases.manageArticles.entity.DragDrop;
import com.oet.application.usecases.manageArticles.service.ArticleTextService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/v1/articletext")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('ADMIN')")
public class ArticleTextController {
    private final ArticleTextService articleTextService;
    @PostMapping
    public ResponseEntity<ResponseTemplate> createArticleText(@Valid @RequestBody ArticleText articleText, BindingResult bindingresult) {
        if (bindingresult.hasErrors()) {
            return ResponseEntity.ok(new ResponseTemplate(CommonMessages.ERROR, bindingresult.getAllErrors().get(0).getDefaultMessage(), null));}
        ArticleText newarticletext = articleTextService.create(articleText);
        return ResponseEntity
                .ok(new ResponseTemplate(CommonMessages.SUCCESS, CommonMessages.ARTICLE_TEXT_IS_CREATED, articleText));
    }
    @GetMapping
    public ResponseEntity<ResponseTemplate> getAllArticleText() {
        List<ArticleText> articleTextList = articleTextService.findAll();
        return ResponseEntity.ok(new ResponseTemplate(CommonMessages.SUCCESS, CommonMessages.RECORDS_FETCHED, articleTextList));
    }
    @DeleteMapping
    public ResponseEntity<ResponseTemplate> deleteAllArticleTexts() {
        articleTextService.deleteAll();
        return ResponseEntity.ok(new ResponseTemplate(CommonMessages.SUCCESS, CommonMessages.RECORDS_DELETED, null));
    }
    @GetMapping("/find/{articleId}")
    public ResponseEntity<ResponseTemplate> getArticleTextById(@PathVariable Long articleId) {
        ArticleText articleText = articleTextService.findById(articleId);
        if (articleText != null) {
            return ResponseEntity.ok(new ResponseTemplate(CommonMessages.SUCCESS, CommonMessages.ARTICLE_TEXT_IS_FOUND, articleText));
        }
        return ResponseEntity
                .ok(new ResponseTemplate(CommonMessages.ERROR, CommonMessages.ARTICLE_TEXT_IS_NOT_FOUND, null));
    }
}

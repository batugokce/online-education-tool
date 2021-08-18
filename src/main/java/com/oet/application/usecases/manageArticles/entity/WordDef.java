package com.oet.application.usecases.manageArticles.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.oet.application.common.BaseEntity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import java.util.Objects;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class WordDef extends BaseEntity {

    @NotBlank(message = "You cannot leave a word blank")
    @Column(name = "WORD")
    private String word;

    @NotBlank(message = "You cannot leave a word definition blank")
    @Column(name = "DEFINITION")
    private String definition;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof WordDef)) return false;
        if (!super.equals(o)) return false;
        WordDef wordDef = (WordDef) o;
        return Objects.equals(word, wordDef.word) && Objects.equals(definition, wordDef.definition);
    }

    @Override
    public int hashCode() {
        return Objects.hash(super.hashCode(), word, definition);
    }
}

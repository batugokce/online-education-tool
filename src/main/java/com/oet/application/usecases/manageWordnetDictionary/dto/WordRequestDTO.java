package com.oet.application.usecases.manageWordnetDictionary.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import net.sf.extjwnl.data.POS;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class WordRequestDTO {

    private POS type;
    private String word;

}

package com.oet.application.usecases.manageWordnetDictionary.controller;

import com.oet.application.usecases.manageWordnetDictionary.dto.WordRequestDTO;
import net.sf.extjwnl.JWNLException;
import net.sf.extjwnl.data.IndexWord;
import net.sf.extjwnl.data.POS;
import net.sf.extjwnl.data.Synset;
import net.sf.extjwnl.dictionary.Dictionary;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1")
public class DictionaryController {

    @PostMapping("/wordnet")
    public List<String> getMeaning(@RequestBody WordRequestDTO wordRequestDTO){

        try {
            Dictionary dictionary = Dictionary.getDefaultResourceInstance();

            List<Synset> synsets = dictionary
                    .lookupIndexWord(wordRequestDTO.getType(), wordRequestDTO.getWord())
                    .getSenses();

            return synsets
                    .stream()
                    .limit(3)
                    .map(Synset::getGloss)
                    .collect(Collectors.toList());

        } catch (Exception e) {
            System.out.println(e.getClass().toString());
            return new ArrayList<>();
        }
    }

}

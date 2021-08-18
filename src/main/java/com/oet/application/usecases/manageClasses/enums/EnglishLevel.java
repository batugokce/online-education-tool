package com.oet.application.usecases.manageClasses.enums;

public enum EnglishLevel {
    BEGINNER("Beginner"),
    ELEMENTARY("Elementary"),
    PRE_INTERMEDIATE("Pre-intermediate"),
    INTERMEDIATE("Intermediate"),
    UPPER_INTERMEDIATE("Upper-intermediate");

    public final String lowerCase;

    EnglishLevel(String lowerCase) {
        this.lowerCase = lowerCase;
    }
}

package com.oet.application.enums;

public enum Level {
    EASY("Easy"),
    MEDIUM("Medium"),
    HARD("Hard");

    public final String lowerCase;

    Level(String lowerCase) {
        this.lowerCase = lowerCase;
    }
}

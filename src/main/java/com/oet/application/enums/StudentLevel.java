package com.oet.application.enums;

public enum StudentLevel {
    NEWBIE("Newbie"),
    AMATEUR("Amateur"),
    NORMAL("Normal"),
    SEMI_PRO("Semi-pro"),
    PROFESSIONAL("Professional"),
    LEGEND("Legend"),
    ULTIMATE("Ultimate");

    public final String lowerCase;

    StudentLevel(String lowerCase) {
        this.lowerCase = lowerCase;
    }
}

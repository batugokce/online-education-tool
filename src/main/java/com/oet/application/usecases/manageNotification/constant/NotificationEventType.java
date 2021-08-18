package com.oet.application.usecases.manageNotification.constant;

public enum NotificationEventType {
    NEW_ASSIGNMENT("New assignment is uploaded."), // "New assignment with the title %s is uploaded.";
    ASSIGNMENT_COMPLETED("A student has completed an assignment you have given."), // = "ASSIGNMENT_COMPLETED"; //"The student with username %s has completed the assignment with title %d.";
    NEW_FEEDBACK("New feedback is given."); // = "ASSIGNMENT_COMPLETED", //"Instructor has given feedback for your assignment with title %s.";

    private String eventMessage;
    NotificationEventType(String eventMessage){
        this.eventMessage = eventMessage;
    }
    @Override
    public String toString() {
        return eventMessage;
    }
}

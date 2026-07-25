package com.crittersapp.backend.exception;

// thrown when a logged-in user tries to touch a resource that exists, but
// belongs to a DIFFERENT user — the ownership check pattern used throughout
// QuestService/CrittersService
public class ForbiddenException extends RuntimeException {
    public ForbiddenException(String message) {
        super(message);
    }
}

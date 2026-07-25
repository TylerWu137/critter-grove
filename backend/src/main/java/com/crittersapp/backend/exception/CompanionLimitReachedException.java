package com.crittersapp.backend.exception;

public class CompanionLimitReachedException extends RuntimeException {
    public CompanionLimitReachedException(String message) {
        super(message);
    }
}

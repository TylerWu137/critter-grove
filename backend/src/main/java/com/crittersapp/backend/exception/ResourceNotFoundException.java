package com.crittersapp.backend.exception;

// generic "this quest/critter/etc doesn't exist" — used across features
// rather than a separate NotFoundException per resource type
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}

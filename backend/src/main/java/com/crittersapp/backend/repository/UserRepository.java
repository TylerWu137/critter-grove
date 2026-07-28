package com.crittersapp.backend.repository;

import com.crittersapp.backend.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

// ★ CHANGED — was a hand-written in-memory class; now a plain interface,
// Spring Data auto-implements it. save/findById/findAll/deleteById all
// come free from MongoRepository, no need to declare them.
public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmailIgnoreCase(String email); // ★ CHANGED — added IgnoreCase, preserves old behavior
    boolean existsByEmailIgnoreCase(String email);       // ★ CHANGED — same
}

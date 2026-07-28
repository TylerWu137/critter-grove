package com.crittersapp.backend.repository;

import com.crittersapp.backend.model.Profile;
import org.springframework.data.mongodb.repository.MongoRepository;

// ★ SIMPLIFIED — findByUserId/existsByUserId are gone entirely. Profile's
// @Id IS userId (same design as before), so MongoRepository's built-in
// findById(userId)/existsById(userId) already do exactly that — no custom
// method needed. See ProfileService for the updated call sites.
public interface ProfileRepository extends MongoRepository<Profile, String> {
    boolean existsByNameIgnoreCase(String name); // ★ CHANGED — added IgnoreCase
}

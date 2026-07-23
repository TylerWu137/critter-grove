package com.crittersapp.backend.repository;

import com.crittersapp.backend.model.User;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

// ⚠️ TEMPORARY — in-memory storage, purely to test frontend<->backend
// communication before MongoDB Atlas is wired up. Everything is lost on
// restart. Method names deliberately mirror Spring Data conventions
// (findByEmail, existsByEmail, save) so that swapping this out for a real
// `interface UserRepository extends MongoRepository<User, String>` later
// requires little to no change in AuthService, which only calls these
// method names — not this implementation. Ids are Strings (UUIDs here) to
// match MongoDB's ObjectId shape, which MongoRepository will generate
// automatically once that's wired up — this UUID generation is just a
// stand-in for that.
@Repository
public class UserRepository {

    private final ConcurrentHashMap<String, User> users = new ConcurrentHashMap<>();

    public User save(User user) {
        if (user.getId() == null) {
            user.setId(UUID.randomUUID().toString());
        }
        users.put(user.getId(), user);
        return user;
    }

    public Optional<User> findByEmail(String email) {
        return users.values().stream()
                .filter(u -> u.getEmail().equalsIgnoreCase(email))
                .findFirst();
    }

    public Optional<User> findById(String id) {
        return Optional.ofNullable(users.get(id));
    }

    public boolean existsByEmail(String email) {
        return findByEmail(email).isPresent();
    }

    public List<User> findAll() {
        return List.copyOf(users.values());
    }

    // ★ ADDED — used to roll back a just-created user if profile creation
    // fails during sign-up (compensating transaction, since this in-memory
    // store can't do a real cross-document atomic transaction)
    public void deleteById(String id) {
        users.remove(id);
    }
}
package com.crittersapp.backend.repository;

import com.crittersapp.backend.model.User;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

// ⚠️ TEMPORARY — in-memory storage, purely to test frontend<->backend
// communication before a real database exists. Everything is lost on
// restart. Method names deliberately mirror Spring Data JPA conventions
// (findByEmail, existsByEmail, save) so that swapping this out for a real
// `interface UserRepository extends JpaRepository<User, Long>` later
// requires little to no change in AuthService, which only calls these
// method names — not this implementation.
@Repository
public class UserRepository {

    private final ConcurrentHashMap<Long, User> users = new ConcurrentHashMap<>();
    private final AtomicLong idSequence = new AtomicLong(0);

    public User save(User user) {
        if (user.getId() == null) {
            user.setId(idSequence.incrementAndGet());
        }
        users.put(user.getId(), user);
        return user;
    }

    public Optional<User> findByEmail(String email) {
        return users.values().stream()
                .filter(u -> u.getEmail().equalsIgnoreCase(email))
                .findFirst();
    }

    public Optional<User> findById(Long id) {
        return Optional.ofNullable(users.get(id));
    }

    public boolean existsByEmail(String email) {
        return findByEmail(email).isPresent();
    }

    public List<User> findAll() {
        return List.copyOf(users.values());
    }
}

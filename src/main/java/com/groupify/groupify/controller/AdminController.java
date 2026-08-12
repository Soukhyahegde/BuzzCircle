package com.groupify.groupify.controller;


import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.groupify.groupify.model.Circle;
import com.groupify.groupify.repository.CircleRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/circles")
@RequiredArgsConstructor
public class AdminController {

    private final CircleRepository circleRepository;

    @GetMapping("/pending")
    public ResponseEntity<List<Circle>> getPendingCircles() {
        List<Circle> pending = circleRepository.findByApproved(false);
        pending.forEach(circle -> circle.setMembers(new java.util.HashSet<>()));
        return ResponseEntity.ok(pending);
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<String> approveCircle(@PathVariable Long id) {
        Optional<Circle> optional = circleRepository.findById(id);
        if (optional.isPresent()) {
            Circle circle = optional.get();
            circle.setApproved(true);
            circleRepository.save(circle);
            return ResponseEntity.ok("Circle approved.");
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}/reject")
    public ResponseEntity<String> rejectCircle(@PathVariable Long id) {
        if (circleRepository.existsById(id)) {
            circleRepository.deleteById(id);
            return ResponseEntity.ok("Circle rejected and deleted.");
        }
        return ResponseEntity.notFound().build();
    }
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/users/{userId}")
    public ResponseEntity<?> deleteUser(@PathVariable Long userId) {
        // Only admins can delete users
        return ResponseEntity.ok("User deleted");
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        // Only admins can view stats
        return ResponseEntity.ok("Stats");
    }
}


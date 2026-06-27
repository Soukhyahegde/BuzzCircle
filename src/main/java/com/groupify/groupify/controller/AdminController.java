package com.groupify.groupify.controller;


import com.groupify.groupify.model.Circle;
import com.groupify.groupify.repository.CircleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin/circles")
public class AdminController {

    private CircleRepository circleRepository;

    @GetMapping("/pending")
    public ResponseEntity<List<Circle>> getPendingCircles() {
        return ResponseEntity.ok(circleRepository.findByApproved(false));
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


package com.groupify.groupify.controller;

import com.groupify.groupify.model.Circle;
import com.groupify.groupify.model.User;
import com.groupify.groupify.repository.CircleRepository;
import com.groupify.groupify.repository.UserRepository;
import com.groupify.groupify.service.CircleService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import javax.management.RuntimeErrorException;

@Slf4j
@RestController
@RequestMapping("/api/circles")
@RequiredArgsConstructor
public class CircleController {
    private final CircleRepository circleRepo;

    private final UserRepository userRepo;

    private final CircleService circleService;

    @GetMapping
    public List<Circle> getAllCircles() {
        return circleRepo.findAll();
    }
    @GetMapping("/{circleId}")
    public Circle getCircleById(@PathVariable Long circleId) {
        return circleRepo.findById(circleId).orElseThrow(() -> new RuntimeException("Cannot find circle: " + circleId));
    }
    @PostMapping
    public  ResponseEntity<Circle> createCircleRequest (@RequestBody Circle circle){
        circle.setApproved(false); // default to unapproved
        Circle saved = circleRepo.save(circle);
        return ResponseEntity.ok(saved);
    }
    @GetMapping("/approved")
    public List<Circle> getApprovedCircles() {
        return circleRepo.findByApproved(true);
    }

    @PutMapping("/{circleId}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> approveCircle(@PathVariable Long circleId) {
        Circle circle = circleRepo.findById(circleId)
                .orElseThrow(() -> new RuntimeException("Circle not found"));
        
        circle.setApproved(true);
        circleRepo.save(circle);
        
        return ResponseEntity.ok("Circle approved successfully");
    }

    @PutMapping("/{circleId}")
    public Circle updateCircle(@PathVariable Long circleId, @RequestBody Circle updatedCircle) {
            Circle existingCircle = circleRepo.findById(circleId).orElseThrow(() -> new RuntimeException("Cannot find circle: " + circleId));
    
            existingCircle.setName(updatedCircle.getName());
            existingCircle.setDescription(updatedCircle.getDescription());
            existingCircle.setTags(updatedCircle.getTags());
    
            return circleRepo.save(existingCircle);
    }

    @DeleteMapping("/{circleId}")
    public ResponseEntity<?> deleteCircle(@PathVariable Long circleId) {
        Circle circle = circleRepo.findById(circleId).orElseThrow(() -> new RuntimeException("Cannot find circle"));
        circleRepo.delete(circle);
        return ResponseEntity.ok().body("Circle deleted successfully");
    }

    @GetMapping("/match/{userId}")
    public List<Circle> matchCircles(@PathVariable Long userId) {
        User user = userRepo.findById(userId).orElseThrow();
        List<String> interests = user.getInterests();
        List<Circle> all = circleRepo.findAll();

        return all.stream()
                .sorted((c1, c2) -> {
                    long match1 = c1.getTags().stream().filter(interests::contains).count();
                    long match2 = c2.getTags().stream().filter(interests::contains).count();
                    return Long.compare(match2, match1);
                })
                .limit(3)
                .toList();
    }

    @PostMapping("/{circleId}/join")
    public ResponseEntity<?> joinCircle(@PathVariable Long circleId){
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        User user = userRepo.findByUsername(username)
        .orElseThrow(()-> new RuntimeException("User Not found"));

        Circle circle = circleRepo.findById(circleId)
        .orElseThrow(()-> new RuntimeException("circle not found"));

        circleService.joinCircle(user, circle);
        return ResponseEntity.ok("Joined circle successfully");
    }

    @PostMapping("/{circleId}/leave")
    public ResponseEntity<?> leaveCircle(@PathVariable Long circleId){
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        User user = userRepo.findByUsername(username)
        .orElseThrow(()-> new RuntimeException("User Not found"));

        Circle circle = circleRepo.findById(circleId)
        .orElseThrow(()-> new RuntimeException("circle not found"));

        circleService.leaveCircle(user, circle);
        log.info("Leaving circle");
        return ResponseEntity.ok("Left the circle");
    }
}


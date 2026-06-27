package com.groupify.groupify.controller;

import com.groupify.groupify.model.Circle;
import com.groupify.groupify.model.User;
import com.groupify.groupify.model.Post;
import com.groupify.groupify.dto.AuthRequest;
import com.groupify.groupify.dto.CircleSummaryDTO;
import com.groupify.groupify.dto.UserDTO;
import com.groupify.groupify.repository.CircleRepository;
import com.groupify.groupify.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
// import io.swagger.v3.oas.annotations.media.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import io.swagger.v3.oas.annotations.media.*;

import org.springframework.http.MediaType;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;

import java.util.List;
import java.util.Set;

@Slf4j
@RestController
@RequestMapping("api/user")
@RequiredArgsConstructor
public class UserController {
    private final CircleRepository circleRepo;
    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;


    @GetMapping
    public List<User> getAllUsers() {
        return userRepo.findAll();
    }

    @GetMapping("/{userId}")
    public ResponseEntity<?> getUserById (@PathVariable Long userId){
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserDTO dto = new UserDTO(
                user.getId(),
                user.getUsername(),
                user.getFollowers().size(),
                user.getFollowing().size()
        );

        return ResponseEntity.ok(dto);
    }

    @PutMapping("/{userId}")
    public ResponseEntity<User> updateUser(
            @PathVariable Long userId,
            @RequestPart(required = false) String name,
            @RequestPart(required = false) String email,
            @RequestPart(required = false) String password,
            @RequestPart(required = false) String bio,
            @RequestPart(required = false) MultipartFile profilePicture
    ) {
        
        return (ResponseEntity<User>) userRepo.findById(userId)
        .map(user -> {
            if (name != null) user.setUsername(name);
            if (email != null) user.setEmail(email);
            if (password != null) user.setPassword(passwordEncoder.encode(password));
            if (bio != null) user.setBio(bio);
            if (profilePicture != null && !profilePicture.isEmpty()) {
                try {
                    user.setProfilePicture(profilePicture.getBytes());
                } catch (Exception e) {
                    return ResponseEntity.badRequest().build();
                }
            }
            User savedUser = userRepo.save(user);
            return ResponseEntity.ok(savedUser);
        })
        .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping(value ="/{userId}/upload-picture",
        consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    @Operation(summary = "Upload an image")
    public ResponseEntity<User> uploadProfilePicture(
            @PathVariable Long userId,
            @RequestPart("file")
            @Parameter(
                description = "Image file to upload",
                required = true,
                content = @Content(
                    mediaType = MediaType.APPLICATION_OCTET_STREAM_VALUE,
                    schema = @Schema(type = "string", format = "binary")
                )
            )
            MultipartFile profilePicture
    ) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (profilePicture != null && !profilePicture.isEmpty()) {
            try {
                user.setProfilePicture(profilePicture.getBytes());
                userRepo.save(user);
                return ResponseEntity.ok(user);
            } catch (Exception e) {
                return ResponseEntity.badRequest().build();
            }
        }
        return ResponseEntity.badRequest().build();
    }

    @DeleteMapping("/{userId}")
    @PreAuthorize("hasRole('ADMIN') or #userId == authentication.principal.id")
    public ResponseEntity<?> deleteUser(@PathVariable Long userId) {
        User user = userRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        userRepo.delete(user);
        return ResponseEntity.ok().body("User deleted successfully");
    }

    @GetMapping("/{userId}/circles")
    public List<CircleSummaryDTO> getUserCircles(@PathVariable Long userId) {
        User user = userRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        return user.getCircles().stream()
                .map(circle -> new CircleSummaryDTO(
                        circle.getId(),
                        circle.getName(),
                        circle.getDescription(),
                        circle.getMembers().size()
                ))
                .toList();
    }

    @GetMapping("/{userId}/posts")
    public List<Post> getUserPosts(@PathVariable Long userId) {
        User user = userRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        return user.getPosts();
    }

    @PostMapping("/{userId}/follow")
    public ResponseEntity<?> followUser(@PathVariable Long userId, @RequestParam Long followerId) {
        //String username = SecurityContextHolder.getContext().getAuthentication().getName();
        if (userId.equals(followerId)) {
            return ResponseEntity.badRequest().body("You cannot follow yourself.");
        }
        User userToFollow = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User to follow not found"));

        User follower = userRepo.findById(followerId)
                .orElseThrow(() -> new RuntimeException("Follower not found"));

        if (follower.getFollowing().contains(userToFollow)) {
            return ResponseEntity.badRequest().body("Already following this user.");
        }
        follower.getFollowing().add(userToFollow);
        userToFollow.getFollowers().add(follower);
    
        userRepo.save(follower);
        userRepo.save(userToFollow);

        return ResponseEntity.ok("Followed successfully");
    }

    @PostMapping("/{userId}/unfollow")
    public ResponseEntity<?> unfollowUser(@PathVariable Long userId, @RequestParam Long followerId) {
        User userToUnfollow = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User to unfollow not found"));

        User follower = userRepo.findById(followerId)
                .orElseThrow(() -> new RuntimeException("Follower not found"));

        follower.getFollowing().remove(userToUnfollow);
        userToUnfollow.getFollowers().remove(follower);
    
        userRepo.save(follower);
        userRepo.save(userToUnfollow);
        return ResponseEntity.ok("Unfollowed successfully");
    }

    @GetMapping("/{userId}/followers")
    public ResponseEntity<?> getFollowers(@PathVariable Long userId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<String> followerUsernames = user.getFollowers()
                .stream()
                .map(User::getUsername)
                .toList();

        return ResponseEntity.ok(followerUsernames);
    }

    @GetMapping("/{userId}/following")
    public ResponseEntity<?> getFollowing(@PathVariable Long userId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<String> followingUsernames = user.getFollowing()
                .stream()
                .map(User::getUsername)
                .toList();

        return ResponseEntity.ok(followingUsernames);
    }

    @GetMapping("/{userId}/suggested")
    public List<UserDTO> getSuggestedUsers(@PathVariable Long userId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        log.info("Auth :  ",authentication);
        log.info("auth : ",authentication.getAuthorities());    
        User currentUser = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<User> allUsers = userRepo.findAll();
        
        // Filter out: self, already following, and those who follow them
        return allUsers.stream()
                .filter(user -> !user.getId().equals(userId))
                .filter(user -> !currentUser.getFollowing().contains(user))
                .limit(4)
                .map(user -> new UserDTO(user.getId(), user.getUsername(), user.getFollowers().size(), user.getFollowing().size()))
                .toList();
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody AuthRequest authRequest) {
        // Validate input FIRST
        if (authRequest.getUsername() == null || authRequest.getUsername().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Username is required");
        }
        
        if (authRequest.getPassword() == null || authRequest.getPassword().isEmpty()) {
            return ResponseEntity.badRequest().body("Password is required");
        }

        // Check if username already exists (after validation)
        if (userRepo.findByUsername(authRequest.getUsername().trim()).isPresent()) {
            return ResponseEntity.badRequest().body("Username already exists");
        }

        try {
            User newUser = new User();
            newUser.setUsername(authRequest.getUsername().trim());
            newUser.setPassword(passwordEncoder.encode(authRequest.getPassword()));
            if (authRequest.getEmail() != null && !authRequest.getEmail().isEmpty()) {
                newUser.setEmail(authRequest.getEmail());
            }
            
            // Assign USER role by default
            newUser.setRoles(Set.of("ROLE_USER"));
            
            userRepo.save(newUser);
            return ResponseEntity.ok("User registered successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Registration failed: " + e.getMessage());
        }
    }


}

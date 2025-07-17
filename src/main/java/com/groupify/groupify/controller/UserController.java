package com.groupify.groupify.controller;

import com.groupify.groupify.model.Circle;
import com.groupify.groupify.model.User;
import com.groupify.groupify.model.Post;
import com.groupify.groupify.dto.UserDTO;
import com.groupify.groupify.repository.CircleRepository;
import com.groupify.groupify.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
@RestController
@RequestMapping("api/user")
@RequiredArgsConstructor
public class UserController {
    @Autowired
    private final CircleRepository circleRepo = null;
    @Autowired
    private final UserRepository userRepo = null;


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
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String password,
            @RequestParam(required = false) String bio,
            @RequestParam(required = false) MultipartFile profilePicture
    ) {
       return (ResponseEntity<User>) userRepo.findById(userId)
        .map(user -> {
            if (name != null) user.setUsername(name);
            if (email != null) user.setEmail(email);
            if (password != null) user.setPassword(password); // hash before saving in production!
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

    @DeleteMapping("/{userId}")
    public ResponseEntity<?> deleteUser(@PathVariable Long userId) {
        User user = userRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        userRepo.delete(user);
        return ResponseEntity.ok().body("User deleted successfully");
    }

    @GetMapping("/{userId}/circles")
    public List<Circle> getUserCircles(@PathVariable Long userId) {
        User user = userRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        return user.getCircles();
    }

    @GetMapping("/{userId}/posts")
    public List<Post> getUserPosts(@PathVariable Long userId) {
        User user = userRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        return user.getPosts();
    }

    @PostMapping("/{userId}/follow")
    public ResponseEntity<?> followUser(@PathVariable Long userId, @RequestParam Long followerId) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        if (userId.equals(followerId)) {
            return ResponseEntity.badRequest().body("You cannot follow yourself.");
        }
        User userToFollow = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User to follow not found"));

        User follower = userRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Follower not found"));

        if (follower.getFollowing().contains(userToFollow)) {
            return ResponseEntity.badRequest().body("Already following this user.");
        }
        follower.getFollowing().add(userToFollow);
        userRepo.save(follower);

        return ResponseEntity.ok("Followed successfully");
    }

    @PostMapping("/{userId}/unfollow")
    public ResponseEntity<?> unfollowUser(@PathVariable Long userId, @RequestParam Long followerId) {
        User userToUnfollow = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User to unfollow not found"));

        User follower = userRepo.findById(followerId)
                .orElseThrow(() -> new RuntimeException("Follower not found"));

        follower.getFollowing().remove(userToUnfollow);
        userRepo.save(follower);

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


}

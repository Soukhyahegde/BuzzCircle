package com.groupify.groupify.controller;
import com.groupify.groupify.model.Post;
import com.groupify.groupify.model.User;
import com.groupify.groupify.repository.PostRepository;
import com.groupify.groupify.repository.UserRepository;
import com.groupify.groupify.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController  {
    @Autowired
    private final PostRepository postRepository = null;
    @Autowired
    private final UserRepository userRepository = null;
    @Autowired
    private PostService postService;

    @GetMapping("/{userId}")
    public List<Post> getPostsByUser (@PathVariable Long userId){
        return postRepository.findByUserId(userId);
    }

    @PostMapping
    public Post createPost (@RequestBody Post post){
        Long userId = post.getUser().getId();
        User user = userRepository.findById(userId).orElseThrow(
                () -> new RuntimeException("User not found with userId : "+userId)
        );
        post.setUser(user);
        return postRepository.save(post);
    }
    @PutMapping("/{postId}")
    public Post updatePost (@PathVariable Long postId, @RequestBody Post updatedPost){
        Post existingPost = postRepository.findById(postId).orElseThrow(()-> new RuntimeException("Cannot find post: "+postId));

        existingPost.setContent(updatedPost.getContent());
        existingPost.setUpvotes(updatedPost.getUpvotes());

        return  postRepository.save(existingPost);
    }

    @DeleteMapping("/{postId}")
    public ResponseEntity<?> deletePost (@PathVariable Long postId){
        Post post = postRepository.findById(postId).orElseThrow(() -> new RuntimeException("Cannot find post"));

        postRepository.delete(post);
        return ResponseEntity.ok().body("Post deleted successfully");
    }
    @PostMapping("/{postId}/upvote")
    public ResponseEntity<String> upvotePost(@PathVariable Long postId, @RequestParam Long userId) {
        Post post = postRepository.findById(postId).orElseThrow(() -> new RuntimeException("Cannot find post: " + postId));
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("Cannot find user: " + userId));
        boolean success = postService.upvotePost(post, user);
        if (success) {
            return ResponseEntity.ok("Upvoted successfully");
        } else {
            return ResponseEntity.badRequest().body("User has already upvoted this post");
        }
    }
}

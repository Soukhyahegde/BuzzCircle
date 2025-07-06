package com.buzzcircle.buzzcircle.controller;
import com.buzzcircle.buzzcircle.model.Post;
import com.buzzcircle.buzzcircle.model.User;
import com.buzzcircle.buzzcircle.repository.PostRepository;
import com.buzzcircle.buzzcircle.repository.UserRepository;
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
}

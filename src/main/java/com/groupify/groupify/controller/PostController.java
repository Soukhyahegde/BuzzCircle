package com.groupify.groupify.controller;
import com.groupify.groupify.dto.PostSummaryDTO;
import com.groupify.groupify.dto.UserDTO;
import com.groupify.groupify.model.Post;
import com.groupify.groupify.model.User;
import com.groupify.groupify.repository.PostRepository;
import com.groupify.groupify.repository.UserRepository;
import com.groupify.groupify.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.PageRequest;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController  {
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final PostService postService;

    @GetMapping
    public ResponseEntity<Page<PostSummaryDTO>> getPosts(
                @RequestParam(defaultValue = "0") int page,
                @RequestParam(defaultValue = "10") int size,
                @RequestParam(defaultValue = "createdAt") String sortBy,
                @RequestParam(defaultValue = "desc") String direction)
    {
        Sort sort = direction.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(page, size, sort);
        Page<PostSummaryDTO> posts = postRepository.findAll(pageable).map(this::toPostSummary);
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<Page<PostSummaryDTO>> getPostsByUser (@PathVariable Long userId,
                @RequestParam(defaultValue = "0") int page,
                @RequestParam(defaultValue = "10") int size,
                @RequestParam(defaultValue = "createdAt") String sortBy,
                @RequestParam(defaultValue = "desc") String direction)
    {
        Sort sort = direction.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(page, size, sort);
        Page<PostSummaryDTO> posts = postRepository.findByUserId(userId, pageable).map(this::toPostSummary);
        return ResponseEntity.ok(posts);
    }

    private PostSummaryDTO toPostSummary(Post post) {
        User user = post.getUser();
        UserDTO userDto = new UserDTO(
                user.getId(),
                user.getUsername(),
                user.getFollowers().size(),
                user.getFollowing().size()
        );

        return new PostSummaryDTO(
                post.getId(),
                post.getTitle(),
                post.getContent(),
                post.getUpvotes(),
                post.getComments(),
                post.getImages(),
                post.getCreatedAt(),
                userDto
        );
    }

    @PostMapping
    public PostSummaryDTO createPost (@RequestBody Post post){
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
        .orElseThrow(() -> new RuntimeException("User not found"));
        post.setUser(user);
        return toPostSummary(postRepository.save(post));
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

package com.groupify.groupify.service;

import com.groupify.groupify.model.Post;
import com.groupify.groupify.model.User;
import com.groupify.groupify.model.PostUpvote;
import com.groupify.groupify.repository.PostUpvoteRepository;
import com.groupify.groupify.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PostService {
    @Autowired
    private PostRepository postRepository;
    @Autowired
    private PostUpvoteRepository postUpvoteRepository;

    public boolean upvotePost(Post post, User user) {
        if (postUpvoteRepository.findByPostAndUser(post, user).isPresent()) {
            return false; // User already upvoted
        }
        PostUpvote upvote = new PostUpvote();
        upvote.setPost(post);
        upvote.setUser(user);
        postUpvoteRepository.save(upvote);
        post.setUpvotes(post.getUpvotes() + 1);
        postRepository.save(post);
        return true;
    }
}

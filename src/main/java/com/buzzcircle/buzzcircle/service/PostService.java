package com.buzzcircle.buzzcircle.service;

import com.buzzcircle.buzzcircle.model.Post;
import com.buzzcircle.buzzcircle.model.User;
import com.buzzcircle.buzzcircle.model.PostUpvote;
import com.buzzcircle.buzzcircle.repository.PostUpvoteRepository;
import com.buzzcircle.buzzcircle.repository.PostRepository;
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

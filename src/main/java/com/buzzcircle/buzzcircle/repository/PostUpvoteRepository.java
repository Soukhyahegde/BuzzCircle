package com.buzzcircle.buzzcircle.repository;

import com.buzzcircle.buzzcircle.model.PostUpvote;
import com.buzzcircle.buzzcircle.model.Post;
import com.buzzcircle.buzzcircle.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PostUpvoteRepository extends JpaRepository<PostUpvote, Long> {
    Optional<PostUpvote> findByPostAndUser(Post post, User user);
}

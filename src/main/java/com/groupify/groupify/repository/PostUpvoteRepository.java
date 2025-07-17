package com.groupify.groupify.repository;

import com.groupify.groupify.model.PostUpvote;
import com.groupify.groupify.model.Post;
import com.groupify.groupify.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PostUpvoteRepository extends JpaRepository<PostUpvote, Long> {
    Optional<PostUpvote> findByPostAndUser(Post post, User user);
}

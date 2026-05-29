package com.groupify.groupify.repository;

import com.groupify.groupify.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findByUserId (Long userId);
    Optional<Post> findById (Long postId);
}

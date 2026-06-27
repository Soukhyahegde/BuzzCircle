package com.groupify.groupify.repository;

import com.groupify.groupify.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    Page<Post> findByUserId (Long userId, Pageable pageable);
    Optional<Post> findById (Long postId);
}

package com.groupify.groupify.dto;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

import com.groupify.groupify.model.Post;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PostSummaryDTO {
    private Long id;
    private String content;
    private String title;
    private int upvotes;
    private String comments;
    private List<String> images;
    private LocalDateTime createdAt;
    private UserDTO user;

    public static PostSummaryDTO from(Post post) {
        UserDTO user = new UserDTO(
                post.getUser().getId(),
                post.getUser().getUsername(),
                0,
                0
        );

        return new PostSummaryDTO(
                post.getId(),
                post.getContent(),
                post.getTitle(),
                post.getUpvotes(),
                post.getComments(),
                Collections.emptyList(),
                post.getCreatedAt(),
                user
        );
    }
}

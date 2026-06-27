package com.groupify.groupify.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PostSummaryDTO {
    private Long id;
    private String title;
    private String content;
    private int upvotes;
    private String comments;
    private String images;
    private LocalDateTime createdAt;
    private UserDTO user;
}

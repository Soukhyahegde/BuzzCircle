package com.groupify.groupify.dto;

import com.groupify.groupify.model.Comment;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommentDTO {
    private Long id;
    private String content;
    private LocalDateTime createdAt;
    private UserDTO user;

    public static CommentDTO from(Comment comment) {
        UserDTO userDto = new UserDTO(
                comment.getUser().getId(),
                comment.getUser().getUsername(),
                0,
                0
        );
        return new CommentDTO(
                comment.getId(),
                comment.getContent(),
                comment.getCreatedAt(),
                userDto
        );
    }
}

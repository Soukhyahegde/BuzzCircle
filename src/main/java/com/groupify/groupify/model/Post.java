package com.groupify.groupify.model;

import java.sql.Blob;
import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "posts")
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long Id;
    private String content;
    private String title;
    private int upvotes;
    private String comments;

    @Column(columnDefinition = "LONGTEXT")
    private String images;

    @Column(name = "created_at", nullable=false, updatable = false)
    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @PrePersist
    protected void onCreate(){
        createdAt = LocalDateTime.now();
    }
}

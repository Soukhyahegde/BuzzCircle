package com.buzzcircle.buzzcircle.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "posts")
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long Id;
    private String content;
    private int upvotes;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}

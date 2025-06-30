package com.buzzcircle.buzzcircle.model;
import jakarta.persistence.*;
import lombok.*;
//import org.springframework.data.annotation.Id;

import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Challenge {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;

    private LocalDate startDate;
    private LocalDate endDate;

    @ManyToOne
    @JoinColumn(name = "circle_id")
    private Circle circle;
}


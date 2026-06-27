package com.groupify.groupify.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CircleSummaryDTO {
    private Long id;
    private String name;
    private String description;
    private int memberCount;
}

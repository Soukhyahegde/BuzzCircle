package com.buzzcircle.buzzcircle.dto;

public class AuthResponse {
    private Long userId;
    private String username;

    public AuthResponse(Long userId, String username) {
        this.userId = userId;
        this.username = username;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
}

package com.buzzcircle.buzzcircle.controller;

import com.buzzcircle.buzzcircle.model.Circle;
import com.buzzcircle.buzzcircle.model.User;
import com.buzzcircle.buzzcircle.repository.CircleRepository;
import com.buzzcircle.buzzcircle.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/circles")
@RequiredArgsConstructor
public class CircleController {
    @Autowired
    private final CircleRepository circleRepo = null;
    @Autowired
    private final UserRepository userRepo = null;

    @GetMapping
    public List<Circle> getAllCircles() {
        return circleRepo.findAll();
    }
    @GetMapping("/match/{userId}")
    public List<Circle> matchCircles(@PathVariable Long userId) {
        User user = userRepo.findById(userId).orElseThrow();
        List<String> interests = user.getInterests();
        List<Circle> all = circleRepo.findAll();

        return all.stream()
                .sorted((c1, c2) -> {
                    long match1 = c1.getTags().stream().filter(interests::contains).count();
                    long match2 = c2.getTags().stream().filter(interests::contains).count();
                    return Long.compare(match2, match1);
                })
                .limit(3)
                .toList();
    }
}


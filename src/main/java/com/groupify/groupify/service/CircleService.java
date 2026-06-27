package com.groupify.groupify.service;

import com.groupify.groupify.model.Circle;
import com.groupify.groupify.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.groupify.groupify.repository.CircleRepository;

import lombok.extern.slf4j.Slf4j;

import java.util.*;

@Slf4j
@Service
public class CircleService {
    @Autowired
    private CircleRepository circleRepository;
    public List<Circle> matchUserToCircles(User user) {
        // Logic for matching user interests to circles
        List<String> userInterests = user.getInterests();

        List<Circle> allCircles = circleRepository.findAll();

        // Score circles based on shared tags
        Map<Circle, Integer> scored = new HashMap<>();
        for (Circle c : allCircles) {
            int score = 0;
            for (String interest : userInterests) {
                if (c.getTags().contains(interest.toLowerCase())) {
                    score += 1;
                }
            }
            scored.put(c, score);
        }

        // Return top 3 scored circles
        return scored.entrySet()
                .stream()
                .sorted((e1, e2) -> e2.getValue() - e1.getValue())
                .limit(3)
                .map(Map.Entry::getKey)
                .toList();

    }

    public void joinCircle(User user, Circle circle){
        if(!circle.getMembers().contains(user)){
            circle.getMembers().add(user);
            circleRepository.save(circle);
        }
    }

    public void leaveCircle(User user, Circle circle){
        circle.getMembers().remove(user);
        circleRepository.save(circle);
    }
}


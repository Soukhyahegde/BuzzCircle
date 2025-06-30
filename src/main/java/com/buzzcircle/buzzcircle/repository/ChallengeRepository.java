package com.buzzcircle.buzzcircle.repository;

import com.buzzcircle.buzzcircle.model.Challenge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChallengeRepository extends JpaRepository<Challenge, Long> {
    List<Challenge> findByCircleId(Long circleId);
}


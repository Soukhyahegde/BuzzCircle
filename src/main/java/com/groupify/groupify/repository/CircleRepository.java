package com.groupify.groupify.repository;

import com.groupify.groupify.model.Circle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CircleRepository extends JpaRepository<Circle, Long> {
    List<Circle> findByApproved(boolean approved);
}


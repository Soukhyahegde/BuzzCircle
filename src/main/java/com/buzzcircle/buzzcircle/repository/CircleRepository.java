package com.buzzcircle.buzzcircle.repository;

import com.buzzcircle.buzzcircle.model.Circle;
import com.buzzcircle.buzzcircle.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CircleRepository extends JpaRepository<Circle, Long> {

}


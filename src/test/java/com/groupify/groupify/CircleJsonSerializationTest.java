package com.groupify.groupify;

import java.util.List;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThatCode;
import org.junit.jupiter.api.Test;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.groupify.groupify.model.Circle;
import com.groupify.groupify.model.User;

class CircleJsonSerializationTest {

    @Test
    void circleMembersShouldNotCauseInfiniteRecursion() {
        User user = new User();
        user.setId(1L);
        user.setUsername("alice");

        Circle circle = new Circle();
        circle.setId(10L);
        circle.setName("Test Circle");
        circle.setApproved(false);

        user.setCircles(List.of(circle));
        circle.setMembers(Set.of(user));

        ObjectMapper mapper = new ObjectMapper();

        assertThatCode(() -> mapper.writeValueAsString(circle))
                .doesNotThrowAnyException();
    }
}

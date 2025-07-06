package com.buzzcircle.buzzcircle.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenAPIConfig {

    @Bean
    public OpenAPI buzzCircleOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("BuzzCircle API")
                        .version("1.0")
                        .description("Interest-based social networking API"));
    }
}


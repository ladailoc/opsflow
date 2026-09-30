package com.opsflow;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.security.autoconfigure.UserDetailsServiceAutoConfiguration;

@SpringBootApplication(exclude = UserDetailsServiceAutoConfiguration.class)
public class OpsFlowApplication {

    public static void main(String[] args) {
        SpringApplication.run(OpsFlowApplication.class, args);
    }
}

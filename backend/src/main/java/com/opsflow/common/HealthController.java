package com.opsflow.common;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {

    @GetMapping("/api/v1/health")
    public ResponseEntity<Void> health() {
        return ResponseEntity.noContent().build();
    }
}

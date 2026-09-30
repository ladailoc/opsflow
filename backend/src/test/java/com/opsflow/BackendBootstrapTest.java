package com.opsflow;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.test.context.ActiveProfiles;

@ActiveProfiles("smoke")
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class BackendBootstrapTest {

    @LocalServerPort
    private int port;

    @Test
    void healthIsAvailableWhileBusinessRoutesStayClosed() throws Exception {
        try (HttpClient client = HttpClient.newHttpClient()) {
            HttpRequest health = HttpRequest.newBuilder(URI.create("http://localhost:" + port + "/api/v1/health"))
                    .GET().build();
            HttpRequest business = HttpRequest.newBuilder(URI.create("http://localhost:" + port + "/api/v1/tickets"))
                    .GET().build();

            assertEquals(204, client.send(health, HttpResponse.BodyHandlers.discarding()).statusCode());
            assertEquals(403, client.send(business, HttpResponse.BodyHandlers.discarding()).statusCode());
        }
    }
}

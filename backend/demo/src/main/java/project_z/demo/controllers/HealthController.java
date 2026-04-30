package project_z.demo.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {
    @RequestMapping(path = "/api/v1/health",method = RequestMethod.HEAD)
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("ok");
    }
}

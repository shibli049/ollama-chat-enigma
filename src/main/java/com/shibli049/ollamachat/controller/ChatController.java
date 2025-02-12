package com.shibli049.ollamachat.controller;

import com.shibli049.ollamachat.model.ChatRequest;
import com.shibli049.ollamachat.model.ChatResponse;
import com.shibli049.ollamachat.service.OllamaService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;

@CrossOrigin(origins = "http://localhost:5174", allowedHeaders = "*", methods = {RequestMethod.POST, RequestMethod.OPTIONS})
@RestController
@RequestMapping("/api/chat")
public class ChatController {
    
    private final OllamaService ollamaService;
    
    public ChatController(OllamaService ollamaService) {
        this.ollamaService = ollamaService;
    }
    
    @PostMapping(produces = MediaType.APPLICATION_NDJSON_VALUE)
    public Flux<ChatResponse> chat(@RequestBody ChatRequest request) {
        return ollamaService.chat(request);
    }
}

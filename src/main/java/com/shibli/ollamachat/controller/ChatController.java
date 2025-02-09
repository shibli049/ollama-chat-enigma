package com.shibli.ollamachat.controller;

import com.shibli.ollamachat.model.ChatRequest;
import com.shibli.ollamachat.model.ChatResponse;
import com.shibli.ollamachat.service.OllamaService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;

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

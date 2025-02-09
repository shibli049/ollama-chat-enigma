package com.shibli.ollamachat.service;

import com.shibli.ollamachat.model.ChatRequest;
import com.shibli.ollamachat.model.ChatResponse;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;

@Service
public class OllamaService {
    
    private final WebClient webClient;
    
    public OllamaService(WebClient ollamaWebClient) {
        this.webClient = ollamaWebClient;
    }
    
    public Flux<ChatResponse> chat(ChatRequest request) {
        return webClient.post()
                .uri("/api/generate")
                .bodyValue(request)
                .retrieve()
                .bodyToFlux(ChatResponse.class);
    }
}

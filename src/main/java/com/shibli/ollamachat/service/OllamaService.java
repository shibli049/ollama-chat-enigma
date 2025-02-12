package com.shibli.ollamachat.service;

import com.shibli.ollamachat.model.ChatRequest;
import com.shibli.ollamachat.model.ChatResponse;
import com.shibli.ollamachat.model.Message;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;

import java.util.ArrayList;
import java.util.List;

@Service
public class OllamaService {
    private final WebClient webClient;
    private static final int MAX_HISTORY_SIZE = 100;

    public OllamaService(WebClient ollamaWebClient) {
        this.webClient = ollamaWebClient;
    }

    public Flux<ChatResponse> chat(ChatRequest request) {
        // Limit history size
        final List<Message> messages;
        if (request.getMessages().size() > MAX_HISTORY_SIZE) {
            var requestMessages = request.getMessages();
            messages = new ArrayList<>(requestMessages.subList(requestMessages.size() - MAX_HISTORY_SIZE, requestMessages.size()));
            request.setMessages(messages);
        } else {
            messages = request.getMessages();
        }

        messages.add(new Message("user", request.getPrompt()));
//        request.setPrompt(null);


//        // Format conversation history
//        StringBuilder conversation = new StringBuilder();
//        conversation.append("System: You are a helpful AI assistant.\n\n");
//
//        for (Message message : messages) {
//            conversation.append(message.getRole())
//                    .append(": ")
//                    .append(message.getContent())
//                    .append("\n\n");
//        }
        
        // Add current prompt
//        conversation.append("user: ").append(request.getPrompt()).append("\n\n");
        
        // Update the request with formatted conversation
//        request.setPrompt(conversation.toString());
//        request.setMessages(new ArrayList<>()); // Clear individual messages

        return webClient.post()
                .uri("/api/generate")
                .bodyValue(request)
                .retrieve()
                .bodyToFlux(ChatResponse.class);
    }
}

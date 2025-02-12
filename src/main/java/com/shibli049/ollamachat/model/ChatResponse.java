package com.shibli049.ollamachat.model;

import lombok.Data;

@Data
public class ChatResponse {
    private String model;
    private Message message;
    private String response;
    private boolean done;
}

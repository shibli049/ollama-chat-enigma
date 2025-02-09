package com.shibli.ollamachat.model;

import lombok.Data;

@Data
public class ChatRequest {
    private String model = "deepseek-r1:1.5b";
    private String prompt;
    private boolean stream = true;
}

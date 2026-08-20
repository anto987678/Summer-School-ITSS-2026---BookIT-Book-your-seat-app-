package com.itsmartsystems.bookyourseat.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

@Configuration
public class EmailConfig {

    @Bean
    public JavaMailSender javaMailSender() {
        // Minimal no-op configuration for development.
        JavaMailSenderImpl sender = new JavaMailSenderImpl();
        // Do not set host/port — sending will be a no-op in dev.
        return sender;
    }
}

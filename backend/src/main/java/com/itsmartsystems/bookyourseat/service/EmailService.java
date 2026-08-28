package com.itsmartsystems.bookyourseat.service;

import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import jakarta.mail.MessagingException;
import org.springframework.mail.javamail.MimeMessageHelper;


@Service
public class EmailService {

    @Value("${app.frontend-base-url:http://localhost:5173}")
    private String frontendBaseUrl;

    private final JavaMailSender sender ;
    public EmailService(JavaMailSender sender)
    {
        this.sender = sender;
    }

    public void emailToSend(String email , String token) throws MessagingException
    {
        MimeMessage message = sender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);
        helper.setTo(email);
        helper.setSubject("Forgot Password");
        String content = "<!DOCTYPE html>\n" +
            "<html>\n" +
            "<head>\n" +
            "<style>\n" +
            "  body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }\n" +
            "  .container { background-color: #ffffff; border-radius: 8px; padding: 30px; max-width: 500px; margin: 0 auto; }\n" +
            "  .footer { margin-top: 30px; font-size: 12px; color: #888888; }\n" +
            "  .signature { margin-top: 30px; border-top: 1px solid #cccccc; padding-top: 20px; }\n" +
            "  .signature p { margin: 2px 0; font-size: 13px; color: #333333; }\n" +
            "  .signature .gray { color: #888888; }\n" +
            "</style>\n" +
            "</head>\n" +
            "<body>\n" +
            "  <div class=\"container\">\n" +
            "    <h2>Resetare parolă</h2>\n" +
            "    <p>Ai solicitat resetarea parolei pentru contul tău Book Your Seat.</p>\n" +
            "    <p>Apasă butonul de mai jos pentru a-ți seta o parolă nouă. Link-ul este valabil 15 minute.</p>\n" +
            "    <a href=\"http://localhost:5173/reset-password?token=" + token + "\" " +
            "style=\"display:inline-block; background-color:#2563eb; color:#ffffff; padding:12px 24px; text-decoration:none; border-radius:6px; margin-top:20px; font-weight:bold;\">Resetează parola</a>\n" +
            "    <p class=\"footer\">Dacă nu ai solicitat această acțiune, poți ignora acest email.</p>\n" +
            "    <div class=\"signature\">\n" +
            "      <img src=\"cid:logoImage\" width=\"150\"><br><br>\n" +
            "      <p><strong>Tomulescu Eduard</strong></p>\n" +
            "      <p class=\"gray\">Mobile +40 749 856 745</p>\n" +
            "      <p><a href=\"mailto:tomulescu.eduard11@gmail.com\">tomulescu.eduard11@gmail.com</a></p>\n" +
            "    </div>\n" +
            "  </div>\n" +
            "</body>\n" +
            "</html>";
        helper.setText(content , true );
        helper.addInline("logoImage", new ClassPathResource("static/preview.png"));
        sender.send(message);
    }
}
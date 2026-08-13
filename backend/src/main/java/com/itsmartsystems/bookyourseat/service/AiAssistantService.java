package com.itsmartsystems.bookyourseat.service;

import com.itsmartsystems.bookyourseat.dto.RoutesOption;
import com.itsmartsystems.bookyourseat.dto.WeatherInfo;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.web.util.UriComponentsBuilder;
@Service
public class AiAssistantService {

    @Value("${openai.api.key}")
    private String apiKey;

    @Value("${office.latitude}")
    private double latDest ;

    @Value("${office.longitude}")
    private double longDest;

    private final RestTemplate restTemplate;
    private final TrafficService trafficService;
    private final WeatherService weatherService;

    public AiAssistantService(RestTemplate restTemplate, TrafficService trafficService, WeatherService weatherService) {
        this.restTemplate = restTemplate;
        this.trafficService = trafficService;
        this.weatherService = weatherService;
    }

    public String createURL(double latOrigin , double longOrigin , LocalDateTime targetHour , String metodaDeplasare){
        return UriComponentsBuilder.fromUriString("https://www.google.com/maps/dir/")
                .queryParam("api", "1")
                .queryParam("origin" , latOrigin + "," + longOrigin)
                .queryParam("destination" , latDest + "," + longDest)
                .queryParam("travelmode" , metodaDeplasare)
                .build().toUriString();
    }
    public String getRecommendation(double latOrigin, double longOrigin, LocalDateTime targetHour , String metodaDeplasare) {
        List<RoutesOption> routes = trafficService.getTrafficRoutes(latOrigin, longOrigin, metodaDeplasare);
        WeatherInfo weather = weatherService.getWeather(latOrigin, longOrigin, targetHour);

        String prompt = "Un angajat vrea sa ajunga la birou la ora "
                + targetHour + ". Rutele disponibile calculate cu trafic real sunt:\n"
                + routes
                + "\n\nPrognoza meteo pentru momentul plecarii:\n"
                + "Temperatura: " + weather.getTemperature() + " C\n"
                + "Viteza vantului: " + weather.getWindSpeed() + " km/h\n"
                + "Precipitatii: " + weather.getPrecipitation() + " mm\n"
                + "Ninsoare: " + weather.getSnowfall() + " cm\n"
                + "Cod meteo: " + weather.getWeatherCode() + "\n\n"
                + "Recomanda ruta cea mai rapida, explicand pe scurt de ce. "
                + "Daca observi conditii meteo extreme, incepe raspunsul cu 'ALERTA METEO:' "
                + "si avertizeaza clar utilizatorul. Raspunde in romana, concis, intr-un paragraf.";

        HashMap<String, Object> message = new HashMap<>();
        message.put("role", "user");
        message.put("content", prompt);

        HashMap<String, Object> request = new HashMap<>();
        request.put("model", "gpt-4o-mini");
        request.put("messages", List.of(message));

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + apiKey);
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<HashMap<String, Object>> entity = new HttpEntity<>(request, headers);
        ResponseEntity<Map> requestAi = restTemplate.postForEntity(
                "https://api.openai.com/v1/chat/completions",
                entity,
                Map.class
        );

        Map<String, Object> body = requestAi.getBody();
        if (body == null || body.get("choices") == null) {
            return "Nu am putut genera o recomandare momentan.";
        }

        List<Map<String, Object>> choices = (List<Map<String, Object>>) body.get("choices");
        if (choices.isEmpty()) {
            return "Nu am putut genera o recomandare momentan.";
        }

        Map<String, Object> firstChoice = choices.get(0);
        Map<String, Object> responseMessage = (Map<String, Object>) firstChoice.get("message");
        if (responseMessage == null || responseMessage.get("content") == null) {
            return "Nu am putut genera o recomandare momentan.";
        }

        String aiText = responseMessage.get("content").toString();
        String mapsUrl = createURL(latOrigin, longOrigin, targetHour, metodaDeplasare);

        return aiText + "\n\n" + mapsUrl;
    }
}
package com.itsmartsystems.bookyourseat.service;

import com.itsmartsystems.bookyourseat.dto.RoutesOption;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import org.springframework.http.HttpHeaders;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class TrafficService {


    // coordonatele firmei
    private static final double latDest = 44.4485;
    private static final double longDest = 26.0463;

    @Value("${google.maps.api.key}")
    private String apiKey ;

    @Value("${google.maps.routes.url}")
    private String mapsURL;

    private final RestTemplate restTemplate ;


    public TrafficService(RestTemplate restTemplate)
    {
        this.restTemplate = restTemplate;
    }

    public List<RoutesOption> getTrafficRoutes(double latOrigin, double longOrigin , String metodaDeplasare) {
        // am creat structura map urilor pentru json - > origin
        /*
        "origin":{
            "location":{
              "latLng":{
                "latitude": 37.419734,
                "longitude": -122.0827784
                    }
                }
            }
         */
        HashMap<String , Object> latLng = new HashMap<>();
        latLng.put("latitude",latOrigin);
        latLng.put("longitude",longOrigin);
        HashMap<String , Object> location = new HashMap<>();
        location.put("latLng" , latLng);
        HashMap<String , Object> origin = new HashMap<>();
        origin.put("location",location);


        /*
        "destination":{
            "location":{
              "latLng":{
                "latitude": 37.417670,
                "longitude": -122.079595
              }
            }
          },
         */
        HashMap<String , Object> latLngDest = new HashMap<>();
        latLngDest.put("latitude",latDest);
        latLngDest.put("longitude",longDest);

        HashMap<String , Object> locationDest = new HashMap<>();
        locationDest.put("latLng" , latLngDest);

        HashMap<String , Object> originDest = new HashMap<>();
        originDest.put("location",locationDest);

        HashMap<String,Object> requestBody = new HashMap<>();
        requestBody.put("origin" , origin);
        requestBody.put("destination" , originDest);
        requestBody.put("travelMode" , metodaDeplasare);
        requestBody.put("routingPreference", "TRAFFIC_AWARE");
        requestBody.put("computeAlternativeRoutes", true );

        // HEADERS
        HttpHeaders headers = new HttpHeaders();
        headers.set("X-Goog-Api-Key" , apiKey);
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("X-Goog-FieldMask", "routes.duration,routes.distanceMeters");

        // combinam REQUEST + HEADERS intr un ENTITY
        HttpEntity< Map<String, Object>> entity = new HttpEntity<>(requestBody , headers);

        // Trimitem cererea
        ResponseEntity<Map> cerere = restTemplate.postForEntity(mapsURL, entity , Map.class);

        // Primim raspunsul
        Map<String , Object> response = cerere.getBody();
        List<Map<String, Object>> routes = (List<Map<String, Object>>) response.get("routes");


        // creez o lista care sa contina toate rutele
        List<RoutesOption> result = new ArrayList<>();
        for(Map<String , Object> route : routes)
        {
            Integer distanceM = (Integer) route.get("distanceMeters");
            String durationS= (String) route.get("duration");
            long duration = Long.parseLong(durationS.replace("s",""));

            RoutesOption option = new RoutesOption("Ruta " + (result.size() + 1) , distanceM , duration);
            result.add(option);
        }
        return result ;
    }











}
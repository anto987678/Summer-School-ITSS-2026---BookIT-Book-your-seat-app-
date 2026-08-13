package com.itsmartsystems.bookyourseat.dto;


import jakarta.validation.constraints.NotBlank;



public class AprobareRezervareRequest {

    @NotBlank(message = "Reservation id must not be empty")
    private String idRezervare;

    public String getIdRezervare() {
        return idRezervare;
    }

    public boolean isAprobare() {
        return aprobare;
    }

    public String getMotiv() {
        return motiv;
    }

    private boolean aprobare;

    private String motiv;

    public AprobareRezervareRequest(String idRezervare, boolean aprobare, String motiv) {
        this.idRezervare = idRezervare;
        this.aprobare = aprobare;
        this.motiv = motiv;
    }
    public AprobareRezervareRequest() {}
}
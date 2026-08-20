package com.itsmartsystems.bookyourseat.dto;

import jakarta.validation.constraints.NotBlank;

public class UpdatePhoneRequest {

    @NotBlank(message = "Phone number must not be empty")
    private String phoneNumber;

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }
}

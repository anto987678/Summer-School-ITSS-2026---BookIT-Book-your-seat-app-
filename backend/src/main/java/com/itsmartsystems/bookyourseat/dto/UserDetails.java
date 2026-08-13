package com.itsmartsystems.bookyourseat.dto;

import com.itsmartsystems.bookyourseat.model.User;

public class UserDetails {

    private String id;
    private String name;
    private String email;
    private User.Role role;

    public UserDetails(String id, String name, String email, User.Role role) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
    }

    public UserDetails(String name, String email, User.Role role) {
        this.name = name;
        this.email = email;
        this.role = role;
    }

    public UserDetails() {}

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public User.Role getRole() {
        return role;
    }

    public void setRole(User.Role role) {
        this.role = role;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
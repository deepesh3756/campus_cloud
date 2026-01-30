package com.campuscloud.users_service.dto;

import com.fasterxml.jackson.databind.JsonNode;

import lombok.Data;

@Data
public class BulkRegisterEntryDto {

    private String role;

    private JsonNode data;
}

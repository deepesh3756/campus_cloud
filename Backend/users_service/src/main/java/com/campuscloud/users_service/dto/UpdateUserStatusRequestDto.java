package com.campuscloud.users_service.dto;

import com.campuscloud.users_service.entity.Status;

import lombok.Data;

@Data
public class UpdateUserStatusRequestDto 
{
    private Status status;
}

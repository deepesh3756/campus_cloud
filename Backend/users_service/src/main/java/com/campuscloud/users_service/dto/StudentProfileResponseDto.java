package com.campuscloud.users_service.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class StudentProfileResponseDto extends BaseUserProfileResponseDto {

    private String prn;
}

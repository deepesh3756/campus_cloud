package com.campuscloud.users_service.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class UserProfileUpdateRequestDto extends BaseProfileFieldsDto {

    // student-only
    private String prn;
}

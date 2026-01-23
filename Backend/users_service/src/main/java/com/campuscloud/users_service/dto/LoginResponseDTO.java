package com.campuscloud.users_service.dto;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponseDTO 
{
	    private String username;
	    private String role;
	    private String token;
}

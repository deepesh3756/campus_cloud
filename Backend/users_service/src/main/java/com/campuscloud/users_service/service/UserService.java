package com.campuscloud.users_service.service;

import java.util.List;

import com.campuscloud.users_service.dto.AdminRegisterRequestDto;
import com.campuscloud.users_service.dto.BulkRegisterEntryDto;
import com.campuscloud.users_service.dto.FacultyRegisterRequestDto;
import com.campuscloud.users_service.dto.StudentRegisterRequestDto;
import com.campuscloud.users_service.dto.UserResponseDto;
import com.campuscloud.users_service.entity.Status;
import com.campuscloud.users_service.entity.User;

public interface UserService {

	public void registerAdmin(AdminRegisterRequestDto dto);
	
	public void registerFaculty(FacultyRegisterRequestDto dto);
	
	public void registerStudent(StudentRegisterRequestDto dto);
	
    void updateUserStatus(Long userId, Status status);

    List<UserResponseDto> getAllAdmins();

    List<UserResponseDto> getAllFaculties();

    List<UserResponseDto> getAllStudents();

    List<UserResponseDto> registerUsersInBulk(List<BulkRegisterEntryDto> request);
    
    String resolveFullName(User user);

    void changePassword(String username, String currentPassword, String newPassword);
}

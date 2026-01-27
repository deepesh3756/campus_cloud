package com.campuscloud.users_service.service.impl;

import org.springframework.stereotype.Service;

import com.campuscloud.users_service.dto.FacultyRegisterRequestDto;
import com.campuscloud.users_service.entity.Faculty;
import com.campuscloud.users_service.entity.Gender;
import com.campuscloud.users_service.entity.User;
import com.campuscloud.users_service.repository.FacultyRepository;
import com.campuscloud.users_service.service.FacultyProfileService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FacultyProfileServiceImpl implements FacultyProfileService {

    private final FacultyRepository facultyRepository;

    @Override
    public void createFacultyProfile(User user, FacultyRegisterRequestDto dto) {

        Faculty faculty = new Faculty();
        faculty.setUser(user);
        faculty.setFirstName(dto.getFirstName());
        faculty.setLastName(dto.getLastName());
        faculty.setEmail(dto.getEmail());
        faculty.setMobile(dto.getMobile());
        faculty.setGender(Gender.valueOf(dto.getGender()));
        faculty.setProfilePictureUrl(dto.getProfilePictureUrl());

        facultyRepository.save(faculty);
    }

    @Override
    public String getFullName(User user) {
        return facultyRepository.findByUser(user)
                .map(f -> f.getFirstName() + " " + f.getLastName())
                .orElse(null);
    }
}


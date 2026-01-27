package com.campuscloud.users_service.service.impl;

import org.springframework.stereotype.Service;

import com.campuscloud.users_service.dto.StudentRegisterRequestDto;
import com.campuscloud.users_service.entity.Gender;
import com.campuscloud.users_service.entity.Student;
import com.campuscloud.users_service.entity.User;
import com.campuscloud.users_service.repository.StudentRepository;
import com.campuscloud.users_service.service.StudentProfileService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StudentProfileServiceImpl implements StudentProfileService {

    private final StudentRepository studentRepository;

    @Override
    public void createStudentProfile(User user, StudentRegisterRequestDto dto) {

        Student student = new Student();
        student.setUser(user);
        student.setPrn(dto.getPrn());
        student.setFirstName(dto.getFirstName());
        student.setLastName(dto.getLastName());
        student.setEmail(dto.getEmail());
        student.setMobile(dto.getMobile());
        student.setGender(Gender.valueOf(dto.getGender()));
        student.setProfilePictureUrl(dto.getProfilePictureUrl());

        studentRepository.save(student);
    }

    @Override
    public String getFullName(User user) {
        return studentRepository.findByUser(user)
                .map(s -> s.getFirstName() + " " + s.getLastName())
                .orElse(null);
    }
}

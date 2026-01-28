package com.campuscloud.academicservice.service;



import com.campuscloud.academicservice.dto.request.CreateSubjectRequest;
import com.campuscloud.academicservice.dto.response.SubjectDTO;
import com.campuscloud.academicservice.entity.Subject;
import com.campuscloud.academicservice.exception.DuplicateResourceException;
import com.campuscloud.academicservice.exception.ResourceNotFoundException;
import com.campuscloud.academicservice.repository.SubjectRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class SubjectService {
    
    @Autowired
    private SubjectRepository subjectRepository;
    
    @Transactional
    public SubjectDTO createSubject(CreateSubjectRequest request) {
        log.info("Creating subject: {}", request.getSubjectCode());
        
        if (subjectRepository.existsBySubjectCode(request.getSubjectCode())) {
            throw new DuplicateResourceException("Subject code already exists: " + request.getSubjectCode());
        }
        
        Subject subject = Subject.builder()
                .subjectCode(request.getSubjectCode())
                .subjectName(request.getSubjectName())
                .build();
        
        Subject savedSubject = subjectRepository.save(subject);
        log.info("Subject created successfully: {}", savedSubject.getSubjectId());
        
        return SubjectDTO.fromEntity(savedSubject);
    }
    
    public SubjectDTO getSubjectById(Long subjectId) {
        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found: " + subjectId));
        return SubjectDTO.fromEntity(subject);
    }
    
    public List<SubjectDTO> getAllSubjects() {
        return subjectRepository.findAll().stream()
                .map(SubjectDTO::fromEntity)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public void deleteSubject(Long subjectId) {
        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found: " + subjectId));
        
        subjectRepository.delete(subject);
        log.info("Subject deleted: {}", subjectId);
    }
}

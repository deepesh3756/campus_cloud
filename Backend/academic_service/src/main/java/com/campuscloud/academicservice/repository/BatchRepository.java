package com.campuscloud.academicservice.repository;

import com.campuscloud.academicservice.entity.Batch;
import com.campuscloud.academicservice.enums.BatchStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BatchRepository extends JpaRepository<Batch, Long> {
    
    Optional<Batch> findByBatchName(String batchName);
    
    boolean existsByBatchName(String batchName);
    
    List<Batch> findByStatus(BatchStatus status);
    
    List<Batch> findByOrderByCreatedAtDesc();
}
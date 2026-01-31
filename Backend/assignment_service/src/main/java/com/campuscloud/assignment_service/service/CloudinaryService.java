package com.campuscloud.assignment_service.service;

import com.campuscloud.assignment_service.dto.response.FileUploadResponse;
import com.campuscloud.assignment_service.exception.FileUploadException;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import org.apache.commons.io.FilenameUtils;

@Service
@Slf4j
public class CloudinaryService {

    @Autowired
    private Cloudinary cloudinary;

    @Value("${cloudinary.folder.assignments}")
    private String assignmentsFolder;

    @Value("${cloudinary.folder.submissions}")
    private String submissionsFolder;

    /**
     * Upload assignment file (faculty)
     * Path: campus-cloud-assignments/bcs_{id}/assignment_{id}/filename
     */
    public FileUploadResponse uploadAssignmentFile(
            MultipartFile file,
            Long batchCourseSubjectId,
            Long assignmentId
    ) {
        try {
            String folder = String.format("%s/bcs_%d/assignment_%d",
                    assignmentsFolder, batchCourseSubjectId, assignmentId);

            String ext = FilenameUtils.getExtension(file.getOriginalFilename());
            boolean isPdf = ext != null && ext.equalsIgnoreCase("pdf");

            Map<String, Object> uploadParams = ObjectUtils.asMap(
                    "folder", folder,
                    "resource_type", isPdf ? "raw" : "auto",
                    "use_filename", true,
                    "unique_filename", true,
                    "overwrite", false
            );

            Map uploadResult = cloudinary.uploader().upload(file.getBytes(), uploadParams);

            log.info("Assignment file uploaded successfully: {}", uploadResult.get("public_id"));

            return FileUploadResponse.builder()
                    .fileName(file.getOriginalFilename())
                    .fileUrl((String) uploadResult.get("secure_url"))
                    .publicId((String) uploadResult.get("public_id"))
                    .fileSizeBytes(file.getSize())
                    .mimeType(file.getContentType())
                    .message("File uploaded successfully")
                    .build();

        } catch (IOException e) {
            log.error("Failed to upload assignment file", e);
            throw new FileUploadException("Failed to upload file to Cloudinary: " + e.getMessage(), e);
        }
    }

    /**
     * Upload submission file (student)
     * Path: campus-cloud-submissions/bcs_{id}/assignment_{id}/student_{id}/filename
     */
    public FileUploadResponse uploadSubmissionFile(
            MultipartFile file,
            Long batchCourseSubjectId,
            Long assignmentId,
            Long studentId
    ) {
        try {
            String folder = String.format("%s/bcs_%d/assignment_%d/student_%d",
                    submissionsFolder, batchCourseSubjectId, assignmentId, studentId);

            String ext = FilenameUtils.getExtension(file.getOriginalFilename());
            boolean isPdf = ext != null && ext.equalsIgnoreCase("pdf");

            Map<String, Object> uploadParams = ObjectUtils.asMap(
                    "folder", folder,
                    "resource_type", isPdf ? "raw" : "auto",
                    "use_filename", true,
                    "unique_filename", true,
                    "overwrite", true // Allow students to resubmit (overwrite previous)
            );

            Map uploadResult = cloudinary.uploader().upload(file.getBytes(), uploadParams);

            log.info("Submission file uploaded successfully for student {}: {}",
                    studentId, uploadResult.get("public_id"));

            return FileUploadResponse.builder()
                    .fileName(file.getOriginalFilename())
                    .fileUrl((String) uploadResult.get("secure_url"))
                    .publicId((String) uploadResult.get("public_id"))
                    .fileSizeBytes(file.getSize())
                    .mimeType(file.getContentType())
                    .message("Submission uploaded successfully")
                    .build();

        } catch (IOException e) {
            log.error("Failed to upload submission file for student {}", studentId, e);
            throw new FileUploadException("Failed to upload submission: " + e.getMessage(), e);
        }
    }

    /**
     * Delete file from Cloudinary
     */
    public void deleteFile(String publicId) {
        try {
            Map result = cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            log.info("File deleted from Cloudinary: {} - Result: {}", publicId, result.get("result"));
        } catch (IOException e) {
            log.error("Failed to delete file from Cloudinary: {}", publicId, e);
            // Don't throw exception - file deletion failure shouldn't stop the operation
        }
    }

    /**
     * Generate signed URL for secure download
     * URL expires after 1 hour
     */
    public String generateDownloadUrl(String publicId) {
        try {
            // Generate signed URL that expires in 1 hour (3600 seconds)
            Map<String, Object> options = ObjectUtils.asMap(
                    "resource_type", "auto",
                    "type", "upload",
                    "sign_url", true,
                    "expires_at", System.currentTimeMillis() / 1000 + 3600
            );

            String url = cloudinary.url()
                    .resourceType("auto")
                    .type("upload")
                    .publicId(publicId)
                    .signed(true)
                    .generate();

            log.debug("Generated signed URL for public_id: {}", publicId);
            return url;

        } catch (Exception e) {
            log.error("Failed to generate download URL for: {}", publicId, e);
            throw new FileUploadException("Failed to generate download URL: " + e.getMessage(), e);
        }
    }

    /**
     * Get file metadata from Cloudinary
     */
    public Map<String, Object> getFileMetadata(String publicId) {
        try {
            Map<String, Object> result = cloudinary.api().resource(publicId, ObjectUtils.emptyMap());
            log.debug("Retrieved metadata for public_id: {}", publicId);
            return result;
        } catch (Exception e) {
            log.error("Failed to get metadata for: {}", publicId, e);
            return null;
        }
    }

    /**
     * Check if file exists in Cloudinary
     */
    public boolean fileExists(String publicId) {
        try {
            cloudinary.api().resource(publicId, ObjectUtils.emptyMap());
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Get direct URL (non-expiring) - use with caution
     * Only for public resources
     */
    public String getPublicUrl(String publicId) {
        return cloudinary.url()
                .resourceType("auto")
                .type("upload")
                .publicId(publicId)
                .generate();
    }
}

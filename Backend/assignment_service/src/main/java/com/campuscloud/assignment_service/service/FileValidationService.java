package com.campuscloud.assignment_service.service;

import com.campuscloud.assignment_service.exception.InvalidFileException;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.FilenameUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Arrays;
import java.util.List;

@Service
@Slf4j
public class FileValidationService {

    @Value("${file.upload.allowed-types}")
    private String allowedTypesStr;

    @Value("${file.upload.max-size-mb}")
    private int maxSizeMb;

    private static final List<String> DANGEROUS_EXTENSIONS = Arrays.asList(
            "exe", "bat", "cmd", "com", "pif", "scr", "vbs", "js", "jar", "sh", "app"
    );

    /**
     * Validate file for assignment upload
     */
    public void validateAssignmentFile(MultipartFile file) {
        validateFile(file, "Assignment");
    }

    /**
     * Validate file for submission upload
     */
    public void validateSubmissionFile(MultipartFile file) {
        validateFile(file, "Submission");
    }

    /**
     * Main validation method
     */
    private void validateFile(MultipartFile file, String context) {
        // Check if file is empty
        if (file == null || file.isEmpty()) {
            throw new InvalidFileException(context + " file cannot be empty");
        }

        // Validate file name
        validateFileName(file.getOriginalFilename(), context);

        // Validate file size
        validateFileSize(file.getSize(), context);

        // Validate file type
        validateFileType(file.getContentType(), file.getOriginalFilename(), context);

        // Additional security checks
        validateFileExtension(file.getOriginalFilename(), context);

        log.info("{} file validation passed: {} ({})", 
                context, file.getOriginalFilename(), formatFileSize(file.getSize()));
    }

    /**
     * Validate file name
     */
    private void validateFileName(String fileName, String context) {
        if (fileName == null || fileName.trim().isEmpty()) {
            throw new InvalidFileException(context + " file name is required");
        }

        // Check for path traversal attempts
        if (fileName.contains("..") || fileName.contains("/") || fileName.contains("\\")) {
            throw new InvalidFileException(
                    "Invalid file name: Path traversal characters not allowed"
            );
        }

        // Check for special characters that might cause issues
        if (fileName.matches(".*[<>:\"|?*].*")) {
            throw new InvalidFileException(
                    "Invalid file name: Contains illegal characters"
            );
        }

        // Check file name length
        if (fileName.length() > 255) {
            throw new InvalidFileException(
                    "File name too long (max 255 characters)"
            );
        }
    }

    /**
     * Validate file size
     */
    private void validateFileSize(long fileSize, String context) {
        if (fileSize == 0) {
            throw new InvalidFileException(context + " file is empty (0 bytes)");
        }

        long maxSizeBytes = (long) maxSizeMb * 1024 * 1024;
        if (fileSize > maxSizeBytes) {
            throw new InvalidFileException(
                    String.format("%s file size exceeds limit. Maximum allowed: %d MB, File size: %s",
                            context, maxSizeMb, formatFileSize(fileSize))
            );
        }
    }

    /**
     * Validate file MIME type
     */
    private void validateFileType(String contentType, String fileName, String context) {
        if (contentType == null || contentType.trim().isEmpty()) {
            throw new InvalidFileException(context + " file type cannot be determined");
        }

        List<String> allowedTypes = Arrays.asList(allowedTypesStr.split(","));

        boolean isAllowed = allowedTypes.stream()
                .anyMatch(type -> contentType.toLowerCase().contains(type.toLowerCase()));

        if (!isAllowed) {
            throw new InvalidFileException(
                    String.format("File type not allowed: %s. Allowed types: PDF, ZIP, DOCX, DOC, PPTX, JPG, PNG",
                            contentType)
            );
        }

        log.debug("File type validation passed: {} for file: {}", contentType, fileName);
    }

    /**
     * Validate file extension for security
     */
    private void validateFileExtension(String fileName, String context) {
        String extension = FilenameUtils.getExtension(fileName);
        
        if (extension == null || extension.trim().isEmpty()) {
            throw new InvalidFileException(context + " file must have an extension");
        }

        // Check for dangerous extensions
        if (DANGEROUS_EXTENSIONS.contains(extension.toLowerCase())) {
            throw new InvalidFileException(
                    String.format("File extension not allowed: .%s (Security risk)", extension)
            );
        }

        // Whitelist of allowed extensions
        List<String> allowedExtensions = Arrays.asList(
                "pdf", "zip", "docx", "doc", "pptx", "ppt", "xlsx", "xls",
                "jpg", "jpeg", "png", "txt", "md", "rar", "7z"
        );

        if (!allowedExtensions.contains(extension.toLowerCase())) {
            throw new InvalidFileException(
                    String.format("File extension not allowed: .%s", extension)
            );
        }
    }

    /**
     * Check if file is an image
     */
    public boolean isImageFile(String contentType) {
        if (contentType == null) return false;
        return contentType.startsWith("image/");
    }

    /**
     * Check if file is a PDF
     */
    public boolean isPdfFile(String contentType) {
        if (contentType == null) return false;
        return contentType.equalsIgnoreCase("application/pdf");
    }

    /**
     * Check if file is a compressed archive
     */
    public boolean isArchiveFile(String contentType, String fileName) {
        if (contentType == null) return false;
        String extension = FilenameUtils.getExtension(fileName);
        
        return contentType.contains("zip") || 
               contentType.contains("rar") ||
               contentType.contains("7z") ||
               extension.equalsIgnoreCase("zip") ||
               extension.equalsIgnoreCase("rar") ||
               extension.equalsIgnoreCase("7z");
    }

    /**
     * Format file size for display
     */
    private String formatFileSize(long bytes) {
        if (bytes < 1024) return bytes + " B";
        if (bytes < 1024 * 1024) return String.format("%.2f KB", bytes / 1024.0);
        return String.format("%.2f MB", bytes / (1024.0 * 1024.0));
    }

    /**
     * Get file extension
     */
    public String getFileExtension(String fileName) {
        return FilenameUtils.getExtension(fileName);
    }

    /**
     * Sanitize file name
     */
    public String sanitizeFileName(String fileName) {
        if (fileName == null) return null;
        
        // Remove path separators and special characters
        String sanitized = fileName.replaceAll("[/\\\\<>:\"|?*]", "_");
        
        // Remove leading/trailing dots and spaces
        sanitized = sanitized.trim().replaceAll("^\\.+", "");
        
        return sanitized;
    }
}


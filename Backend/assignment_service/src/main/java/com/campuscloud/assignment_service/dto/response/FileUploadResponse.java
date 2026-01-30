package com.campuscloud.assignment_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FileUploadResponse {

    private String fileName;
    private String fileUrl; // Cloudinary public URL
    private String publicId; // Cloudinary public ID
    private Long fileSizeBytes;
    private String mimeType;
    private String message;
}
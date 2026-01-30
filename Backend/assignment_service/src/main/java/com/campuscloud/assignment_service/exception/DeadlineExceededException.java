package com.campuscloud.assignment_service.exception;

public class DeadlineExceededException extends RuntimeException {
	
    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public DeadlineExceededException(String message) {
        super(message);
    }
}

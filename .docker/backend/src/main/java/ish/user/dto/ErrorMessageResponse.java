package ish.user.dto;

import lombok.Data;
import lombok.Builder;

import java.time.ZonedDateTime;
import java.util.Date;

@Builder
@Data
public class ErrorMessageResponse {
    private final int status;
    private final ZonedDateTime timestamp;
    private final String path;
    private final String message;
    private final Exception exception;
}

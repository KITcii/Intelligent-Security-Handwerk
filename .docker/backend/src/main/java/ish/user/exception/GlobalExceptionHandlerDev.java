package ish.user.exception;

import ish.user.dto.ErrorMessageResponse;
import lombok.extern.apachecommons.CommonsLog;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.server.ResponseStatusException;

import java.nio.file.AccessDeniedException;
import java.time.ZonedDateTime;
import java.util.Date;

// see: https://www.baeldung.com/exception-handling-for-rest-with-spring
@ConditionalOnProperty(name="ish.error.handling.stacktrace", havingValue="true")
@RestControllerAdvice
@CommonsLog
public class GlobalExceptionHandlerDev /* extends ResponseEntityExceptionHandler */ {

    private static final Log logger = LogFactory.getLog(GlobalExceptionHandlerDev.class);

    //@ExceptionHandler(value = {IllegalArgumentException.class, IllegalStateException.class})
    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ErrorMessageResponse handleRequestArgumentNotSound(Exception ex, WebRequest request) throws ResponseStatusException {
        if (ex instanceof ResponseStatusException)
            throw (ResponseStatusException) ex;

        log.error("GlobalExceptionHandler manual log: " + ex.getMessage(), ex);

        var status = HttpStatus.INTERNAL_SERVER_ERROR;
        return ErrorMessageResponse.builder()
                .status(status.value())
                .timestamp(ZonedDateTime.now())
                .path(request.getDescription(true))
                .message(ex.getMessage())
                .build();
    }

    //@ExceptionHandler(value = {IllegalArgumentException.class, IllegalStateException.class})
    @ExceptionHandler(IllegalArgumentException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorMessageResponse handleRequestArgumentNotSound2(IllegalArgumentException ex, WebRequest request) {
        log.error("IllegalArgumentException handler manual log: " + ex.getMessage(), ex);

        var status = HttpStatus.BAD_REQUEST;
        return ErrorMessageResponse.builder()
                .status(status.value())
                .timestamp(ZonedDateTime.now())
                .path(request.getDescription(false))
                .message(ex.getMessage())
                .exception(ex)
                .build();
    }

    @ExceptionHandler(AccessDeniedException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public ErrorMessageResponse handleUnauthorized(AccessDeniedException ex, WebRequest request) {
        log.error("AccessDeniedException handler manual log: " + ex.getMessage(), ex);

        var status = HttpStatus.UNAUTHORIZED;
        return ErrorMessageResponse.builder()
                .status(status.value())
                .timestamp(ZonedDateTime.now())
                .path(request.getDescription(false))
                .message(ex.getMessage())
                .exception(ex)
                .build();
    }
}

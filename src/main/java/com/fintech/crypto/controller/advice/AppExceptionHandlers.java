package com.fintech.crypto.controller.advice;

import io.jsonwebtoken.ExpiredJwtException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class AppExceptionHandlers {

    private static final Logger LOGGER = LoggerFactory.getLogger(AppExceptionHandlers.class);

    @ExceptionHandler(value = DuplicateKeyException.class)
    public ResponseEntity<Map<String, Object>> handleDuplicateKeyException(DuplicateKeyException e){
        Map<String, Object> error = new HashMap<>();
        error.put("message", e.getMessage());
        error.put("status", 422);
        error.put("mode", "DUPLICATE RECORD");
        error.put("exception", e.getClass().getName());

        LOGGER.info(Arrays.toString(e.getStackTrace()));

        return new ResponseEntity<>(error, HttpStatus.EXPECTATION_FAILED);
    }

    @ExceptionHandler(value = RuntimeException.class)
    public ResponseEntity<Map<String, Object>> handleRuntimeException(RuntimeException e){
        Map<String, Object> error = new HashMap<>();
        error.put("message", e.getMessage());
        error.put("status", HttpStatus.CONFLICT.value());
        error.put("mode", "REQUEST_NOT_COMPLETED");
        error.put("exception", e.getClass().getName());

        LOGGER.info(Arrays.toString(e.getStackTrace()));

        return new ResponseEntity<>(error, HttpStatus.EXPECTATION_FAILED);
    }
    @ExceptionHandler(value = IllegalStateException.class)
    public ResponseEntity<Map<String, Object>> handleIllegalStateException(IllegalStateException e){
        Map<String, Object> error = new HashMap<>();
        error.put("message", e.getMessage());
        error.put("status", HttpStatus.CONFLICT.value());
        error.put("mode", "ILLEGAL_ACTION ");
        error.put("exception", e.getClass().getName());

        LOGGER.info(Arrays.toString(e.getStackTrace()));

        return new ResponseEntity<>(error, HttpStatus.EXPECTATION_FAILED);
    }

    @ExceptionHandler(value = Exception.class)
    public ResponseEntity<Map<String, Object>> handleAppException(Exception e){
        Map<String, Object> error = new HashMap<>();
        error.put("message", e.getMessage());
        error.put("status", HttpStatus.CONFLICT.value());
        error.put("mode", "INTERNAL_SERVER_ERROR");
        error.put("exception", e.getClass().getName());

        LOGGER.info(Arrays.toString(e.getStackTrace()));
        return new ResponseEntity<>(error, HttpStatus.EXPECTATION_FAILED);
    }

    @ExceptionHandler(value = NullPointerException.class)
    public ResponseEntity<Map<String, Object>> handleNullPointerException(NullPointerException e){
        Map<String, Object> error = new HashMap<>();
        error.put("message", e.getMessage());
        error.put("status", HttpStatus.NO_CONTENT.value());
        error.put("mode", "NULL_POINTER");
        error.put("exception", e.getClass().getName());

        LOGGER.info(e.getCause().toString());

        return new ResponseEntity<>(error, HttpStatus.EXPECTATION_FAILED);
    }

    @ExceptionHandler(value = UsernameNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handelUsernameNotFoundException(UsernameNotFoundException e){
        Map<String, Object> error = new HashMap();
        error.put("message", e.getMessage());
        error.put("status", HttpStatus.NON_AUTHORITATIVE_INFORMATION.value());
        error.put("mode", "USER_CREDENTIALS");
        error.put("exception", e.getClass().getName());

        LOGGER.info(Arrays.toString(e.getStackTrace()));

        return new ResponseEntity<>(error, HttpStatus.NON_AUTHORITATIVE_INFORMATION);
    }

    @ExceptionHandler(value = { SecurityException.class, ExpiredJwtException.class })
    public ResponseEntity<Map<String, Object>> handelExpiredJWTException(SecurityException e){
        Map<String, Object> error = new HashMap();
        error.put("message", e.getMessage());
        error.put("status", HttpStatus.UNAUTHORIZED.value());
        error.put("mode", "AUTH ISSUES");
        error.put("exception", e.getClass().getName());

        LOGGER.info(Arrays.toString(e.getStackTrace()));

        return new ResponseEntity<>(error, HttpStatus.UNAUTHORIZED);
    }

}

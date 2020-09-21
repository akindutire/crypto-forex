package com.fintech.crypto.request;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.Email;
import javax.validation.constraints.Max;
import javax.validation.constraints.NotBlank;

@Getter
@Setter
public class SendMailReq {

    @NotBlank
    private String name;

    @NotBlank
    private String subject;

    @Email
    @NotBlank
    private String email;

    @NotBlank
    private String message;

    public String getName() {
        if (this.name.length() > 255){
            throw new StringIndexOutOfBoundsException("Name is too long, max expected is 255 letters");
        }
        return name;
    }

    public String getSubject() {
        if (this.subject.length() > 255){
            throw new StringIndexOutOfBoundsException("Subject is too long, max expected is 255 letters");
        }
        return subject;
    }

    public String getMessage() {
        if (this.name.length() > 1000){
            throw new StringIndexOutOfBoundsException("Message is too long, max expected is 1000 letters");
        }
        return message;
    }

}

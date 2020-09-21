package com.fintech.crypto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MFASetup {
    private String secret;
    private String Uri;
}

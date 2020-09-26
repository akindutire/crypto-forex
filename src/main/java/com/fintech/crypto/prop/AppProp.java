package com.fintech.crypto.prop;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class AppProp {
    public static final String AUTH_ENDPOINTS = "/auth/**";
    public static final String ONBOARD_ENDPOINTS = "/onboard/**";
    public static final String PASSWORD_ENDPOINTS = "/password/**";
    public static final String INTER_SERVICE_ENDPOINTS = "/update/**";


    @Value("https://${app.domain}")
    public String APP_DOMAIN_ADDRESS;

    @Value("${view.web.reset.password}")
    public String VIEW_WEB_PASSWORD_RESET;

    @Value("${jwt.expiration.seconds:2592000}")
    public String EXPIRATION_SECONDS;
    @Value("${jwt.prefix:Bearer }")
    public String TOKEN_PREFIX;
    @Value("${jwt.header:Authorization}")
    public String AUTH_HEADER_STRING;
    @Value("${jwt.secret}")
    public String TOKEN_SECRET;

    @Value("${otp.expiration}")
    public String OTP_THRESHOLD;
    @Value("${otp.length}")
    public String OTP_LENGTH;

    @Value("${password.verification.threshold}")
    public String PASSWORD_VERIFICATION_THRESHOLD;

    @Value("${mailgun.domain}")
    public String MAILGUN_DOMAIN;
    @Value("${mailgun.api.key}")
    public String MAILGUN_API_KEY;
    @Value("${mailgun.mail.address}")
    public String FROM_MAIL_ADDRESS;
    @Value("${mailgun.mail.address.support}")
    public String SUPPORT_MAIL_ADDRESS;

    @Value("${block.io.base.address}")
    public String BLOCKIO_BASE_URL;

    @Value("${coin.payment.base.address}")
    public String COINPAYMENT_BASE_URL;
    @Value("${coin.payment.base.public.api.key}")
    public String COINPAYMENT_PK;
    @Value("${coin.payment.base.private.api.key}")
    public String COINPAYMENT_PR;

    @Value("${crypt.api.key.bitcoin}")
    public String CRYPT_API_KEY_BTC;
    @Value("${crypt.api.key.litecoin}")
    public String CRYPT_API_KEY_LTC;
    @Value("${crypt.api.key.dogecoin}")
    public String CRYPT_API_KEY_DGD;
    @Value("${crypt.api.key.ethereum}")
    public String CRYPT_API_KEY_ETH;
    @Value("${crypt.api.key.zcash}")
    public String CRYPT_API_KEY_ZCH;
    @Value("${crypt.api.key.dash}")
    public String CRYPT_API_KEY_DSH;

    @Value("${crypt.address.bitcoin}")
    public String CRYPT_ADDRESS_BTC;
    @Value("${crypt.address.litecoin}")
    public String CRYPT_ADDRESS_LTC;
    @Value("${crypt.address.dogecoin}")
    public String CRYPT_ADDRESS_DGD;
    @Value("${crypt.address.ethereum}")
    public String CRYPT_ADDRESS_ETH;
    @Value("${crypt.address.zcash}")
    public String CRYPT_ADDRESS_ZCH;
    @Value("${crypt.address.dash}")
    public String CRYPT_ADDRESS_DSH;
}

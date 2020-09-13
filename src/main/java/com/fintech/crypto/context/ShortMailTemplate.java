package com.fintech.crypto.context;


import com.fintech.crypto.mail.Template;

public class ShortMailTemplate {

    Builder builder;
    public ShortMailTemplate(Builder builder) {
        this.builder = builder;
    }

    public String mutate(){
        Template template = new Template();
        return template.shortMessage()
                .replace("${body}",this.builder.body)
                .replace("${logo}","Crypto Fx")
                .replace("${logoLink}", "https://cryptoforex.com")
                .replace("${companyAddress}", "203 Fake St. Mountain View, San Francisco, California, USA")
                .replace("${companyPhone}", "+2 392 3929 210")
                .replace("${heading1}",this.builder.heading1)
                .replace("${heading2}", this.builder.heading2);
    }

    public static class Builder{
        private String heading1 = "";
        private String heading2 = "";
        private String body = "";

        public Builder setHeading1(String heading1) {
            this.heading1 = heading1;
            return this;
        }

        public Builder setHeading2(String heading2) {
            this.heading2 = heading2;
            return this;
        }

        public Builder setBody(String body) {
            this.body = body;
            return this;
        }

        public ShortMailTemplate build(){
            return new ShortMailTemplate(this);
        }
    }
}

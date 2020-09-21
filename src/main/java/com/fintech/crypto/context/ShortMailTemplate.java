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
                .replace("${logo}","<img width='100%' height='auto' src='https://ci6.googleusercontent.com/proxy/otmySUi9aox29vpD79eouRjjfpZGh0QvZM0Q5D4nJ31Bjs5uVAlmH_g9C2si_O2xXMcvqDue5EaTO1wMKBg9jEJlYfin3nFjtY4dc3Q4fiE1Uxs3=s0-d-e1-ft#https://i.ibb.co/59Gbv27/a4f9fd53-ae5e-4918-a4eb-76bffe22684c.jpg' />")
                .replace("${logoLink}", "https://crypto-forex.me")
                .replace("${companyAddress}", "Copyright © – Crypto Forex Ltd All rights reserved 2020")
                .replace("${companyPhone}", "")
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
